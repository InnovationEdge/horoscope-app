from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom admin for User model"""

    list_display = ['username', 'email', 'sign', 'is_premium', 'premium_until', 'date_joined']
    list_filter = ['is_premium', 'sign', 'provider', 'date_joined']
    search_fields = ['username', 'email', 'sign']

    fieldsets = UserAdmin.fieldsets + (
        ('Astrological Profile', {
            'fields': ('sign', 'birth_date', 'birth_time', 'birth_place', 'druid_sign', 'chinese_animal')
        }),
        ('Premium Status', {
            'fields': ('is_premium', 'premium_until')
        }),
        ('Provider Info', {
            'fields': ('provider', 'provider_id')
        }),
    )