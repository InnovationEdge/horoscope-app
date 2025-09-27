from django.urls import path
from . import views

urlpatterns = [
    path('', views.compatibility, name='compatibility'),
]