from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserProfile, SocialAccount


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Enhanced admin for User model with full features"""

    list_display = ['username', 'email', 'sign', 'is_premium', 'premium_until', 'onboarded', 'date_joined']
    list_filter = ['is_premium', 'sign', 'onboarded', 'date_joined', 'last_login']
    search_fields = ['username', 'email', 'sign', 'name']
    readonly_fields = ['date_joined', 'last_login']

    fieldsets = UserAdmin.fieldsets + (
        ('Profile Info', {
            'fields': ('name', 'onboarded')
        }),
        ('Astrological Profile', {
            'fields': ('sign', 'birth_date', 'birth_time', 'birth_place', 'druid_sign', 'chinese_animal')
        }),
        ('Premium Status', {
            'fields': ('is_premium', 'premium_until', 'subscription_status', 'subscription_plan')
        }),
        ('App Settings', {
            'fields': ('notifications_enabled', 'theme_preference')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin for extended user profile data"""
    list_display = ['user', 'timezone', 'language', 'total_readings', 'last_horoscope_read']
    list_filter = ['timezone', 'language', 'premium_trial_used']
    search_fields = ['user__email', 'user__username']
    readonly_fields = ['total_readings', 'last_horoscope_read', 'created_at']


@admin.register(SocialAccount)
class SocialAccountAdmin(admin.ModelAdmin):
    """Admin for social authentication accounts"""
    list_display = ['user', 'provider', 'provider_id', 'created_at']
    list_filter = ['provider', 'created_at']
    search_fields = ['user__email', 'provider_id']
    readonly_fields = ['created_at']