from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


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

    # User profile fields
    sign = models.CharField(max_length=20, choices=ZODIAC_SIGNS, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    birth_time = models.TimeField(null=True, blank=True)
    birth_place = models.CharField(max_length=200, null=True, blank=True)

    # Premium status
    is_premium = models.BooleanField(default=False)
    premium_until = models.DateTimeField(null=True, blank=True)

    # Computed astrological signs
    druid_sign = models.CharField(max_length=20, choices=DRUID_SIGNS, null=True, blank=True)
    chinese_animal = models.CharField(max_length=20, choices=CHINESE_ANIMALS, null=True, blank=True)

    # Provider info for social login
    provider = models.CharField(max_length=20, null=True, blank=True)
    provider_id = models.CharField(max_length=100, null=True, blank=True)

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
            self.save(update_fields=['is_premium'])