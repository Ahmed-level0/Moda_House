# Create your models here.

from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('cod', 'COD'), # Cash on delivery
        ('paid', 'Paid'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cod_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    coupon = models.ForeignKey('coupons.Coupon', on_delete=models.SET_NULL, null=True, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    phone = models.CharField(max_length=13)
    address = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    payment_reference = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"
    
    def recalculate_total(self):
        """
        Recalculates the order's total price based on its items and any applied coupon.
        """
        items_total = sum(
            (item.price * item.quantity)
            for item in self.items.all()
        )

        if self.coupon:
            if self.coupon.discount_type == 'percentage':
                self.discount_amount = items_total * self.coupon.discount / 100
            else:
                self.discount_amount = min(self.coupon.discount, items_total)
        else:
            self.discount_amount = Decimal('0.00')

        self.total_price = items_total - self.discount_amount + self.shipping_fee + self.cod_fee
        return self.total_price
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"