import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Layout from "./components/Layout/Layout";
import NotFound from "./pages/PageNotFound/PageNotFound";
import HomePage from "./pages/Homepage/HomePage.js";
import { configure } from 'axios-hooks';
import LoginPage from "./pages/LoginPage/LoginPage.js";
import RegisterPage from "./pages/Register/Register.js";
import { api } from "./services/api.js";
import { AuthProvider } from "./context/AuthContext.js";
import { ProtectedRoute, PublicOnlyRoute } from "./components/Layout/ProtectedRoute.js";
import SearchPage from "./pages/SearchPage/SearchPage.js";
import MovieDiscoveryPage from "./pages/MovieDiscovery/MovieDiscoveryPage.js";
import TvDiscoveryPage from "./pages/TvDiscovery/TvDiscoveryPage.js";
import TopIMDBPage from "./pages/TopIMDB/TopIMDBPage.js";
import MovieDetailsPage from "./pages/MovieDetails/MovieDetailsPage.js";
import TvDetailsPage from "./pages/TvDetails/TvDetailsPage.js";
import MoviePlayPage from "./pages/MoviePlay/MoviePlayPage.js";
import TvEpisodePlayPage from "./pages/TvEpisodePlay/TvEpisodePlayPage.js";
import UserProfilePage from "./pages/UserProfile/UserProfilePage.js";

configure({ axios: api });

export default function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-gray-950 text-white overflow-x-hidden">
        {/* Global animated ambient background blobs */}
        <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none z-0 animate-orb1" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-600/5 blur-[130px] pointer-events-none z-0 animate-orb2" />

        <div className="relative z-10 min-h-screen flex flex-col">
          <BrowserRouter>
            <Routes>
              {/* Public-only routes (unauthenticated users only) */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Mixed routes: Layout is rendered for guests and members */}
              <Route element={<Layout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/genre" />
                <Route path="/countries" />
                <Route path="/movies" element={<MovieDiscoveryPage />} />
                <Route path="/tv" element={<TvDiscoveryPage />} />
                <Route path="/topIMDB" element={<TopIMDBPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
                <Route path="/tv/:tvId" element={<TvDetailsPage />} />
                <Route path="/tv/:tvId/season/:season_number" element={<TvDetailsPage />} />

                {/* Protected routes under Layout (authenticated users only) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route path="/movies/:movieId/play" element={<MoviePlayPage />} />
                  <Route path="/tv/:tvId/season/:season_number/episode/:episode_number" element={<TvEpisodePlayPage />} />
                </Route>
              </Route>

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}
