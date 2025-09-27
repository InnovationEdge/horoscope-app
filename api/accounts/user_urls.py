from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.get_user_profile, name='get_user_profile'),
    path('me/', views.update_user_profile, name='update_user_profile'),
]