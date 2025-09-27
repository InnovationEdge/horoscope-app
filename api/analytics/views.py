from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime
import logging
from .models import AnalyticsEvent, SessionMetrics

User = get_user_model()
logger = logging.getLogger('analytics')


def get_client_ip(request):
    """Extract client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['POST'])
@permission_classes([AllowAny])
def events(request):
    """Handle analytics events from the mobile app"""
    try:
        events_data = request.data

        if not isinstance(events_data, list):
            return Response(
                {"error": {"code": "INVALID_DATA", "message": "Events must be an array"}},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get request metadata
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        # Process each event
        created_events = []
        for event_data in events_data:
            try:
                # Validate required fields
                required_fields = ['event', 'ts', 'session_id', 'install_id', 'app_version']
                for field in required_fields:
                    if field not in event_data:
                        logger.warning(f"Missing required field: {field}")
                        continue

                # Get user if authenticated
                user = None
                if hasattr(request, 'user') and request.user.is_authenticated:
                    user = request.user

                # Create analytics event
                analytics_event = AnalyticsEvent.objects.create(
                    event=event_data['event'],
                    timestamp=event_data['ts'],
                    session_id=event_data['session_id'],
                    install_id=event_data['install_id'],
                    app_version=event_data['app_version'],
                    user=user,
                    user_props=event_data.get('user_props', {}),
                    params=event_data.get('params', {}),
                    ip_address=ip_address,
                    user_agent=user_agent
                )

                created_events.append(analytics_event)

                # Update session metrics
                update_session_metrics(event_data, user)

                # Log important events
                if event_data['event'] in ['purchase_success', 'paywall_shown', 'upgrade_cta_clicked']:
                    logger.info(f"Analytics: {event_data['event']} - Session: {event_data['session_id'][:8]}... - User: {user.username if user else 'Anonymous'}")

            except Exception as e:
                logger.error(f"Failed to process event: {event_data.get('event', 'unknown')} - Error: {str(e)}")
                continue

        logger.info(f"Processed {len(created_events)} analytics events from session {events_data[0].get('session_id', 'unknown')[:8] if events_data else 'unknown'}...")

        return Response({'status': 'success', 'processed': len(created_events)})

    except Exception as e:
        logger.error(f"Analytics events processing failed: {str(e)}")
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to process analytics events"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def update_session_metrics(event_data, user):
    """Update aggregated session metrics"""
    try:
        session_id = event_data['session_id']
        event_type = event_data['event']
        timestamp = event_data['ts']

        # Convert timestamp to datetime
        event_datetime = datetime.fromtimestamp(timestamp / 1000, tz=timezone.utc)

        # Get or create session metrics
        session_metrics, created = SessionMetrics.objects.get_or_create(
            session_id=session_id,
            defaults={
                'user': user,
                'start_time': event_datetime,
            }
        )

        # Update metrics based on event type
        if event_type == 'screen_view':
            session_metrics.screen_views += 1
        elif event_type == 'tab_selected':
            session_metrics.tab_switches += 1
        elif event_type == 'banner_clicked':
            session_metrics.banner_clicks += 1
        elif event_type == 'paywall_shown':
            session_metrics.paywall_views += 1
        elif event_type == 'compatibility_calculated':
            session_metrics.compatibility_calculations += 1
        elif event_type == 'upgrade_cta_clicked':
            session_metrics.upgrade_attempts += 1
        elif event_type == 'purchase_initiated':
            session_metrics.purchase_attempts += 1
        elif event_type == 'purchase_success':
            session_metrics.successful_purchases += 1

        # Update end time and duration
        session_metrics.end_time = event_datetime
        if session_metrics.start_time:
            duration = (session_metrics.end_time - session_metrics.start_time).total_seconds()
            session_metrics.duration_seconds = int(duration)

        session_metrics.save()

    except Exception as e:
        logger.error(f"Failed to update session metrics: {str(e)}")


@api_view(['GET'])
@permission_classes([AllowAny])
def session_summary(request):
    """Get session summary for debugging (optional endpoint)"""
    session_id = request.GET.get('session_id')

    if not session_id:
        return Response(
            {"error": {"code": "INVALID_DATA", "message": "session_id is required"}},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Get session metrics
        session_metrics = SessionMetrics.objects.get(session_id=session_id)

        # Get recent events for this session
        recent_events = AnalyticsEvent.objects.filter(
            session_id=session_id
        ).order_by('-timestamp')[:20]

        events_summary = []
        for event in recent_events:
            events_summary.append({
                'event': event.event,
                'timestamp': event.timestamp,
                'params': event.params
            })

        return Response({
            'session_id': session_id,
            'metrics': {
                'duration_seconds': session_metrics.duration_seconds,
                'screen_views': session_metrics.screen_views,
                'tab_switches': session_metrics.tab_switches,
                'banner_clicks': session_metrics.banner_clicks,
                'paywall_views': session_metrics.paywall_views,
                'compatibility_calculations': session_metrics.compatibility_calculations,
                'upgrade_attempts': session_metrics.upgrade_attempts,
                'purchase_attempts': session_metrics.purchase_attempts,
                'successful_purchases': session_metrics.successful_purchases,
            },
            'recent_events': events_summary
        })

    except SessionMetrics.DoesNotExist:
        return Response(
            {"error": {"code": "NOT_FOUND", "message": "Session not found"}},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": {"code": "SERVER_ERROR", "message": "Failed to get session summary"}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )