import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <>
      <header>
        <div className="logo">🍿 PopcornMovies</div>
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/tv">TV Shows</Link>
          <Link to="/topIMDB">Top IMDb</Link>
        </nav>
        <div>
          <a href="#" className="btn-homepage">
            Register
          </a>
          <a href="#" className="btn-homepage">
            Sign in
          </a>
        </div>
      </header>
      <div className="hero">
        <h1>POPCORNMOVIES</h1>
        <p>70,000+ Movies 35,000+ TV Shows And Live Broadcasts</p>
        <div className="search-bar">
          <input type="text" placeholder="Search .." />
        </div>
        <Link to="/home" className="btn-homepage"> Go to Homepage</Link>
      </div>
      <footer>
        <div>
          <h4>PopcornMovies</h4>
          <p>
            The best place to watch movies online for free with HD quality, Free
            TV Shows and stream liv
          </p>
          <p>© 2025 PopcornMovies. All rights reserved.</p>
        </div>
        <div>
          <h4>Browse</h4>
          <p>Movies</p>
          <p>Trending</p>
          <p>Live broadcasts</p>
          <p>Actors</p>
          <p>Subscription</p>
        </div>
        <div>
          <h4></h4>
          <p>TV Shows</p>
          <p>Top IMDb</p>
          <p>Collections</p>
          <p>Request</p>
          <p>Discord</p>
        </div>
        <div>
          <h4>About</h4>
          <p>Privacy Policy</p>
          <p>DMCA</p>
          <p>Cookie Policy</p>
          <p>Terms</p>
        </div>
      </footer>
    </>
  );
}
