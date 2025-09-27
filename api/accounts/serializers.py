from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSignupSerializer(serializers.Serializer):
    """Serializer for user signup"""
    provider = serializers.ChoiceField(
        choices=['apple', 'google', 'facebook', 'guest'],
        required=True
    )
    token = serializers.CharField(required=True)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""

    class Meta:
        model = User
        fields = [
            'id', 'sign', 'birth_date', 'birth_time', 'birth_place',
            'is_premium', 'premium_until', 'druid_sign', 'chinese_animal'
        ]
        read_only_fields = ['id', 'is_premium', 'premium_until']

    def to_representation(self, instance):
        """Custom representation to format user ID and premium status"""
        ret = super().to_representation(instance)
        ret['id'] = f"u_{instance.id}"
        ret['is_premium'] = instance.is_premium_active

        # Format premium_until to ISO date string if exists
        if instance.premium_until:
            ret['premium_until'] = instance.premium_until.strftime('%Y-%m-%d')

        return ret


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""

    class Meta:
        model = User
        fields = ['birth_date', 'birth_time', 'birth_place', 'sign']

    def update(self, instance, validated_data):
        """Update user instance and compute astrological signs"""
        instance = super().update(instance, validated_data)

        # Compute druid and chinese signs if birth_date is updated
        if 'birth_date' in validated_data and instance.birth_date:
            instance.druid_sign = self.compute_druid_sign(instance.birth_date)
            instance.chinese_animal = self.compute_chinese_animal(instance.birth_date)
            instance.save(update_fields=['druid_sign', 'chinese_animal'])

        return instance

    def compute_druid_sign(self, birth_date):
        """Compute druid sign based on birth date"""
        month = birth_date.month
        day = birth_date.day

        # Simplified druid sign calculation
        if (month == 12 and day >= 24) or (month == 1 and day <= 20):
            return 'birch'
        elif (month == 1 and day >= 21) or (month == 2 and day <= 17):
            return 'rowan'
        elif (month == 2 and day >= 18) or (month == 3 and day <= 17):
            return 'ash'
        elif (month == 3 and day >= 18) or (month == 4 and day <= 14):
            return 'alder'
        elif (month == 4 and day >= 15) or (month == 5 and day <= 12):
            return 'willow'
        elif (month == 5 and day >= 13) or (month == 6 and day <= 9):
            return 'hawthorn'
        elif (month == 6 and day >= 10) or (month == 6 and day <= 20):
            return 'oak'
        elif (month == 7 and day >= 8) or (month == 8 and day <= 4):
            return 'holly'
        elif (month == 8 and day >= 5) or (month == 9 and day <= 1):
            return 'hazel'
        elif (month == 9 and day >= 2) or (month == 9 and day <= 29):
            return 'vine'
        elif (month == 9 and day >= 30) or (month == 10 and day <= 27):
            return 'ivy'
        elif (month == 10 and day >= 28) or (month == 11 and day <= 24):
            return 'reed'
        else:
            return 'elder'

    def compute_chinese_animal(self, birth_date):
        """Compute Chinese zodiac animal based on birth year"""
        year = birth_date.year
        animals = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
                  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig']

        # Chinese zodiac starts from 1924 as rat year
        return animals[(year - 1924) % 12]