from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import uuid
from .models import PaymentPlan, Transaction
from .pricing import RegionalPricingService

User = get_user_model()


@api_view(['GET'])
@permission_classes([AllowAny])
def products(request):
    """Get available payment products with regional pricing"""
    try:
        pricing_data = RegionalPricingService.get_pricing_for_request(request)

        # Ensure default plans exist in database
        plans_data = [
            {
                'plan_id': 'weekly_plan',
                'name': 'Weekly Premium',
                'plan_type': 'weekly',
                'duration_days': 7,
                'price_usd': 2.49,
                'price_eur': 2.49,
                'price_gel': 2.49
            },
            {
                'plan_id': 'monthly_plan',
                'name': 'Monthly Premium',
                'plan_type': 'monthly',
                'duration_days': 30,
                'price_usd': 5.00,
                'price_eur': 5.00,
                'price_gel': 5.00
            },
            {
                'plan_id': 'yearly_plan',
                'name': 'Yearly Premium',
                'plan_type': 'yearly',
                'duration_days': 365,
                'price_usd': 49.00,
                'price_eur': 49.00,
                'price_gel': 49.00
            }
        ]

        for plan_data in plans_data:
            PaymentPlan.objects.get_or_create(
                plan_id=plan_data['plan_id'],
                defaults=plan_data
            )

        # Get active plans
        active_plans = PaymentPlan.objects.filter(is_active=True).order_by('duration_days')

        response_data = {
            'country': pricing_data['country'],
            'currency': pricing_data['currency'],
            'pricing': pricing_data['pricing'],
            'monthly_display': pricing_data['monthly_display'],
            'plans': []
        }

        for plan in active_plans:
            plan_pricing = pricing_data['pricing'][plan.plan_type]
            response_data['plans'].append({
                'id': plan.plan_id,
                'name': plan.name,
                'type': plan.plan_type,
                'duration_days': plan.duration_days,
                'price': plan_pricing['amount'],
                'currency': plan_pricing['currency'],
                'display_price': plan_pricing['display']
            })

        return Response(response_data)

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to fetch products"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout(request):
    """Create checkout session for payment"""
    plan_id = request.data.get('plan')
    currency = request.data.get('currency', 'USD')

    if not plan_id:
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "Plan is required"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Get the payment plan
        try:
            # Map plan types to plan IDs
            plan_id_mapping = {
                'weekly': 'weekly_plan',
                'monthly': 'monthly_plan',
                'yearly': 'yearly_plan'
            }

            mapped_plan_id = plan_id_mapping.get(plan_id, plan_id)
            payment_plan = PaymentPlan.objects.get(plan_id=mapped_plan_id, is_active=True)
        except PaymentPlan.DoesNotExist:
            return Response(
                {"error": {"code": "INVALID_DATA", "message": "Invalid plan"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get price for the currency
        price = RegionalPricingService.get_price_for_plan(payment_plan.plan_type, currency)

        # Create transaction record
        transaction_id = f"tx_{uuid.uuid4().hex[:12]}"
        transaction = Transaction.objects.create(
            transaction_id=transaction_id,
            user=request.user,
            plan=payment_plan,
            amount=price,
            currency=currency,
            status='pending'
        )

        # Generate mock checkout URL (in production, this would be from a real payment provider)
        checkout_url = f"https://flitt.io/pay/{transaction.transaction_id}"
        transaction.checkout_url = checkout_url
        transaction.save(update_fields=['checkout_url'])

        return Response({
            "checkout_url": checkout_url
        })

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to create checkout session"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def webhook(request):
    """Handle payment webhook from payment provider"""
    try:
        transaction_id = request.data.get('tx_id')
        payment_status = request.data.get('status')
        plan_type = request.data.get('plan')
        currency = request.data.get('currency')

        if not all([transaction_id, payment_status, plan_type]):
            return Response(
                {"error": {"code": "INVALID_DATA", "message": "Missing required webhook data"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            transaction = Transaction.objects.get(transaction_id=transaction_id)
        except Transaction.DoesNotExist:
            return Response(
                {"error": {"code": "INVALID_DATA", "message": "Transaction not found"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update transaction status
        transaction.status = payment_status
        if payment_status == 'paid':
            transaction.paid_at = timezone.now()

            # Update user premium status
            user = transaction.user
            plan = transaction.plan

            if user.premium_until and user.premium_until > timezone.now():
                # Extend existing premium
                user.premium_until += timedelta(days=plan.duration_days)
            else:
                # Start new premium period
                user.premium_until = timezone.now() + timedelta(days=plan.duration_days)

            user.is_premium = True
            user.save(update_fields=['is_premium', 'premium_until'])

        transaction.save(update_fields=['status', 'paid_at'])

        return Response({'status': 'success'})

    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to process webhook"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )