# Salamene Horoscope - Production Deployment Guide

This guide covers the complete deployment process for the Salamene Horoscope application, including both the React Native mobile app and Django backend API.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Backend Deployment](#backend-deployment)
4. [Mobile App Deployment](#mobile-app-deployment)
5. [Web App Deployment](#web-app-deployment)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Node.js 18.x or later
- Python 3.11 or later
- PostgreSQL 15+ (for production database)
- Redis (for caching and queue management)
- Docker (optional, for containerized deployment)

### Required Accounts
- Heroku account (for backend hosting)
- Vercel account (for web app hosting)
- AWS account (for file storage)
- Expo account (for mobile app building)
- Apple Developer account (for iOS deployment)
- Google Play Console account (for Android deployment)

## Environment Setup

### 1. Environment Variables

Create the following environment files:

#### Backend (.env.production)
```bash
# Django Settings
DEBUG=False
SECRET_KEY=your-super-secret-key-here
ALLOWED_HOSTS=salamene-api.herokuapp.com,api.salamene.app

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Redis
REDIS_URL=redis://host:port/0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=noreply@salamene.app
EMAIL_HOST_PASSWORD=your-app-password

# Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=salamene-media

# External APIs
GOOGLE_CLIENT_ID=your-google-client-id
FACEBOOK_APP_ID=your-facebook-app-id

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

#### Frontend (.env.production)
```bash
EXPO_PUBLIC_API_BASE_URL=https://api.salamene.app
EXPO_PUBLIC_WEB_CLIENT_ID=your-google-web-client-id
EXPO_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
EXPO_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 2. Update Configuration Files

#### app.json
```json
{
  "expo": {
    "name": "Salamene Horoscope",
    "slug": "salamene-horoscope",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0D0B1A"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.salamene.horoscope",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#0D0B1A"
      },
      "package": "com.salamene.horoscope",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "output": "static"
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

## Backend Deployment

### 1. Heroku Deployment

#### Step 1: Create Heroku App
```bash
heroku create salamene-api
heroku addons:create heroku-postgresql:mini
heroku addons:create heroku-redis:mini
```

#### Step 2: Configure Environment Variables
```bash
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DJANGO_SETTINGS_MODULE=config.settings.production
# Add all other environment variables
```

#### Step 3: Deploy
```bash
cd api
git subtree push --prefix=api heroku main
```

#### Step 4: Run Migrations
```bash
heroku run python manage.py migrate
heroku run python manage.py collectstatic --noinput
heroku run python manage.py createsuperuser
```

### 2. Docker Deployment

#### Step 1: Build Image
```bash
docker build -t salamene-horoscope .
```

#### Step 2: Run with Docker Compose
```bash
docker-compose up -d
```

### 3. Kubernetes Deployment

#### Step 1: Apply Configurations
```bash
kubectl apply -f deployment/k8s/
```

#### Step 2: Set Up Secrets
```bash
kubectl create secret generic salamene-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=secret-key="your-secret-key"
```

## Mobile App Deployment

### 1. iOS Deployment

#### Step 1: Configure EAS Build
```bash
npm install -g @expo/cli
expo install --fix
```

#### Step 2: Build for iOS
```bash
eas build --platform ios --profile production
```

#### Step 3: Submit to App Store
```bash
eas submit --platform ios
```

### 2. Android Deployment

#### Step 1: Build for Android
```bash
eas build --platform android --profile production
```

#### Step 2: Submit to Google Play
```bash
eas submit --platform android
```

### 3. EAS Build Configuration (eas.json)
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Web App Deployment

### 1. Build Web Version
```bash
npx expo export:web
```

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### 3. Configure Vercel (vercel.json)
```json
{
  "framework": "nextjs",
  "buildCommand": "npx expo export:web",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Monitoring and Maintenance

### 1. Health Checks

#### Backend Health Check
```python
# api/health/views.py
from django.http import JsonResponse
from django.db import connection

def health_check(request):
    try:
        # Check database
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")

        return JsonResponse({
            "status": "healthy",
            "timestamp": timezone.now().isoformat(),
            "version": "1.0.0"
        })
    except Exception as e:
        return JsonResponse({
            "status": "unhealthy",
            "error": str(e)
        }, status=500)
```

### 2. Monitoring Setup

#### Sentry Configuration
```python
# api/config/settings/production.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=os.environ.get('SENTRY_DSN'),
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=True
)
```

### 3. Performance Monitoring

#### Database Query Optimization
```python
# Enable query logging in development
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    },
}
```

### 4. Backup Strategy

#### Daily Database Backups
```bash
# Heroku automatic backups
heroku addons:create heroku-postgresql:mini --app salamene-api
heroku pg:backups:schedule DATABASE_URL --at '02:00 America/Los_Angeles' --app salamene-api
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

#### 2. Database Connection Issues
- Verify DATABASE_URL format
- Check firewall settings
- Ensure database server is running

#### 3. Mobile App Issues
- Check Expo SDK version compatibility
- Verify app.json configuration
- Clear Expo cache: `expo r -c`

#### 4. API Errors
- Check server logs: `heroku logs --tail`
- Verify environment variables
- Check CORS settings

### Performance Optimization

#### 1. Database
- Add database indexes for frequently queried fields
- Use database connection pooling
- Implement query optimization

#### 2. Caching
- Use Redis for session storage
- Implement API response caching
- Add CDN for static assets

#### 3. Mobile App
- Optimize image sizes
- Implement lazy loading
- Use code splitting

## Security Checklist

- [ ] Environment variables are not hardcoded
- [ ] HTTPS is enforced
- [ ] Database credentials are secure
- [ ] API rate limiting is implemented
- [ ] Input validation is in place
- [ ] CORS is properly configured
- [ ] Secrets are stored securely
- [ ] Regular security updates are applied

## Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Environment variables are configured
- [ ] Database migrations are ready
- [ ] Static files are collected
- [ ] App store assets are prepared

### Deployment
- [ ] Backend is deployed and healthy
- [ ] Database migrations are run
- [ ] Mobile builds are submitted
- [ ] Web app is deployed
- [ ] DNS is configured

### Post-deployment
- [ ] Health checks are passing
- [ ] Monitoring is active
- [ ] Backups are scheduled
- [ ] Team is notified
- [ ] Documentation is updated

## Support and Contact

For deployment issues or questions:
- Technical Lead: [email@example.com]
- DevOps Team: [devops@salamene.app]
- Emergency Contact: [emergency@salamene.app]

---

**Version**: 1.0.0
**Last Updated**: $(date)
**Next Review**: $(date -d "+3 months")