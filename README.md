# 🎮 GameVerse

**Your Ultimate Gaming Companion - Discover, Organize, and Track Your Favorite Games**

GameVerse is a modern, full-stack web application that provides a complete gaming experience. From discovering new games to managing your personal gaming library, GameVerse offers everything you need in one beautiful, responsive platform. Built with React, TypeScript, Node.js, and MongoDB, it combines powerful functionality with an intuitive user experience.

![GameVerse Logo](./public/logo.webp)

## ✨ Features

### 🏠 **Landing Experience**

- 🎨 **Beautiful Hero Page** - Stunning landing page with call-to-action
- 🌟 **Feature Showcase** - Highlight key platform capabilities
- 📱 **Mobile-First Design** - Optimized for all devices from mobile to desktop

### 🎮 **Game Discovery**

- 🔍 **Advanced Search** - Real-time search with intelligent suggestions
- 🎯 **Smart Filtering** - Filter by genre, platform, rating, and release date
- 📊 **Multiple Sort Options** - Sort by popularity, rating, name, and release date
- ⚡ **Infinite Scrolling** - Seamless browsing with automatic content loading
- 🏷️ **Platform Icons** - Visual indicators for gaming platforms
- ⭐ **Critic Scores** - Professional game ratings and reviews

### 👤 **User Management**

- 🔐 **Secure Authentication** - JWT-based user registration and login
- 🔒 **Password Security** - Bcrypt encryption for user data protection
- 👥 **User Profiles** - Personalized profiles with gaming preferences
- 🌐 **Public Profiles** - Shareable profile pages for other users
- 🔍 **User Discovery** - Find and connect with other gamers

### 📚 **Personal Library Management**

- ❤️ **Favorites System** - Save and organize your favorite games
- ✅ **Played Games Tracking** - Mark games as played and track progress
- 📋 **Custom Lists** - Create and manage personalized game collections
- 🏷️ **List Organization** - Categorize games with custom tags and descriptions
- 📊 **Dashboard Analytics** - Overview of your gaming library and statistics

### 🎨 **User Experience**

- 🌓 **Dark/Light Mode** - Toggle between themes with system preference detection
- 📱 **Fully Responsive** - Optimized experience across all device sizes
- 🚀 **Fast Performance** - Optimized with modern web technologies
- 🎯 **Intuitive Navigation** - Clean, user-friendly interface design
- 📲 **Mobile Optimizations** - Touch-friendly controls and mobile navigation drawers

## 🏗️ Architecture

### **Frontend (React/TypeScript)**

- Modern React 18 with functional components and hooks
- TypeScript for type safety and better development experience
- Chakra UI for consistent and accessible component library
- TanStack React Query for efficient server state management
- Context API for global state management (auth, favorites, etc.)

### **Backend (Node.js/Express)**

- RESTful API architecture with Express.js
- JWT authentication with refresh token support
- MongoDB with Mongoose for data persistence
- Bcrypt for secure password hashing
- CORS configuration for cross-origin requests
- Comprehensive error handling and validation

### **Database (MongoDB)**

- User management with secure authentication
- Game favorites and played games tracking
- Custom game lists with full CRUD operations
- Optimized queries with proper indexing
- Data validation and schema enforcement

## 🚀 Tech Stack

### **Frontend**

- **Framework**: React 18 with TypeScript
- **UI Library**: Chakra UI v2.8.0
- **State Management**: TanStack React Query + Context API
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: React Icons
- **Animations**: Framer Motion
- **Routing**: Custom client-side routing

### **Backend**

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Validation**: Express Validator
- **CORS**: Cross-Origin Resource Sharing
- **Environment Management**: dotenv

### **External APIs**

- **RAWG Video Games Database**: Comprehensive game data and metadata

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Clone the Repository

```bash
git clone https://github.com/OmKumar07/GameVerse.git
cd GameVerse
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Create .env file with the following variables:
# MONGODB_URI=mongodb://localhost:27017/gameverse
# JWT_SECRET=your_jwt_secret_key
# PORT=5000

# Start MongoDB service (if using local installation)
# Start the backend server
npm start
```

### Frontend Setup

```bash
# Navigate to root directory
cd ..

# Install frontend dependencies
npm install

# Create .env file with:
# VITE_RAWG_API_KEY=your_rawg_api_key
# VITE_API_URL=http://localhost:5000

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend)

## 📦 API Endpoints

### **Authentication**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### **User Management**

- `GET /api/users/search` - Search users by username
- `GET /api/users/:username` - Get public user profile
- `PUT /api/users/profile` - Update user profile

### **Favorites**

- `GET /api/favorites` - Get user's favorite games
- `POST /api/favorites` - Add game to favorites
- `DELETE /api/favorites/:gameId` - Remove game from favorites

### **Played Games**

- `GET /api/played` - Get user's played games
- `POST /api/played` - Mark game as played
- `DELETE /api/played/:gameId` - Remove game from played list

### **Custom Lists**

- `GET /api/lists` - Get user's custom lists
- `POST /api/lists` - Create new custom list
- `PUT /api/lists/:listId` - Update custom list
- `DELETE /api/lists/:listId` - Delete custom list
- `POST /api/lists/:listId/games` - Add game to list
- `DELETE /api/lists/:listId/games/:gameId` - Remove game from list

## 🎯 Key Features Implementation

### **Authentication System**

- JWT-based authentication with secure token management
- Password hashing using bcrypt for security
- Protected routes and middleware for API security
- Persistent login state with local storage

### **Real-time Search**

- Debounced search input for optimal performance
- Real-time filtering with multiple criteria
- Responsive search results with pagination

### **State Management**

- Context API for global user state
- React Query for server state caching
- Optimistic updates for better user experience
- Error handling with user-friendly messages

### **Responsive Design**

- Mobile-first CSS with Chakra UI breakpoints
- Touch-friendly navigation for mobile devices
- Adaptive layouts for different screen sizes
- Progressive enhancement for desktop features

### **Performance Optimization**

- Code splitting and lazy loading
- Image optimization and lazy loading
- Efficient API caching with React Query
- Optimized bundle size with Vite

## 📁 Project Structure

```
GameVerse/
├── backend/                    # Backend server
│   ├── middleware/            # Express middleware
│   │   ├── auth.js           # Authentication middleware
│   │   └── upload.js         # File upload middleware
│   ├── models/               # MongoDB models
│   │   └── User.js          # User model schema
│   ├── routes/              # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── games.js        # Game-related routes
│   │   ├── lists.js        # Custom lists routes
│   │   ├── public.js       # Public routes
│   │   └── users.js        # User management routes
│   ├── package.json        # Backend dependencies
│   └── server.js           # Express server setup
├── src/                     # Frontend source code
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── lists/         # List management components
│   │   ├── profile/       # User profile components
│   │   ├── search/        # Search components
│   │   └── ui/           # UI components
│   ├── entities/          # TypeScript interfaces
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API client services
│   ├── theme/           # Theme configuration
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── public/              # Static assets
│   ├── logo.webp       # Application logo
│   └── favicon files   # Favicon assets
├── package.json        # Frontend dependencies
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite build configuration
└── README.md           # Project documentation
```

## 🚀 Deployment

### **Frontend Deployment (Netlify)**

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard
4. Set up custom domain (optional)

### **Backend Deployment (Railway/Heroku)**

1. Push backend code to GitHub repository
2. Connect repository to Railway or Heroku
3. Configure environment variables
4. Deploy with automatic builds

### **Database Deployment (MongoDB Atlas)**

1. Create MongoDB Atlas account
2. Set up cluster and database
3. Configure network access and authentication
4. Update connection string in environment variables

## 🤝 Contributing

We welcome contributions to GameVerse! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### **Development Guidelines**

- Follow TypeScript best practices
- Use Chakra UI components for consistency
- Write meaningful commit messages
- Add proper error handling
- Test your changes thoroughly

## 🐛 Known Issues & Future Enhancements

### **Current Limitations**

- User avatars are not yet implemented
- Social features (following, sharing) are limited
- Game reviews and ratings are read-only

### **Planned Features**

- User avatars and profile customization
- Social gaming features and friend connections
- Game reviews and rating system
- Advanced recommendation engine
- Push notifications for new games
- Mobile app development

## 📄 License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software as per the license terms.

## 🙏 Acknowledgments

- **[RAWG Video Games Database](https://rawg.io/)** - Comprehensive games API and database
- **[Chakra UI](https://chakra-ui.com/)** - Beautiful and accessible component library
- **[React Icons](https://react-icons.github.io/react-icons/)** - Comprehensive icon library
- **[Vite](https://vitejs.dev/)** - Fast and modern build tool
- **[MongoDB](https://www.mongodb.com/)** - Flexible and scalable database
- **[Express.js](https://expressjs.com/)** - Fast and minimalist web framework
- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization

## 📞 Contact & Links

- **👨‍💻 Developer**: Om Kumar
- **🐙 Repository**: [GitHub - GameVerse](https://github.com/OmKumar07/GameVerse)
- **🌐 Live Demo**: [GameVerse Live](https://game-verse7.netlify.app/)
- **📧 Contact**: Feel free to reach out for collaborations or questions

## 🌟 Show Your Support

If you found this project helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs or suggesting features
- 🤝 Contributing to the codebase
- 📢 Sharing with other developers

---

## 📊 Project Stats

- **Language**: TypeScript, JavaScript
- **Frontend**: React 18 + Chakra UI
- **Backend**: Node.js + Express + MongoDB
- **Total Features**: 25+ core features
- **Responsive**: Mobile-first design
- **Authentication**: JWT-based security
- **Database**: MongoDB with Mongoose
- **API Integration**: RAWG Games API

---

<div align="center">

**Made with ❤️+☕ by om**

_"Bringing gamers together, one game at a time"_

</div>
