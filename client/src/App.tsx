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
      <BrowserRouter>
        <Routes>
          {/* Public-only routes (unauthenticated users only) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes (authenticated users only) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/genre" />
              <Route path="/countries" />
              <Route path="/movies" element={<MovieDiscoveryPage />} />
              <Route path="/tv" element={<TvDiscoveryPage />} />
              <Route path="/topIMDB" element={<TopIMDBPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/profile" element={<UserProfilePage />} />

              <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
              <Route path="/movies/:movieId/play" element={<MoviePlayPage />} />
              <Route path="/tv/:tvId" element={<TvDetailsPage />} />
              <Route path="/tv/:tvId/season/:season_number" element={<TvDetailsPage />} />
              <Route path="/tv/:tvId/season/:season_number/episode/:episode_number" element={<TvEpisodePlayPage />} />
            </Route>
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
