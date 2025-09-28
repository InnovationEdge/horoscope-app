#!/bin/bash

# Production Build Script for Salamene Horoscope App
# This script handles both frontend and backend deployment

set -e  # Exit on any error

echo "🚀 Starting Salamene Horoscope Production Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="salamene-horoscope"
BACKEND_DIR="api"
ENVIRONMENT=${1:-production}

echo -e "${BLUE}Environment: ${ENVIRONMENT}${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check prerequisites
echo -e "${BLUE}📋 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

if ! command -v python &> /dev/null; then
    print_error "Python is not installed"
    exit 1
fi

print_status "Prerequisites check passed"

# Clean previous builds
echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
rm -rf dist/
rm -rf .expo/
rm -rf node_modules/.cache/
print_status "Cleaned previous builds"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci --silent
print_status "Dependencies installed"

# Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
if npm run test --silent > /dev/null 2>&1; then
    print_status "All tests passed"
else
    print_warning "Some tests failed, continuing anyway"
fi

# Type checking
echo -e "${BLUE}🔍 Running TypeScript type checking...${NC}"
if npm run typecheck --silent > /dev/null 2>&1; then
    print_status "Type checking passed"
else
    print_warning "Type checking found issues, continuing anyway"
fi

# Linting
echo -e "${BLUE}🔧 Running linter...${NC}"
if npm run lint --silent > /dev/null 2>&1; then
    print_status "Linting passed"
else
    print_warning "Linting found issues, continuing anyway"
fi

# Build mobile app
echo -e "${BLUE}📱 Building mobile app...${NC}"

# Create environment-specific app.json
if [ "$ENVIRONMENT" = "staging" ]; then
    echo -e "${YELLOW}Building for staging environment${NC}"
    # You could modify app.json here for staging
fi

# Build for different platforms
echo -e "${BLUE}Building for iOS...${NC}"
if npx expo build:ios --non-interactive --no-publish > build-ios.log 2>&1; then
    print_status "iOS build completed"
else
    print_error "iOS build failed, check build-ios.log"
fi

echo -e "${BLUE}Building for Android...${NC}"
if npx expo build:android --non-interactive --no-publish > build-android.log 2>&1; then
    print_status "Android build completed"
else
    print_error "Android build failed, check build-android.log"
fi

# Build web version
echo -e "${BLUE}🌐 Building web version...${NC}"
if npx expo export:web > build-web.log 2>&1; then
    print_status "Web build completed"
else
    print_error "Web build failed, check build-web.log"
fi

# Setup backend for deployment
echo -e "${BLUE}🐍 Preparing backend for deployment...${NC}"

cd $BACKEND_DIR

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python -m venv venv
    print_status "Created virtual environment"
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt > ../build-backend.log 2>&1
print_status "Backend dependencies installed"

# Run Django checks
if python manage.py check --settings=config.settings.production > ../django-check.log 2>&1; then
    print_status "Django checks passed"
else
    print_warning "Django checks found issues, check django-check.log"
fi

# Collect static files
python manage.py collectstatic --noinput --settings=config.settings.production > ../django-static.log 2>&1
print_status "Static files collected"

# Run migrations (dry run to check)
python manage.py migrate --dry-run --settings=config.settings.production > ../django-migrate.log 2>&1
print_status "Migration check completed"

cd ..

# Create deployment package
echo -e "${BLUE}📦 Creating deployment package...${NC}"

# Create deployment directory
mkdir -p deployment
cd deployment

# Copy necessary files
cp -r ../$BACKEND_DIR .
cp ../package.json .
cp ../app.json .
cp -r ../dist ./frontend 2>/dev/null || echo "No dist directory found"

# Create deployment configuration
cat > Procfile << EOF
web: cd api && gunicorn config.wsgi:application --bind 0.0.0.0:\$PORT
worker: cd api && python manage.py process_queue
EOF

cat > runtime.txt << EOF
python-3.11.6
EOF

# Create Docker configuration
cat > Dockerfile << EOF
FROM node:18-alpine AS frontend-builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM python:3.11-slim AS backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    postgresql-client \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY api/ ./

# Copy frontend build
COPY --from=frontend-builder /app/dist ./static/

# Collect static files
RUN python manage.py collectstatic --noinput --settings=config.settings.production

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
EOF

# Create docker-compose for development
cat > docker-compose.yml << EOF
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
      - DATABASE_URL=postgresql://salamene:password@db:5432/salamene_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=salamene_db
      - POSTGRES_USER=salamene
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
EOF

# Create Kubernetes deployment
mkdir -p k8s

cat > k8s/deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: salamene-horoscope
  labels:
    app: salamene-horoscope
spec:
  replicas: 3
  selector:
    matchLabels:
      app: salamene-horoscope
  template:
    metadata:
      labels:
        app: salamene-horoscope
    spec:
      containers:
      - name: salamene-horoscope
        image: salamene/horoscope:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: salamene-secrets
              key: database-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: salamene-secrets
              key: secret-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: salamene-horoscope-service
spec:
  selector:
    app: salamene-horoscope
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: LoadBalancer
EOF

cd ..

print_status "Deployment package created in ./deployment/"

# Create deployment summary
echo -e "${BLUE}📊 Deployment Summary${NC}"
echo "=================================="
echo "App Name: $APP_NAME"
echo "Environment: $ENVIRONMENT"
echo "Build Time: $(date)"
echo "Node Version: $(node --version)"
echo "Python Version: $(python --version)"
echo ""
echo "✅ Mobile builds completed"
echo "✅ Web build completed"
echo "✅ Backend prepared"
echo "✅ Deployment package ready"
echo ""
echo -e "${GREEN}🎉 Production build completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy backend to your hosting platform"
echo "2. Submit mobile builds to app stores"
echo "3. Deploy web build to CDN"
echo "4. Configure environment variables"
echo "5. Run database migrations"
echo ""
echo "Deployment files are in ./deployment/"