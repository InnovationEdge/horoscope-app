from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class PaymentPlan(models.Model):
    """Model for subscription plans"""

    PLAN_TYPES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    plan_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=10, choices=PLAN_TYPES)
    duration_days = models.IntegerField()

    # Pricing by region
    price_usd = models.DecimalField(max_digits=10, decimal_places=2)
    price_eur = models.DecimalField(max_digits=10, decimal_places=2)
    price_gel = models.DecimalField(max_digits=10, decimal_places=2)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.plan_type})"


class Transaction(models.Model):
    """Model for payment transactions"""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]

    transaction_id = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    plan = models.ForeignKey(PaymentPlan, on_delete=models.CASCADE)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # External payment provider data
    checkout_url = models.URLField(null=True, blank=True)
    provider_transaction_id = models.CharField(max_length=200, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.transaction_id} - {self.user.username} - {self.status}"

    class Meta:
        ordering = ['-created_at']