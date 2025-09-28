from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSignupSerializer, UserSerializer, UserUpdateSerializer, SocialAuthSerializer, OnboardingSerializer, CompleteUserSerializer
from .authentication import generate_jwt_token
from .models import SocialAccount, UserProfile
import uuid
import requests
from django.utils import timezone

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    """Handle user signup with social providers or guest access"""
    serializer = UserSignupSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Invalid signup data"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    provider = serializer.validated_data['provider']
    token = serializer.validated_data['token']

    # For demo purposes, we'll create users without validating external tokens
    # In production, you'd validate the token with the respective provider

    # Generate a unique username based on provider
    username = f"{provider}_{uuid.uuid4().hex[:8]}"

    try:
        # Check if user already exists based on provider and token
        user, created = User.objects.get_or_create(
            provider=provider,
            provider_id=token[:50],  # Truncate token for storage
            defaults={
                'username': username,
                'email': f"{username}@salamene.app",
            }
        )

        # Generate JWT token
        jwt_token = generate_jwt_token(user)

        return Response({
            "jwt": jwt_token,
            "user": {
                "id": f"u_{user.id}",
                "is_premium": user.is_premium_active
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to create user"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user profile"""
    try:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to get user profile"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update current user profile"""
    try:
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": {"code": "INVALID_DATA", "message": "Invalid update data"}},
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to update user profile"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def social_auth(request):
    """Handle social authentication (Google, Apple, Facebook)"""
    serializer = SocialAuthSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Invalid social auth data"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    provider = serializer.validated_data['provider']
    access_token = serializer.validated_data['access_token']

    try:
        # Validate token with provider and get user info
        user_info = validate_social_token(provider, access_token)

        if not user_info:
            return Response(
                {"error": {"code": "INVALID_TOKEN", "message": "Invalid social auth token"}},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Get or create user
        user, created = get_or_create_social_user(provider, user_info, access_token)

        # Generate JWT token
        jwt_token = generate_jwt_token(user)

        # Create user profile if new user
        if created:
            UserProfile.objects.get_or_create(user=user)
            user.calculate_astrological_signs()

        return Response({
            "jwt": jwt_token,
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": str(e)}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def refresh_token(request):
    """Refresh JWT token"""
    try:
        # Generate new JWT token
        jwt_token = generate_jwt_token(request.user)

        return Response({
            "jwt": jwt_token,
            "user": UserSerializer(request.user).data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to refresh token"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout user"""
    try:
        # In a production app, you might invalidate the token here
        # For now, we'll just return success
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to logout"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def validate_social_token(provider, access_token):
    """Validate social auth token and return user info"""
    try:
        if provider == 'google':
            # Validate Google token
            response = requests.get(
                f'https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}',
                timeout=10
            )
            if response.status_code == 200:
                return response.json()

        elif provider == 'apple':
            # Apple Sign In validation would require more complex JWT validation
            # For demo, we'll return mock data
            return {
                'id': f'apple_user_{access_token[:10]}',
                'email': 'user@privaterelay.appleid.com',
                'name': 'Apple User'
            }

        elif provider == 'facebook':
            # Validate Facebook token
            response = requests.get(
                f'https://graph.facebook.com/me?fields=id,name,email&access_token={access_token}',
                timeout=10
            )
            if response.status_code == 200:
                return response.json()

        return None

    except Exception:
        return None


def get_or_create_social_user(provider, user_info, access_token):
    """Get or create user from social auth"""
    provider_id = str(user_info.get('id', ''))
    email = user_info.get('email', '')
    name = user_info.get('name', '')

    # Try to find existing social account
    try:
        social_account = SocialAccount.objects.get(provider=provider, provider_id=provider_id)
        user = social_account.user

        # Update access token
        social_account.access_token = access_token
        social_account.save()

        return user, False

    except SocialAccount.DoesNotExist:
        # Try to find user by email if provided
        user = None
        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                pass

        # Create new user if not found
        if not user:
            username = f"{provider}_{uuid.uuid4().hex[:8]}"
            user = User.objects.create(
                username=username,
                email=email or f"{username}@salamene.app",
                name=name,
                onboarded=False
            )

        # Create social account
        SocialAccount.objects.create(
            user=user,
            provider=provider,
            provider_id=provider_id,
            provider_email=email,
            access_token=access_token
        )

        return user, True


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_onboarding(request):
    """Complete user onboarding with birth info and preferences"""
    try:
        serializer = OnboardingSerializer(request.user, data=request.data, partial=True)

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                "user": CompleteUserSerializer(user).data,
                "message": "Onboarding completed successfully"
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": {"code": "INVALID_DATA", "message": "Invalid onboarding data", "details": serializer.errors}},
                status=status.HTTP_400_BAD_REQUEST
            )

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to complete onboarding"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )