from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSignupSerializer, UserSerializer, UserUpdateSerializer
from .authentication import generate_jwt_token
import uuid

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