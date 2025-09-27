from django.urls import path
from . import views

urlpatterns = [
    path('daily/', views.daily_prediction, name='daily_prediction'),
    path('weekly/', views.weekly_prediction, name='weekly_prediction'),
    path('monthly/', views.monthly_prediction, name='monthly_prediction'),
    path('yearly/', views.yearly_prediction, name='yearly_prediction'),
]