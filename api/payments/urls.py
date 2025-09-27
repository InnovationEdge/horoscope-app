from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.products, name='payment_products'),
    path('checkout/', views.checkout, name='payment_checkout'),
    path('webhook/', views.webhook, name='payment_webhook'),
]