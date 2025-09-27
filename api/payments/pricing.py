"""
Regional pricing logic for Salamene Horoscope app
"""
import requests
from decimal import Decimal


class RegionalPricingService:
    """Handle region-based pricing logic"""

    # Default prices in USD
    BASE_PRICES = {
        'weekly': Decimal('2.49'),
        'monthly': Decimal('5.00'),
        'yearly': Decimal('49.00')
    }

    # Currency mappings by country/region
    CURRENCY_MAP = {
        # Georgia
        'GE': 'GEL',
        # European Union countries
        'AT': 'EUR', 'BE': 'EUR', 'BG': 'EUR', 'CY': 'EUR', 'CZ': 'EUR',
        'DE': 'EUR', 'DK': 'EUR', 'EE': 'EUR', 'ES': 'EUR', 'FI': 'EUR',
        'FR': 'EUR', 'GR': 'EUR', 'HR': 'EUR', 'HU': 'EUR', 'IE': 'EUR',
        'IT': 'EUR', 'LT': 'EUR', 'LU': 'EUR', 'LV': 'EUR', 'MT': 'EUR',
        'NL': 'EUR', 'PL': 'EUR', 'PT': 'EUR', 'RO': 'EUR', 'SE': 'EUR',
        'SI': 'EUR', 'SK': 'EUR',
        # United States
        'US': 'USD',
    }

    # Price per currency (all normalized to 5 units for monthly as per spec)
    CURRENCY_PRICES = {
        'USD': {
            'weekly': Decimal('2.49'),
            'monthly': Decimal('5.00'),
            'yearly': Decimal('49.00')
        },
        'EUR': {
            'weekly': Decimal('2.49'),
            'monthly': Decimal('5.00'),
            'yearly': Decimal('49.00')
        },
        'GEL': {
            'weekly': Decimal('2.49'),
            'monthly': Decimal('5.00'),
            'yearly': Decimal('49.00')
        }
    }

    @classmethod
    def detect_country_from_ip(cls, ip_address):
        """
        Detect country from IP address
        In production, you'd use a service like MaxMind GeoIP2 or ipapi.co
        For demo purposes, we'll use a simple mock implementation
        """
        if not ip_address or ip_address in ['127.0.0.1', 'localhost']:
            return 'US'  # Default to US for local development

        try:
            # Simple IP geolocation service (in production, use a proper service)
            response = requests.get(f'http://ip-api.com/json/{ip_address}', timeout=2)
            if response.status_code == 200:
                data = response.json()
                return data.get('countryCode', 'US')
        except:
            pass

        return 'US'  # Default fallback

    @classmethod
    def get_country_from_request(cls, request):
        """Extract country from request headers and IP"""
        # Check for country header (could be set by frontend)
        country = request.META.get('HTTP_X_COUNTRY_CODE')
        if country and len(country) == 2:
            return country.upper()

        # Get IP from request
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')

        return cls.detect_country_from_ip(ip)

    @classmethod
    def get_currency_for_country(cls, country_code):
        """Get currency for a given country code"""
        return cls.CURRENCY_MAP.get(country_code, 'USD')

    @classmethod
    def get_pricing_for_request(cls, request):
        """Get complete pricing structure for a request"""
        country = cls.get_country_from_request(request)
        currency = cls.get_currency_for_country(country)
        prices = cls.CURRENCY_PRICES.get(currency, cls.CURRENCY_PRICES['USD'])

        # Format display prices
        currency_symbols = {
            'USD': '$',
            'EUR': '€',
            'GEL': '₾'
        }

        symbol = currency_symbols.get(currency, '$')

        return {
            'country': country,
            'currency': currency,
            'pricing': {
                'weekly': {
                    'amount': float(prices['weekly']),
                    'currency': currency,
                    'display': f"{symbol}{prices['weekly']:.2f}".replace('.00', '')
                },
                'monthly': {
                    'amount': float(prices['monthly']),
                    'currency': currency,
                    'display': f"{symbol}{prices['monthly']:.0f}"
                },
                'yearly': {
                    'amount': float(prices['yearly']),
                    'currency': currency,
                    'display': f"{symbol}{prices['yearly']:.0f}"
                }
            },
            'monthly_display': f"{symbol}{prices['monthly']:.0f}"
        }

    @classmethod
    def get_price_for_plan(cls, plan_type, currency):
        """Get price for a specific plan and currency"""
        prices = cls.CURRENCY_PRICES.get(currency, cls.CURRENCY_PRICES['USD'])
        return prices.get(plan_type, prices['monthly'])