import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Layout from "./components/Layout/Layout";
import NotFound from "./pages/PageNotFound/PageNotFound";

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
          <Route path="/topIMDB"  />
          <Route path="/search"  />

          <Route path="/movies/:movieId"  />
          <Route path="/movies/:movieId/play"  />
          <Route path="/tv/:tvId"  />
          <Route path="/tv/:tvId/season/:season_number"  />
          <Route path="/tv/:tvId/season/:season_number/episode/:episode_number"  />
          <Route path="*" element={<NotFound/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
