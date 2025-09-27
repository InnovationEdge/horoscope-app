from django.contrib import admin
from .models import CompatibilityPair


@admin.register(CompatibilityPair)
class CompatibilityPairAdmin(admin.ModelAdmin):
    list_display = ['sign_a', 'sign_b', 'overall_score', 'love_score', 'career_score', 'friendship_score', 'created_at']
    list_filter = ['sign_a', 'sign_b', 'overall_score', 'created_at']
    search_fields = ['sign_a', 'sign_b', 'preview_text']
    ordering = ['-overall_score', 'sign_a', 'sign_b']

    def get_readonly_fields(self, request, obj=None):
        if obj:  # editing an existing object
            return ['sign_a', 'sign_b']
        return []