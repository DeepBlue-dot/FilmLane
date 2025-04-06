# FilmLane 🎬

A modern movie streaming platform built with TypeScript, React, and Node.js. Powered by TMDB's extensive media database with personalized watchlists and viewing history.

[![React](https://img.shields.io/badge/React-19-%2361DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-%233178C6)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-%23339933)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-%232D3748)](https://www.prisma.io/)

## 🌟 Features
- 🎥 Browse movies/TV shows with real-time TMDB data
- 🔐 JWT-based user authentication
- 📺 Watch history tracking with resume functionality
- ❤️ Personalized watchlist system
- 🎨 Responsive UI with skeleton loading states
- 🔍 Advanced search with filters and sorting
- ⚡ Vite-powered ultra-fast development workflow

## 🛠 Tech Stack
### Frontend
- **React 19** with Vite toolchain
- **TypeScript** for type-safe development
- **React Router 7** for client-side navigation
- **Heroicons** & **React Icons** for UI elements

### Backend
- **Node.js** with **Express** framework
- **Prisma ORM** for database management
- **MySQL** relational database
- **JWT** for secure authentication
- **Axios** for TMDB API integration

## 🚀 Quick Start
### Requirements
- Node.js v20+
- MySQL 8+
- TMDB API account ([Get API Key](https://www.themoviedb.org/documentation/api))

### Installation
```bash
git clone https://github.com/yourusername/FilmLane.git
cd FilmLane

# Install dependencies
cd client && npm install
cd ../server && npm install
```

### Environment Setup
1. Create `.env` files in both `client` and `server` directories
2. Configure environment variables:

**server/.env**
```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/filmlane"
JWT_SECRET="your_secure_jwt_secret"
TMDB_API_KEY="your_tmdb_v4_key"
CLIENT_URL="http://localhost:5173"
```

**client/.env**
```env
VITE_TMDB_API_KEY="your_tmdb_v4_key"
VITE_SERVER_URL="http://localhost:3000"
```

### Database Initialization
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### Running the App
```bash
# Frontend (from /client directory)
npm run dev

# Backend (from /server directory)
npm run dev
```
Access the app at `http://localhost:5173`

## 📁 Project Structure
```
FilmLane/
├── client/               # React frontend
│   ├── src/             # Application source code
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Route components
│   │   └── utils/       # Helper functions
│   └── vite.config.ts   # Build configuration
│
├── server/              # Express backend
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth & validation
│   │   ├── routes/      # API endpoints
│   │   └── services/    # Business logic
│   └── prisma/          # Database schema
│
└── .env.example         # Environment template
```

## 🔑 Key Components
- **Authentication System**: Secure JWT-based auth with cookie storage
- **TMDB Integration**: Real-time sync with The Movie Database API
- **Watchlist Management**: CRUD operations for user watchlists
- **Media Type Handling**: Supports movies, series, seasons, and episodes
- **Prisma ORM**: Type-safe database operations with MySQL

## 📜 Scripts
### Frontend
```bash
npm run dev    # Start development server
npm run build  # Create production build
npm run lint   # Run ESLint checks
```

### Backend
```bash
npm run dev    # Start dev server with hot reload
npm start      # Start production server
npm run build  # Compile TypeScript
```

## 🌐 API Integration
The backend integrates with TMDB's API v4 to fetch:
- Movie/TV show metadata
- High-quality media assets
- Cast and crew information
- Video trailers and clips
- Recommendations and similar content

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Note**: Requires valid TMDB API key for media data. Register at [TMDB API Portal](https://www.themoviedb.org/documentation/api)
```