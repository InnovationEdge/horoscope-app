from django.contrib import admin
from .models import Prediction, Banner


@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ['sign', 'prediction_type', 'date_key', 'premium', 'created_at']
    list_filter = ['prediction_type', 'sign', 'premium', 'created_at']
    search_fields = ['sign', 'date_key', 'text']
    ordering = ['-created_at']


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['banner_id', 'title', 'target', 'premium_required', 'is_active', 'created_at']
    list_filter = ['premium_required', 'is_active', 'created_at']
    search_fields = ['banner_id', 'title', 'subtitle']
    ordering = ['-created_at']