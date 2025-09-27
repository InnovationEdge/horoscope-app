from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AnalyticsEvent(models.Model):
    """Model for storing analytics events"""

    EVENT_TYPES = [
        ('screen_view', 'Screen View'),
        ('tab_selected', 'Tab Selected'),
        ('today_pager_swiped', 'Today Pager Swiped'),
        ('read_more_clicked', 'Read More Clicked'),
        ('paywall_shown', 'Paywall Shown'),
        ('upgrade_cta_clicked', 'Upgrade CTA Clicked'),
        ('banner_clicked', 'Banner Clicked'),
        ('traits_sign_changed', 'Traits Sign Changed'),
        ('compatibility_calculated', 'Compatibility Calculated'),
        ('purchase_initiated', 'Purchase Initiated'),
        ('purchase_success', 'Purchase Success'),
        ('purchase_failed', 'Purchase Failed'),
        ('user_signup', 'User Signup'),
        ('app_opened', 'App Opened'),
        ('session_start', 'Session Start'),
        ('session_end', 'Session End'),
    ]

    # Event identification
    event = models.CharField(max_length=50, choices=EVENT_TYPES)
    timestamp = models.BigIntegerField()  # Unix timestamp in milliseconds
    session_id = models.CharField(max_length=100)
    install_id = models.CharField(max_length=100)
    app_version = models.CharField(max_length=20)

    # User context
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    user_props = models.JSONField(default=dict)  # user properties like sign, is_premium

    # Event parameters
    params = models.JSONField(default=dict)

    # Request metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['event', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['session_id']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.event} - {self.session_id[:8]}... - {self.created_at}"


class SessionMetrics(models.Model):
    """Aggregated session metrics for analytics"""

    session_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    # Session timing
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)

    # Session metrics
    screen_views = models.IntegerField(default=0)
    tab_switches = models.IntegerField(default=0)
    banner_clicks = models.IntegerField(default=0)
    paywall_views = models.IntegerField(default=0)

    # Conversion metrics
    compatibility_calculations = models.IntegerField(default=0)
    upgrade_attempts = models.IntegerField(default=0)
    purchase_attempts = models.IntegerField(default=0)
    successful_purchases = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session {self.session_id[:8]}... - {self.duration_seconds}s"