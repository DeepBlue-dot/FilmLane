# FilmLane 🎬

FilmLane is a premium, modern movie and TV show discovery platform built with a high-performance stack using **React 19**, **Vite**, **TypeScript**, and **Express**. Powered by **TMDB** and backed by a resilient **OMDb Fallback Engine**, it supports advanced filtering, sorting, state-backed watchlists, and seamless watch history tracking.

([DEMO](https://filelane-blond.vercel.app))

---

[![React](https://img.shields.io/badge/React-19.0-%2361DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-%233178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-%23339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-%2338B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-%232D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-%234169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

![Project Screenshot](assets/images/screencapture-filelane-blond-vercel-app-2026-07-21-14_49_20.png)

---

## 🌟 Key Features

*   **🎬 Immersive Catalog Discovery**: Real-time browsing of thousands of movies and TV shows sorted by popularity, IMDb rating, release date, and filtered by genre, language, or year.
*   **🔄 Resilient Multi-API Architecture**:
    *   **TMDB Service**: Primary data source supplying high-resolution media details, recommendations, aggregate cast, and trailer assets.
    *   [OMDb Fallback Service](file:///home/bigblue/Projects/web/FilmLane/server/src/services/omdbService.ts): Graceful degradation system that auto-switches to OMDb if TMDB rate limits are hit or the service goes down.
*   **📊 Grid-Optimized Pagination**: Custom server-side pagination wrapping in [tmdbService.ts](file:///home/bigblue/Projects/web/FilmLane/server/src/services/tmdbService.ts) that fetches multiple TMDB pages concurrently to feed a perfectly-aligned **24 items per page** layout.
*   **📺 Watch History & Resume Playback**: Stateful user activity logs with support for resuming movies/episodes.
*   **❤️ Stateful Watchlist**: Synced database-backed collection to bookmark titles.
*   **🔐 Secure Authentication**: JWT-based session security with credential hashing and request validations.
*   **🎨 Premium Responsive UX**: Built with fluid styling, dark mode accents, micro-animations, and custom skeleton loaders for page transiting.

---

## 🛠 Tech Stack

### Frontend
*   **React 19 & Vite**: Ultra-fast build and hot module replacement.
*   **TypeScript**: Full type safety across component properties, contexts, and API hooks.
*   **Tailwind CSS v4**: Optimized CSS compiler for sleek design components.
*   **React Router 7**: Modern routing and page loaders.
*   **Radix UI & Heroicons**: Accessible design primitives and dynamic icons.

### Backend & Database
*   **Node.js & Express**: Extensible API routing and controller handlers.
*   **Prisma ORM**: Modern database access layer with static typing.
*   **PostgreSQL**: Secure, ACID-compliant relational storage.
*   **Jest & Supertest**: Robust unit and integration testing suite.

---

## 📁 Project Structure

```
FilmLane/
├── client/                     # Frontend Vite + React App
│   ├── src/
│   │   ├── components/        # Reusable components (features, layouts, UI skeleton)
│   │   ├── hooks/             # Stateful logic (auth, watchlist)
│   │   ├── pages/             # Layout pages (Discovery, Trending, Details, User Profile)
│   │   ├── services/          # Axios API wrappers
│   │   └── types/             # Common TypeScript interfaces
│   └── package.json
│
├── server/                     # Backend API Service
│   ├── src/
│   │   ├── controllers/       # Controller routing handlers
│   │   ├── middleware/        # JWT Authentication & Validation helpers
│   │   ├── routes/            # Express Endpoint maps
│   │   ├── services/          # TMDB Engine, OMDb Fallback, & async handlers
│   │   └── utils/             # Exception definitions
│   ├── prisma/                # PostgreSQL Schema & seed scripts
│   └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** v20+
*   **PostgreSQL** Database instance
*   **TMDB API Key** (v3 Bearer or query key - [Get Key](https://www.themoviedb.org/documentation/api))
*   *(Optional)* **OMDb API Key** (for data fallback - [Get Key](http://www.omdbapi.com/))

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/FilmLane.git
    cd FilmLane
    ```

2.  Install dependencies for both folders:
    ```bash
    # Client dependencies
    cd client && npm install
    
    # Server dependencies
    cd ../server && npm install
    ```

### Environment Configuration

Create `.env` configurations in the respective sub-directories:

**`server/.env`**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/filmlane?schema=public"
JWT_SECRET="your_custom_jwt_signing_hash"
TMDB_API_KEY="your_tmdb_bearer_token"
TMDB_API_AUTH_MODE="bearer" # or 'query'
CLIENT_URL="http://localhost:5173"
OMDB_API_KEY="optional_omdb_fallback_key"
```

**`client/.env`**
```env
VITE_SERVER_URL="http://localhost:3000/api"
```

### Database Initialization

Generate the Prisma client and apply database migrations:
```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

*(Optional)* Seed initial data:
```bash
npm run seed
```

---

## 📜 Development Scripts

### Backend (`/server`)
```bash
npm run dev      # Runs server locally with nodemon reload
npm run build    # Compiles TypeScript source to /dist
npm run test     # Executes Jest test suits
npm start        # Launches compiled production build
```

### Frontend (`/client`)
```bash
npm run dev      # Boots local Vite dev server
npm run build    # Creates optimized production build in /dist
npm run lint     # Analyzes workspace for lint warnings
```

---

## 🌐 API Architecture

All endpoint actions are structured under `/api` in the backend:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/auth/register` | Register new user account | ❌ |
| **POST** | `/auth/login` | Securely authenticate user sessions | ❌ |
| **GET** | `/discover/movie` | Fetch paginated discovery movies (24 per page) | ❌ |
| **GET** | `/discover/tv` | Fetch paginated discovery TV shows (24 per page) | ❌ |
| **GET** | `/trending/:media_type/:time_window` | Retrieve trending lists | ❌ |
| **GET** | `/watchlist` | Fetch watchlist for authenticated user |  |
| **POST** | `/watchlist` | Add movie or show to custom watchlist |  |
| **GET** | `/users/me/watch-history` | Retrieve user's resume and watch history |  |

> [!NOTE]
> The `/discover` and `/search` endpoints support standard queries like `sortBy`, `withGenres`, `primaryReleaseYear`, `withOriginalLanguage`, and `page`. 

---

## 🤝 Contributing

We welcome additions, fixes, and suggestions!
1.  Fork this repository.
2.  Create your branch (`git checkout -b feature/cool-addition`).
3.  Commit your edits (`git commit -m 'Implement cool feature'`).
4.  Push changes (`git push origin feature/cool-addition`).
5.  Submit a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.