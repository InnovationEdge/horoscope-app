from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('signup/', views.signup, name='signup'),
    path('auth/social/', views.social_auth, name='social_auth'),
    path('auth/refresh/', views.refresh_token, name='refresh_token'),
    path('auth/logout/', views.logout, name='logout'),

    # User management
    path('me/', views.get_user_profile, name='get_user_profile'),
    path('me/update/', views.update_user_profile, name='update_user_profile'),
    path('me/onboarding/', views.complete_onboarding, name='complete_onboarding'),
]