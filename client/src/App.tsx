import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Layout from "./components/Layout/Layout";
import NotFound from "./pages/PageNotFound/PageNotFound";
import HomePage from "./pages/Homepage/HomePage";
import { configure } from 'axios-hooks';
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/Register/Register";
import { api } from "./services/api.js";
import { AuthProvider } from "./context/AuthContext.js";
import { ProtectedRoute, PublicOnlyRoute } from "./components/Layout/ProtectedRoute.js";

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
              <Route path="/movies" />
              <Route path="/tv" />
              <Route path="/topIMDB" />
              <Route path="/search" />

              <Route path="/movies/:movieId" />
              <Route path="/movies/:movieId/play" />
              <Route path="/tv/:tvId" />
              <Route path="/tv/:tvId/season/:season_number" />
              <Route path="/tv/:tvId/season/:season_number/episode/:episode_number" />
            </Route>
          </Route>

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
