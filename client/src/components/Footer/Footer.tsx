import { Link } from "react-router-dom";
import {
  AtSymbolIcon,
  CameraIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          {/* Logo and Description Section */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                PopcornMovies
              </span>
            </Link>
            <p className="mt-4 max-w-[300px] text-gray-500 dark:text-gray-400">
              The best place to watch movies online for free with HD quality,
              Free TV Shows and stream live.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {/* Browse Column */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Browse
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-3">
                <li>
                  <Link to="/movies" className="hover:underline cursor-pointer">
                    Movies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/trending"
                    className="hover:underline cursor-pointer"
                  >
                    Top Rated
                  </Link>
                </li>
                <li>
                  <Link to="/actors" className="hover:underline cursor-pointer">
                    Popular
                  </Link>
                </li>
                <li>
                  <Link to="/actors" className="hover:underline cursor-pointer">
                    Upcoming
                  </Link>
                </li>
              </ul>
            </div>

            {/* TV Shows Column */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                TV Shows
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-3">
                <li>
                  <Link
                    to="/tv-shows"
                    className="hover:underline cursor-pointer"
                  >
                    TV Shows
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    className="hover:underline cursor-pointer"
                  >
                    Top Rated
                  </Link>
                </li>
                <li>
                  <Link
                    to="/request"
                    className="hover:underline cursor-pointer"
                  >
                    Popular
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                About
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium space-y-3">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="hover:underline cursor-pointer"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookie-policy"
                    className="hover:underline cursor-pointer"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:underline cursor-pointer">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        {/* Copyright and Social Icons Section */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025{" "}
            <Link to="/" className="hover:underline">
              PopcornMovies™
            </Link>
            . All Rights Reserved.
          </span>

          {/* Social Icons */}
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <AtSymbolIcon className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <CameraIcon className="h-6 w-6" />
            </a>
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              <PlayIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
