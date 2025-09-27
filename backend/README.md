# Horoscope App Backend

Express.js backend API for the horoscope mobile application.

## Quick Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start MongoDB

```bash
# Install MongoDB if you haven't already
brew install mongodb-community  # macOS
# or follow MongoDB installation guide for your OS

# Start MongoDB
brew services start mongodb-community  # macOS
# or
mongod  # Direct command
```

### 4. Start Server

```bash
npm run dev  # Development with auto-reload
# or
npm start    # Production
```

Server will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login with email/password
- `GET /auth/validate` - Validate JWT token
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Send password reset email
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### Health Check

- `GET /health` - API health status

## Configuration

### Environment Variables (.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/horoscope-app
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
NODE_ENV=development
```

### Database

Uses MongoDB with Mongoose ODM. User schema includes:

- Authentication (email, password)
- Profile data (name, birth info, zodiac sign)
- Premium status
- Timestamps

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with refresh mechanism
- Input validation with express-validator
- CORS protection
- SQL injection protection (NoSQL)

## Update React Native App

After setting up the backend, update your app's API configuration:

1. Create `.env` in your React Native root:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

2. Update `services/api.ts` to disable mock mode:

```javascript
// Remove or comment out mock endpoints
const USE_MOCK_API = false; // Add this flag
```

## Production Deployment

For production deployment:

1. Use a production MongoDB instance (MongoDB Atlas)
2. Set strong JWT secrets
3. Configure proper CORS origins
4. Use HTTPS
5. Set up proper logging
6. Configure rate limiting
7. Set up monitoring

## Development Notes

- Server auto-reloads on file changes (nodemon)
- MongoDB connection retries automatically
- JWT tokens expire in 1 hour (refresh tokens: 7 days)
- Password reset currently simulated (implement email service)
- All routes return consistent JSON responses
