from django.db import transaction
from django.db.models import F
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from orders.models import Order, OrderItem
from coupons.models import Coupon

class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    # Get or create active cart
    def get_active_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user, is_active=True)
        return cart

    def list(self, request):
        cart = self.get_active_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    # Add item to cart safely
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_active_cart(request.user)
        if not cart.is_active:
            return Response({"error": "Cannot add items to inactive cart"}, status=400)

        product_id = request.data.get('product')
        try:
            quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            return Response({"error": "Quantity must be a positive integer"}, status=400)
        if quantity <= 0:
            return Response({"error": "Quantity must be greater than 0"}, status=400)

        product = get_object_or_404(Product, id=product_id)

        if not product.in_stock:
            return Response({"error": "Product out of stock"}, status=400)

        # Update quantity safely using F() to prevent race conditions
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            CartItem.objects.filter(id=cart_item.id).update(quantity=F('quantity') + quantity)
        else:
            cart_item.quantity = quantity
            cart_item.save()

        return Response(CartSerializer(cart).data, status=200)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = self.get_active_cart(request.user)
        product_id = request.data.get('product')
        item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
        item.delete()
        return Response(CartSerializer(cart).data, status=200)

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        cart = self.get_active_cart(request.user)
        product_id = request.data.get('product')
        try:
            quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            return Response({"error": "Quantity must be a positive integer"}, status=400)

        item = get_object_or_404(CartItem, cart=cart, product_id=product_id)

        if quantity <= 0:
            item.delete()
        else:
            CartItem.objects.filter(id=item.id).update(quantity=quantity)

        return Response(CartSerializer(cart).data, status=200)

    @action(detail=False, methods=['post'])
    def apply_coupon(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "Coupon code is required"}, status=400)

        try:
            with transaction.atomic():
                coupon = Coupon.objects.select_for_update().get(code__iexact=code)
                if not coupon.is_valid:
                    return Response({"error": "Coupon is expired or invalid"}, status=400)
                
                cart = self.get_active_cart(request.user)
                
                if cart.coupon:
                    return Response({"error": "Cart already has a coupon applied"}, status=400)

                if coupon.discount_type == "fixed" and coupon.discount >= cart.total_price:
                    return Response({"error":"Can't apply this coupon to this cart"}, status=400) 
                
                cart.coupon = coupon
                cart.save()
        except Coupon.DoesNotExist:
            return Response({"error": "Invalid coupon code"}, status=404)

        return Response(CartSerializer(cart).data, status=200)

    @action(detail=False, methods=['post'])
    def remove_coupon(self, request):
        cart = self.get_active_cart(request.user)
        cart.coupon = None
        cart.save()
        return Response(CartSerializer(cart).data, status=200)

    # Safe checkout
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        cart = self.get_active_cart(request.user)

        if cart.items.count() == 0:
            return Response({"error": "Cart is empty"}, status=400)

        phone = request.data.get('phone')
        address = request.data.get('address')
        city = request.data.get('city', '').lower()
        payment_method = request.data.get('payment_method', 'online')

        if not phone or not address:
            return Response({"error": "Phone and address required"}, status=400)

        shipping_fee = 50 if city in ['cairo', 'giza'] else 80
        cod_fee = float(cart.total_price) * 0.10 if payment_method == 'cod' else 0

        # Compute discount safely
        discount_amount = 0
        if cart.coupon and cart.coupon.is_valid:
            items_total = sum(item.total_price for item in cart.items.select_related('product'))
            if cart.coupon.discount_type == 'percentage':
                discount_amount = items_total * cart.coupon.discount / 100
            else:
                discount_amount = min(cart.coupon.discount, items_total)

        # Start atomic transaction for order creation & stock deduction
        with transaction.atomic():
            # Lock all products involved to prevent race conditions
            products = Product.objects.filter(id__in=cart.items.values_list('product_id', flat=True)).select_for_update()

            # Verify stock
            for item in cart.items.select_related('product'):
                if item.quantity > item.product.stock:
                    return Response(
                        {"error": f"Not enough stock for {item.product.name}. Only {item.product.stock} left"},
                        status=409
                    )

            # Create order
            order = Order.objects.create(
                user=request.user,
                total_price=float(cart.total_price) + shipping_fee + cod_fee,
                shipping_fee=shipping_fee,
                cod_fee=cod_fee,
                coupon=cart.coupon,
                discount_amount=discount_amount,
                phone=phone,
                address=address,
                status='pending' if payment_method == 'online' else 'cod'
            )

            # Create order items
            for item in cart.items.select_related('product'):
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                    price=item.product.price
                )

            # Deduct stock immediately for COD
            if order.status == 'cod':
                for item in order.items.select_related('product'):
                    item.product.stock = F('stock') - item.quantity
                    item.product.save()

            # Update coupon usage count safely
            if cart.coupon:
                coupon = Coupon.objects.select_for_update().get(id=cart.coupon.id)
                coupon.usage_count = F('usage_count') + 1
                coupon.save()

            # Deactivate old cart and create new active cart
            cart.is_active = False
            cart.save()
            Cart.objects.create(user=request.user)

        message = "Order created. Payment required." if order.status == 'pending' else "Order placed successfully"
        return Response({
            "order_id": order.id,
            "message": message,
            "status": order.status
        }, status=201)