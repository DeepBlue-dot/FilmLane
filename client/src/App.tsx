import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Layout from "./components/Layout/Layout";
import NotFound from "./pages/PageNotFound/PageNotFound";
import HomePage from "./pages/Homepage/HomePage";

import { configure } from 'axios-hooks';
import LoginPage from "./pages/LoginPage/LoginPage";
import { api } from "./services/api.js";

configure({ axios: api });

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage/>}/>

        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage/>}/>
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
