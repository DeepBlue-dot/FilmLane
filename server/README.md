# FilmLane Backend Server

Welcome to the backend server of **FilmLane**, a premium movie and TV show discovery platform. This service provides user authentication, watchlist management, watch history tracking, and proxies request logic to the TMDB (The Movie Database) API.

Built with a modern TypeScript stack, it utilizes Express.js for routing, Prisma ORM for database access, and MySQL for persistent storage.

---

## 🚀 Tech Stack

- **Runtime Environment:** [Node.js](https://nodejs.org/) (ES Modules)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/) (with MySQL connector)
- **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) via HTTP-only Cookies
- **Request Validation:** [express-validator](https://express-validator.github.io/docs/)
- **HTTP Client:** [Axios](https://axios-http.com/) (for TMDB API integration)
- **Development Tooling:** [Nodemon](https://nodemon.io/) for hot-reloading & [ESLint](https://eslint.org/) for code quality

---

## 📁 Directory Structure

```text
server/
├── prisma/
│   └── schema.prisma        # Prisma schema defining database models
├── src/
│   ├── config/
│   │   └── db.ts            # Prisma Client instance configuration
│   ├── controllers/         # Request handlers & core business logic
│   ├── middleware/          # Authentication, error handling, and request validation
│   │   └── validators/      # Route-specific validation schemas
│   ├── routes/              # Express route declarations
│   ├── services/            # Custom helper utilities and third-party integrations
│   │   ├── tmdbService.ts   # Client wrapper for TMDB API interaction
│   │   └── queryParser.ts   # Advanced Prisma query parsing (filters, sorting, pagination)
│   ├── app.ts               # Express application initialization & middleware setup
│   └── index.ts             # Server entry point (starts server)
├── testing/
│   └── FilmLane.postman_collection.json # API testing collection for Postman
├── package.json             # Scripts and dependencies
└── tsconfig.json            # TypeScript configuration
```

---

## 🗄️ Database Schema

The database consists of three core models defined in `prisma/schema.prisma`:

### 1. `User`
Stores registration and profile details.
- `id` (String, UUID, Primary Key)
- `email` (String, Unique)
- `passwordHash` (String)
- `username` (String)
- `createdAt` / `updatedAt` (DateTime)

### 2. `WatchlistItem`
Stores media that users have bookmarked to watch later.
- `id` (String, UUID, Primary Key)
- `userId` (String, Foreign Key -> User)
- `tmdbId` (Int, TMDB ID of the movie or show)
- `mediaType` (Enum: `MOVIE`, `SERIES`, `SEASON`, `EPISODE`)
- `addedAt` (DateTime)
- *Constraint:* Unique composite index on `(userId, tmdbId, mediaType)` prevents duplicate entries.

### 3. `WatchHistory`
Tracks media watched by users.
- `id` (String, UUID, Primary Key)
- `userId` (String, Foreign Key -> User)
- `tmdbId` (Int, TMDB ID of the movie or show)
- `mediaType` (Enum: `MOVIE`, `SERIES`, `SEASON`, `EPISODE`)
- `watchedAt` (DateTime)

---

## 🔑 Configuration & Environment Variables

Create a `.env` file in the root of the server directory (or ensure the root project directory has one configured) with the following environment variables:

| Variable | Description | Example |
|---|---|---|
| `PORT` | The port the Express server will listen on. | `3000` |
| `DATABASE_URL` | MySQL connection string for Prisma. | `mysql://user:password@localhost:3306/filmlane` |
| `JWT_SECRET` | Secret key used to sign and verify JWT authentication tokens. | `your_super_secret_jwt_key` |
| `JWT_COOKIE_EXPIRES_IN` | Duration in days for JWT cookie validity. | `7` |
| `TMDB_API_KEY` | API Key or Read Access Token (v4) for TMDB. | `your_tmdb_api_key_or_token` |
| `TMDB_BASE_URL` | Base URL of the TMDB API. | `https://api.themoviedb.org/3` |
| `TMDB_API_AUTH_MODE` | Authentication mode to communicate with TMDB (`bearer` or `query`). | `bearer` |
| `NODE_ENV` | Application environment. | `development` |

---

## 🛣️ API Endpoints

All base API routes are prefixed with `/api`.

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required | Request Body / Params |
|---|---|---|:---:|---|
| **POST** | `/register` | Register a new user | ❌ | `{ username, email, password, confirmPassword }` |
| **POST** | `/login` | Log in a user and set cookie | ❌ | `{ email, password }` |
| **GET** | `/logout` | Log out and clear authentication cookie | ❌ | - |

### 👤 User Management (`/api/users`)
| Method | Endpoint | Description | Auth Required | Request Body / Params |
|---|---|---|:---:|---|
| **GET** | `/me` | Get the profile of the logged-in user | `Yes` | - |
| **PUT** | `/me` | Update profile information (e.g. username/password) | `Yes` | `{ username, password, confirmPassword }` |
| **DELETE** | `/me` | Delete the logged-in user account | `Yes` | - |
| **GET** | `/:id` | Get details of a user by their ID | ❌ | - |
| **GET** | `/` | Retrieve a list of users (supports pagination & sorting) | ❌ | Query params: `page`, `limit`, `sort` |
| **PUT** | `/:id` | Update a user profile by ID | ❌ | `{ username, email }` |
| **DELETE** | `/:id` | Delete a user profile by ID | ❌ | - |

### 📋 Watchlist (`/api`)
| Method | Endpoint | Description | Auth Required | Request Body / Params |
|---|---|---|:---:|---|
| **GET** | `/users/me/watchlist-Items` | Get the logged-in user's watchlist | `Yes` | - |
| **GET** | `/users/:userId/watchlist-Items` | Get a specific user's public watchlist | ❌ | - |
| **POST** | `/users/me/watchlist-Items` | Add a movie/show to the watchlist | `Yes` | `{ tmdbId, mediaType }` |
| **GET** | `/users/me/watchlist-Items/:ItemId` | Retrieve a specific item from the watchlist | `Yes` | - |
| **GET** | `/users/:userId/watchlist-Items/:ItemId` | Get watchlist item details by user and item ID | ❌ | - |
| **DELETE** | `/users/me/watchlist-Items/:ItemId` | Delete an item from the watchlist | `Yes` | - |
| **DELETE** | `/users/:userId/watchlist-Items/:ItemId` | Delete a watchlist item by user and item ID | ❌ | - |

### 🕒 Watch History (`/api`)
| Method | Endpoint | Description | Auth Required | Request Body / Params |
|---|---|---|:---:|---|
| **GET** | `/users/me/watch-history` | Get the logged-in user's watch history | `Yes` | - |
| **GET** | `/users/:userId/watch-history` | Get a specific user's public watch history | ❌ | - |
| **POST** | `/users/me/watch-history` | Add an item to the watch history | `Yes` | `{ tmdbId, mediaType }` |
| **GET** | `/users/me/watch-history/:ItemId` | Retrieve a specific item from the watch history | ❌ | - |
| **GET** | `/users/:userId/watch-history/:ItemId` | Retrieve watch history item details | ❌ | - |
| **DELETE** | `/users/me/watch-history/:ItemId` | Delete a watch history record | ❌ | - |
| **DELETE** | `/users/:userId/watch-history/:ItemId` | Delete a watch history record by user and item ID | ❌ | - |

### 🎬 Movies & TV Shows (TMDB Proxy) (`/api`)
These routes forward queries to the TMDB API and filter metadata as necessary.
| Method | Endpoint | Description | Auth Required | Key Query Parameters |
|---|---|---|:---:|---|
| **GET** | `/movie/:movieId` | Get detailed movie info | ❌ | `appendToResponse` |
| **GET** | `/tv/:series_id` | Get detailed TV series info | ❌ | `appendToResponse` |
| **GET** | `/tv/:series_id/season/:season_number` | Get TV season info | ❌ | `appendToResponse` |
| **GET** | `/tv/:series_id/season/:season_number/episode/:episode_number` | Get TV episode info | ❌ | `appendToResponse` |
| **GET** | `/genre/movie/list` | Get all movie genres | ❌ | - |
| **GET** | `/genre/movie/:genreId` | Get name of a movie genre | ❌ | - |
| **GET** | `/genre/tv/list` | Get all TV genres | ❌ | - |
| **GET** | `/genre/tv/:genreId` | Get name of a TV genre | ❌ | - |
| **GET** | `/discover/movie` | Discover movies dynamically | ❌ | `sort_by`, `page`, `primaryReleaseYear`, `voteAverageGte` |
| **GET** | `/discover/tv` | Discover TV shows dynamically | ❌ | `sort_by`, `page`, `firstAirDateYear`, `voteAverageGte` |
| **GET** | `/search/movie` | Search for movies | ❌ | `query`, `page`, `primary_release_year` |
| **GET** | `/search/tv` | Search for TV shows | ❌ | `query`, `page`, `first_air_date_year` |
| **GET** | `/search/multi` | Search all categories (movies, TV, people) | ❌ | `query`, `page` |
| **GET** | `/countries` | Get TMDB configuration country list | ❌ | - |
| **GET** | `/Languages` | Get TMDB configuration language list | ❌ | - |

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL instance

### Installation
1. Install package dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables inside `.env`:
   ```bash
   cp .env.example .env # Create .env and populate keys
   ```

3. Synchronize your Prisma schema with the MySQL database:
   ```bash
   npx prisma db push
   ```

4. Build the TypeScript source code:
   ```bash
   npm run build
   ```

5. Run the application:
   - **Development (with hot reload):**
     ```bash
     npm run dev
     ```
   - **Production:**
     ```bash
     npm run start
     ```
