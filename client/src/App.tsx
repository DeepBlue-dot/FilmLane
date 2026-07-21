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
import TrendingPage from "./pages/Trending/TrendingPage.js";
import UpcomingPage from "./pages/Upcoming/UpcomingPage.js";
import ErrorBoundary from "./components/Layout/ErrorBoundary";

configure({ axios: api });

export default function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden select-none">
        {/* NON-DISTRACTING AMBIENT AURORA & BOKEH LIGHTS BACKGROUND FOR ALL PAGES */}
        <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden">
          {/* Gentle Aurora Radial Lighting */}
          <div className="absolute -top-40 left-1/4 w-[750px] h-[750px] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-[140px] animate-aurora" />
          <div className="absolute bottom-0 -right-40 w-[800px] h-[800px] bg-gradient-to-tl from-pink-600/15 via-rose-600/10 to-transparent rounded-full blur-[160px] animate-orb2" />
          <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-glow-pulse" />

          {/* Floating Soft Bokeh Light Particles */}
          <div className="absolute top-1/4 left-1/5 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl animate-particle-1" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-500/15 rounded-full blur-2xl animate-particle-2" />
          <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-pink-500/15 rounded-full blur-xl animate-particle-3" />
          <div className="absolute top-3/4 right-1/3 w-14 h-14 bg-cyan-500/15 rounded-full blur-lg animate-particle-1" />

          {/* Fine Subtle Glass Mesh Filter */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px]" />
        </div>

        {/* MAIN ROUTER APP CONTENT */}
        <div className="relative min-h-screen flex flex-col z-10">
          <BrowserRouter>
            <ErrorBoundary>
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
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/upcoming" element={<UpcomingPage />} />
                  <Route path="/topIMDB" element={<TopIMDBPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
                  <Route path="/tv/:tvId" element={<TvDetailsPage />} />
                  <Route path="/tv/:tvId/season/:season_number" element={<TvDetailsPage />} />

                  <Route path="/movies/:movieId/play" element={<MoviePlayPage />} />
                  <Route path="/tv/:tvId/season/:season_number/episode/:episode_number" element={<TvEpisodePlayPage />} />

                  {/* Protected routes under Layout (authenticated users only) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<UserProfilePage />} />
                  </Route>
                </Route>

                {/* Catch-all 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}
