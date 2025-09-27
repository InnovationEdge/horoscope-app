from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import CompatibilityPair
from .data_generator import CompatibilityDataGenerator

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def compatibility(request):
    """Calculate compatibility between two zodiac signs"""
    sign_a = request.data.get('signA')
    sign_b = request.data.get('signB')

    if not sign_a or not sign_b:
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Both signA and signB are required"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate signs
    valid_signs = [choice[0] for choice in CompatibilityPair.ZODIAC_SIGNS]
    if sign_a not in valid_signs or sign_b not in valid_signs:
        return Response(
            {"error": {"code": "INVALID_SIGN", "message": "Invalid zodiac sign"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Check if user is authenticated and premium
        is_premium_user = False
        if hasattr(request, 'user') and request.user.is_authenticated:
            is_premium_user = request.user.is_premium_active

        # Try to get existing compatibility data from database
        # Order signs consistently for lookup
        ordered_signs = tuple(sorted([sign_a, sign_b]))

        try:
            compatibility_pair = CompatibilityPair.objects.get(
                sign_a=ordered_signs[0],
                sign_b=ordered_signs[1]
            )

            response_data = {
                'signA': sign_a,
                'signB': sign_b,
                'overall': compatibility_pair.overall_score,
                'categories': {
                    'love': compatibility_pair.love_score,
                    'career': compatibility_pair.career_score,
                    'friendship': compatibility_pair.friendship_score
                },
                'preview': compatibility_pair.preview_text
            }

            # Include premium text only for premium users
            if is_premium_user:
                response_data['premium_text'] = compatibility_pair.premium_text

        except CompatibilityPair.DoesNotExist:
            # Generate new compatibility data
            compatibility_data = CompatibilityDataGenerator.generate_compatibility(sign_a, sign_b)

            # Save to database with ordered signs
            CompatibilityPair.objects.create(
                sign_a=ordered_signs[0],
                sign_b=ordered_signs[1],
                overall_score=compatibility_data['overall'],
                love_score=compatibility_data['categories']['love'],
                career_score=compatibility_data['categories']['career'],
                friendship_score=compatibility_data['categories']['friendship'],
                preview_text=compatibility_data['preview'],
                premium_text=compatibility_data['premium_text']
            )

            response_data = {
                'signA': sign_a,
                'signB': sign_b,
                'overall': compatibility_data['overall'],
                'categories': compatibility_data['categories'],
                'preview': compatibility_data['preview']
            }

            # Include premium text only for premium users
            if is_premium_user:
                response_data['premium_text'] = compatibility_data['premium_text']

        return Response(response_data)

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to calculate compatibility"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )