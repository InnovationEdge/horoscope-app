from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from datetime import datetime, timedelta
from .data_generator import HoroscopeDataGenerator
from .models import Prediction, Banner
import re


@api_view(['GET'])
@permission_classes([AllowAny])
def daily_prediction(request):
    """Get daily horoscope prediction"""
    sign = request.GET.get('sign')
    date_str = request.GET.get('date')

    if not sign or not date_str:
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Sign and date are required"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate sign
    valid_signs = [choice[0] for choice in Prediction.ZODIAC_SIGNS]
    if sign not in valid_signs:
        return Response(
            {"error": {"code": "INVALID_SIGN", "message": "Invalid zodiac sign"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Invalid date format. Use YYYY-MM-DD"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Try to get existing prediction from database
        prediction = Prediction.objects.get(
            sign=sign,
            prediction_type='daily',
            date_key=date_str
        )

        response_data = {
            'sign': prediction.sign,
            'date': prediction.date_key,
            'text': prediction.text,
            'lucky_number': prediction.lucky_number,
            'lucky_color': prediction.lucky_color,
            'mood': prediction.mood,
            'aspects': {
                'love': prediction.love_score,
                'career': prediction.career_score,
                'health': prediction.health_score
            }
        }
    except Prediction.DoesNotExist:
        # Generate new prediction
        prediction_data = HoroscopeDataGenerator.generate_daily_prediction(sign, date)

        # Save to database
        Prediction.objects.create(
            sign=sign,
            prediction_type='daily',
            date_key=date_str,
            text=prediction_data['text'],
            lucky_number=prediction_data['lucky_number'],
            lucky_color=prediction_data['lucky_color'],
            mood=prediction_data['mood'],
            love_score=prediction_data['aspects']['love'],
            career_score=prediction_data['aspects']['career'],
            health_score=prediction_data['aspects']['health'],
            premium=False
        )

        response_data = prediction_data

    return Response(response_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def weekly_prediction(request):
    """Get weekly horoscope prediction"""
    sign = request.GET.get('sign')
    week_str = request.GET.get('week')

    if not sign or not week_str:
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Sign and week are required"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate sign
    valid_signs = [choice[0] for choice in Prediction.ZODIAC_SIGNS]
    if sign not in valid_signs:
        return Response(
            {"error": {"code": "INVALID_SIGN", "message": "Invalid zodiac sign"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate week format (YYYY-WXX)
    if not re.match(r'^\d{4}-W\d{2}$', week_str):
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Invalid week format. Use YYYY-WXX"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Try to get existing prediction from database
        prediction = Prediction.objects.get(
            sign=sign,
            prediction_type='weekly',
            date_key=week_str
        )

        response_data = {
            'sign': prediction.sign,
            'week': prediction.date_key,
            'text': prediction.text,
            'premium': prediction.premium
        }
    except Prediction.DoesNotExist:
        # Generate new prediction
        prediction_data = HoroscopeDataGenerator.generate_extended_prediction(sign, 'weekly', week_str)

        # Save to database
        Prediction.objects.create(
            sign=sign,
            prediction_type='weekly',
            date_key=week_str,
            text=prediction_data['text'],
            premium=True
        )

        response_data = prediction_data

    return Response(response_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def monthly_prediction(request):
    """Get monthly horoscope prediction"""
    sign = request.GET.get('sign')
    month_str = request.GET.get('month')

    if not sign or not month_str:
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Sign and month are required"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate sign
    valid_signs = [choice[0] for choice in Prediction.ZODIAC_SIGNS]
    if sign not in valid_signs:
        return Response(
            {"error": {"code": "INVALID_SIGN", "message": "Invalid zodiac sign"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate month format (YYYY-MM)
    if not re.match(r'^\d{4}-\d{2}$', month_str):
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Invalid month format. Use YYYY-MM"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Try to get existing prediction from database
        prediction = Prediction.objects.get(
            sign=sign,
            prediction_type='monthly',
            date_key=month_str
        )

        response_data = {
            'sign': prediction.sign,
            'month': prediction.date_key,
            'text': prediction.text,
            'premium': prediction.premium
        }
    except Prediction.DoesNotExist:
        # Generate new prediction
        prediction_data = HoroscopeDataGenerator.generate_extended_prediction(sign, 'monthly', month_str)

        # Save to database
        Prediction.objects.create(
            sign=sign,
            prediction_type='monthly',
            date_key=month_str,
            text=prediction_data['text'],
            premium=True
        )

        response_data = prediction_data

    return Response(response_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def yearly_prediction(request):
    """Get yearly horoscope prediction"""
    sign = request.GET.get('sign')
    year_str = request.GET.get('year')

    if not sign or not year_str:
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Sign and year are required"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate sign
    valid_signs = [choice[0] for choice in Prediction.ZODIAC_SIGNS]
    if sign not in valid_signs:
        return Response(
            {"error": {"code": "INVALID_SIGN", "message": "Invalid zodiac sign"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate year format (YYYY)
    if not re.match(r'^\d{4}$', year_str):
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Invalid year format. Use YYYY"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Try to get existing prediction from database
        prediction = Prediction.objects.get(
            sign=sign,
            prediction_type='yearly',
            date_key=year_str
        )

        response_data = {
            'sign': prediction.sign,
            'year': prediction.date_key,
            'text': prediction.text,
            'premium': prediction.premium
        }
    except Prediction.DoesNotExist:
        # Generate new prediction
        prediction_data = HoroscopeDataGenerator.generate_extended_prediction(sign, 'yearly', year_str)

        # Save to database
        Prediction.objects.create(
            sign=sign,
            prediction_type='yearly',
            date_key=year_str,
            text=prediction_data['text'],
            premium=True
        )

        response_data = prediction_data

    return Response(response_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def banners(request):
    """Get promotional banners"""
    try:
        # Get active banners from database
        active_banners = Banner.objects.filter(is_active=True).order_by('created_at')

        if not active_banners.exists():
            # Create default banners if none exist
            banner_data = HoroscopeDataGenerator.generate_banner_data()

            for banner in banner_data:
                Banner.objects.get_or_create(
                    banner_id=banner['id'],
                    defaults={
                        'title': banner['title'],
                        'subtitle': banner['subtitle'],
                        'bullets': banner['bullets'],
                        'target': banner['target'],
                        'premium_required': banner['premium_required'],
                        'is_active': True
                    }
                )

            # Refresh queryset
            active_banners = Banner.objects.filter(is_active=True).order_by('created_at')

        # Format response
        response_data = []
        for banner in active_banners:
            response_data.append({
                'id': banner.banner_id,
                'title': banner.title,
                'subtitle': banner.subtitle,
                'bullets': banner.bullets,
                'target': banner.target,
                'premium_required': banner.premium_required
            })

        return Response(response_data)

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to fetch banners"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )