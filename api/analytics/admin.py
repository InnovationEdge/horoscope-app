from django.contrib import admin
from django.utils.html import format_html
from .models import AnalyticsEvent, SessionMetrics


@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = ['event', 'user', 'session_short', 'timestamp_readable', 'created_at']
    list_filter = ['event', 'app_version', 'created_at']
    search_fields = ['event', 'session_id', 'user__username']
    readonly_fields = ['timestamp_readable', 'session_short', 'created_at']
    ordering = ['-created_at']

    def timestamp_readable(self, obj):
        """Convert timestamp to readable format"""
        from datetime import datetime
        return datetime.fromtimestamp(obj.timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')
    timestamp_readable.short_description = 'Timestamp'

    def session_short(self, obj):
        """Show shortened session ID"""
        return f"{obj.session_id[:8]}..."
    session_short.short_description = 'Session'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(SessionMetrics)
class SessionMetricsAdmin(admin.ModelAdmin):
    list_display = [
        'session_short', 'user', 'duration_minutes', 'screen_views',
        'tab_switches', 'banner_clicks', 'paywall_views',
        'compatibility_calculations', 'successful_purchases', 'start_time'
    ]
    list_filter = ['start_time', 'successful_purchases', 'paywall_views']
    search_fields = ['session_id', 'user__username']
    readonly_fields = ['session_short', 'duration_minutes']
    ordering = ['-start_time']

    def session_short(self, obj):
        """Show shortened session ID"""
        return f"{obj.session_id[:8]}..."
    session_short.short_description = 'Session'

    def duration_minutes(self, obj):
        """Show duration in minutes"""
        if obj.duration_seconds:
            minutes = obj.duration_seconds / 60
            return f"{minutes:.1f}m"
        return "N/A"
    duration_minutes.short_description = 'Duration'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')