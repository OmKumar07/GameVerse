# 🗄️ GameVerse Backend Setup Guide

## 📋 **Complete User Data Storage Implementation**

This guide shows you how to set up and use the complete backend system for GameVerse user data storage.

## 🚀 **Quick Start**

### **1. Install Backend Dependencies**

```bash
cd backend
npm install
```

### **2. Set Up Environment Variables**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
```

### **3. Set Up MongoDB**

#### **Option A: Local MongoDB**

```bash
# Install MongoDB locally or use Docker
docker run --name gameverse-mongo -p 27017:27017 -d mongo
```

#### **Option B: MongoDB Atlas (Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### **4. Start the Backend Server**

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### **5. Update Frontend Environment**

```bash
# In the root directory
cp .env.example .env

# Edit .env to point to your backend
VITE_API_URL=http://localhost:5000/api
```

## 🏗️ **Backend Architecture**

### **Database Schema (MongoDB)**

```javascript
User {
  // Basic Info
  email: String (unique, required)
  username: String (unique, required)
  password: String (hashed, required)
  displayName: String (required)

  // Profile
  profileImage: { url: String, publicId: String }
  bio: String
  location: String
  website: String

  // Gaming Data
  favoriteGames: [{ gameId, gameName, gameImage, addedAt }]
  playedGames: [{
    gameId, gameName, gameImage, status,
    rating, hoursPlayed, addedAt, completedAt
  }]
  favoriteGenres: [String]
  gamingPlatforms: [String]

  // Statistics
  totalGamesPlayed: Number
  totalHoursPlayed: Number

  // Social
  followers: [ObjectId]
  following: [ObjectId]

  // Privacy
  profilePrivacy: 'public' | 'friends' | 'private'
  showEmail: Boolean
  showGameStats: Boolean

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

### **API Endpoints**

#### **Authentication**

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-token` - Verify JWT
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/logout` - Logout

#### **User Management**

- `GET /api/users/profile` - Get own profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-avatar` - Upload profile image
- `GET /api/users/stats` - Get gaming statistics
- `GET /api/users/:username` - Get public profile

#### **Game Management**

- `POST /api/users/favorites` - Add to favorites
- `DELETE /api/users/favorites/:gameId` - Remove from favorites
- `POST /api/users/played-games` - Add/update played game

## 💾 **Data Storage Features**

### **✅ What's Stored:**

1. **User Profiles**

   - Personal information (email, username, display name)
   - Profile customization (avatar, bio, location, website)
   - Privacy settings

2. **Gaming Data**

   - Favorite games with metadata
   - Played games with status tracking
   - Game ratings and hours played
   - Gaming platform preferences
   - Favorite genres

3. **Statistics**

   - Total games played
   - Total hours played
   - Gaming achievements
   - Activity history

4. **Social Features**
   - Followers/Following system
   - Public/private profiles
   - Social gaming stats

### **🔐 Security Features**

- **JWT Authentication** with refresh tokens
- **Password hashing** using bcrypt
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **CORS protection**
- **Helmet.js** security headers

### **📁 File Upload**

- **Cloudinary integration** for profile images
- **Image optimization** and resizing
- **Multiple format support** (JPG, PNG, WebP)
- **5MB file size limit**

## 🔧 **Frontend Integration**

The frontend has been updated to use real API calls:

```typescript
// Real authentication instead of mock data
const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  const { token, user } = response.data;
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};
```

### **New Features Available:**

1. **Real Authentication**

   - JWT token management
   - Automatic token refresh
   - Secure password storage

2. **Profile Management**

   - Update profile information
   - Upload profile pictures
   - Privacy settings

3. **Game Tracking**
   - Add games to favorites
   - Track played games
   - Rate and review games
   - Gaming statistics

## 🌐 **Deployment Options**

### **Backend Deployment**

#### **Option 1: Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

#### **Option 2: Render**

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### **Option 3: Heroku**

```bash
# Install Heroku CLI
heroku create gameverse-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

### **Database Deployment**

- **MongoDB Atlas** (Recommended)
- **Railway Postgres** (Alternative)
- **PlanetScale** (MySQL alternative)

## 🧪 **Testing the Backend**

### **1. Health Check**

```bash
curl http://localhost:5000/api/health
```

### **2. Register User**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "displayName": "Test User"
  }'
```

### **3. Login**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📱 **Usage Flow**

1. **User Registration/Login**

   - Frontend sends credentials to backend
   - Backend validates and returns JWT token
   - Token stored in localStorage for persistence

2. **Profile Management**

   - Update profile via API calls
   - Upload images to Cloudinary
   - Manage privacy settings

3. **Game Data**

   - Add/remove favorite games
   - Track game playing status
   - Store ratings and playtime

4. **Statistics**
   - Automatic calculation of gaming stats
   - Display on dashboard
   - Social sharing features

## 🚨 **Important Notes**

- **Environment Variables**: Never commit `.env` files
- **JWT Secret**: Use a strong, unique secret in production
- **Database**: Regular backups recommended
- **CORS**: Configure for your production domain
- **Rate Limiting**: Adjust limits based on usage

Now you have a complete, production-ready backend for storing and managing user data in GameVerse! 🎮✨
