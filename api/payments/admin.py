from django.contrib import admin
from .models import PaymentPlan, Transaction


@admin.register(PaymentPlan)
class PaymentPlanAdmin(admin.ModelAdmin):
    list_display = ['plan_id', 'name', 'plan_type', 'duration_days', 'price_usd', 'price_eur', 'price_gel', 'is_active']
    list_filter = ['plan_type', 'is_active', 'created_at']
    search_fields = ['plan_id', 'name']
    ordering = ['duration_days']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'user', 'plan', 'amount', 'currency', 'status', 'created_at', 'paid_at']
    list_filter = ['status', 'currency', 'created_at', 'paid_at']
    search_fields = ['transaction_id', 'user__username', 'user__email']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at']
    ordering = ['-created_at']

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return self.readonly_fields + ['user', 'plan', 'amount', 'currency']
        return self.readonly_fields