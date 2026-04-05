from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from .serializers import OrderSerializer

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

# Create your views here.

class UpdateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('id')
        phone = request.data.get('phone')
        address = request.data.get('address')
        items_data = request.data.get('items')

        if not order_id:
            return Response({"error": "Order ID is required"}, status=400)

        with transaction.atomic():
            # Get order and lock for update to prevent concurrent edits
            order = get_object_or_404(Order.objects.select_for_update(), id=order_id, user=request.user)

            # Global block: Shipped, Delivered, Cancelled
            if order.status in ['shipped', 'delivered', 'cancelled']:
                return Response({"error": f"This order cannot be modified in its current status: {order.status}"}, status=400)

            # Update Address/Phone (Until Shipped) 
            if phone:
                order.phone = phone
            if address:
                order.address = address

            order.save()

            # Return full serialized order
            serializer = OrderSerializer(order)
            return Response({
                "message": "Order updated successfully",
                "order": serializer.data
            }, status=200)
