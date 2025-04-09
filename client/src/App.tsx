import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Layout from "./components/Layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/home"  />
          <Route path="/genre"  />
          <Route path="/countries"  />
          <Route path="/movies"  />
          <Route path="/tv"  />
          <Route path="/search"  />

          <Route path="/movies/:movieId"  />
          <Route path="/movies/:movieId/play"  />
          <Route path="/tv/:tvId"  />
          <Route path="/tv/:tvId/season/:season_number"  />
          <Route path="/tv/:tvId/season/:season_number/episode/:episode_number"  />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
