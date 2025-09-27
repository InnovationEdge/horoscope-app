from django.urls import path
from . import views

urlpatterns = [
    path('events/', views.events, name='analytics_events'),
    path('session/', views.session_summary, name='session_summary'),
]