from django.db import models


class CompatibilityPair(models.Model):
    """Model for storing zodiac compatibility data"""

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

    sign_a = models.CharField(max_length=20, choices=ZODIAC_SIGNS)
    sign_b = models.CharField(max_length=20, choices=ZODIAC_SIGNS)

    # Compatibility scores
    overall_score = models.IntegerField()
    love_score = models.IntegerField()
    career_score = models.IntegerField()
    friendship_score = models.IntegerField()

    # Text content
    preview_text = models.TextField()
    premium_text = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['sign_a', 'sign_b']
        indexes = [
            models.Index(fields=['sign_a', 'sign_b']),
        ]

    def __str__(self):
        return f"{self.sign_a} + {self.sign_b} ({self.overall_score}%)"