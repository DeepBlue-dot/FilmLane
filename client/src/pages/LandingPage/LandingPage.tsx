import { Link } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import NavBar from "./NavBar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 px-4 py-16">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
        <div className="text-center max-w-2xl mx-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in-down">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-indigo-400 dark:to-pink-400">
              POPCORNMOVIES
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 animate-fade-in-down delay-100">
            70,000+ Movies · 35,000+ TV Shows · Live Broadcasts
          </p>

          <div className="relative max-w-lg mx-auto mb-8 animate-fade-in-down delay-200">
            <div className="flex items-center relative">
              <input
                type="text"
                placeholder="Search movies, shows, and more..."
                aria-label="Search movies and TV shows"
                className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-full text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 transition-all pr-14"
              />
              <button className="absolute right-4 p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <Link
            to="/home"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 text-white font-semibold rounded-full px-8 py-3 shadow-lg hover:shadow-indigo-500/30 dark:hover:shadow-indigo-400/30 animate-fade-in-down delay-300"
          >
            Start Exploring Now
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}