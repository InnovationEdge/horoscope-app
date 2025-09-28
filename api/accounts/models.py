from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import pytz


class User(AbstractUser):
    """Custom user model for Salamene Horoscope app"""

    ZODIAC_SIGNS = [
        ('aries', 'Aries'),
        ('taurus', 'Taurus'),
        ('gemini', 'Gemini'),
        ('cancer', 'Cancer'),
        ('leo', 'Leo'),
        ('virgo', 'Virgo'),
        ('libra', 'Libra'),
        ('scorpio', 'Scorpio'),
        ('sagittarius', 'Sagittarius'),
        ('capricorn', 'Capricorn'),
        ('aquarius', 'Aquarius'),
        ('pisces', 'Pisces'),
    ]

    DRUID_SIGNS = [
        ('birch', 'Birch'),
        ('rowan', 'Rowan'),
        ('ash', 'Ash'),
        ('alder', 'Alder'),
        ('willow', 'Willow'),
        ('hawthorn', 'Hawthorn'),
        ('oak', 'Oak'),
        ('holly', 'Holly'),
        ('hazel', 'Hazel'),
        ('vine', 'Vine'),
        ('ivy', 'Ivy'),
        ('reed', 'Reed'),
        ('elder', 'Elder'),
    ]

    CHINESE_ANIMALS = [
        ('rat', 'Rat'),
        ('ox', 'Ox'),
        ('tiger', 'Tiger'),
        ('rabbit', 'Rabbit'),
        ('dragon', 'Dragon'),
        ('snake', 'Snake'),
        ('horse', 'Horse'),
        ('goat', 'Goat'),
        ('monkey', 'Monkey'),
        ('rooster', 'Rooster'),
        ('dog', 'Dog'),
        ('pig', 'Pig'),
    ]

    # Basic profile
    name = models.CharField(max_length=100, null=True, blank=True)
    onboarded = models.BooleanField(default=False)

    # Astrological profile
    sign = models.CharField(max_length=20, choices=ZODIAC_SIGNS, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    birth_time = models.TimeField(null=True, blank=True)
    birth_place = models.CharField(max_length=200, null=True, blank=True)
    druid_sign = models.CharField(max_length=20, choices=DRUID_SIGNS, null=True, blank=True)
    chinese_animal = models.CharField(max_length=20, choices=CHINESE_ANIMALS, null=True, blank=True)

    # Subscription management
    SUBSCRIPTION_STATUS_CHOICES = [
        ('free', 'Free'),
        ('premium', 'Premium'),
        ('trial', 'Trial'),
        ('expired', 'Expired'),
        ('cancelled', 'Cancelled'),
    ]

    SUBSCRIPTION_PLAN_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    is_premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(null=True, blank=True)
    subscription_status = models.CharField(max_length=20, choices=SUBSCRIPTION_STATUS_CHOICES, default='free')
    subscription_plan = models.CharField(max_length=20, choices=SUBSCRIPTION_PLAN_CHOICES, null=True, blank=True)
    subscription_expires_at = models.DateTimeField(null=True, blank=True)

    # App preferences
    notifications_enabled = models.BooleanField(default=True)
    theme_preference = models.CharField(max_length=10, choices=[('dark', 'Dark'), ('light', 'Light')], default='dark')

    def __str__(self):
        return f"{self.username} ({self.sign or 'No sign'})"

    @property
    def is_premium_active(self):
        """Check if premium subscription is still active"""
        if not self.is_premium or not self.premium_until:
            return False
        return self.premium_until > timezone.now()

    def update_premium_status(self):
        """Update premium status based on premium_until date"""
        if self.premium_until and self.premium_until <= timezone.now():
            self.is_premium = False
            self.subscription_status = 'expired'
            self.save(update_fields=['is_premium', 'subscription_status'])

    def calculate_astrological_signs(self):
        """Calculate druid and chinese signs based on birth date"""
        if not self.birth_date:
            return

        # Calculate druid sign (simplified Celtic calendar)
        day_of_year = self.birth_date.timetuple().tm_yday
        druid_mapping = {
            (1, 31): 'birch', (32, 59): 'rowan', (60, 90): 'ash',
            (91, 120): 'alder', (121, 151): 'willow', (152, 181): 'hawthorn',
            (182, 212): 'oak', (213, 243): 'holly', (244, 273): 'hazel',
            (274, 304): 'vine', (305, 334): 'ivy', (335, 365): 'elder'
        }

        for (start, end), sign in druid_mapping.items():
            if start <= day_of_year <= end:
                self.druid_sign = sign
                break

        # Calculate Chinese zodiac
        chinese_animals = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox',
                          'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat']
        year_offset = (self.birth_date.year - 1900) % 12
        self.chinese_animal = chinese_animals[year_offset]

        self.save(update_fields=['druid_sign', 'chinese_animal'])


class UserProfile(models.Model):
    """Extended profile information for users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Location and preferences
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    country = models.CharField(max_length=2, null=True, blank=True)  # ISO country code

    # Usage tracking
    total_readings = models.IntegerField(default=0)
    last_horoscope_read = models.DateTimeField(null=True, blank=True)
    favorite_signs = models.JSONField(default=list, blank=True)

    # Premium features
    premium_trial_used = models.BooleanField(default=False)
    premium_trial_started = models.DateTimeField(null=True, blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.username}"


class SocialAccount(models.Model):
    """Social authentication accounts linked to users"""
    PROVIDER_CHOICES = [
        ('google', 'Google'),
        ('apple', 'Apple'),
        ('facebook', 'Facebook'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_accounts')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    provider_id = models.CharField(max_length=100)
    provider_email = models.EmailField(null=True, blank=True)
    access_token = models.TextField(null=True, blank=True)
    refresh_token = models.TextField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('provider', 'provider_id')

    def __str__(self):
        return f"{self.user.username} - {self.provider}"


class UserSession(models.Model):
    """Track user sessions for analytics"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    session_id = models.CharField(max_length=100, unique=True)
    device_info = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    started_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Session {self.session_id} for {self.user.username}"