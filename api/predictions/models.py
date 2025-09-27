from django.db import models


class Prediction(models.Model):
    """Model for storing horoscope predictions"""

    PREDICTION_TYPES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

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

    sign = models.CharField(max_length=20, choices=ZODIAC_SIGNS)
    prediction_type = models.CharField(max_length=10, choices=PREDICTION_TYPES)
    date_key = models.CharField(max_length=20)  # Format: YYYY-MM-DD, YYYY-WXX, YYYY-MM, YYYY
    text = models.TextField()

    # Daily prediction specific fields
    lucky_number = models.IntegerField(null=True, blank=True)
    lucky_color = models.CharField(max_length=50, null=True, blank=True)
    mood = models.CharField(max_length=50, null=True, blank=True)
    love_score = models.IntegerField(null=True, blank=True)
    career_score = models.IntegerField(null=True, blank=True)
    health_score = models.IntegerField(null=True, blank=True)

    # Premium flag
    premium = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['sign', 'prediction_type', 'date_key']
        indexes = [
            models.Index(fields=['sign', 'prediction_type', 'date_key']),
        ]

    def __str__(self):
        return f"{self.sign} {self.prediction_type} {self.date_key}"


class Banner(models.Model):
    """Model for promotional banners"""

    banner_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200)
    bullets = models.JSONField(default=list)  # List of bullet points
    target = models.CharField(max_length=100)  # Target action/route
    premium_required = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.banner_id}: {self.title}"