import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isNestedDropdownOpen, setIsNestedDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Flowbite
          </span>
        </Link>

        <div className="flex items-center md:order-2">
          {/* Desktop search input */}
          <div className="hidden md:block relative md:me-3">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>

          {/* User dropdown */}
          <div className="relative ml-3">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="/docs/images/people/profile-picture-3.jpg"
                alt="user photo"
              />
            </button>
            
            {isUserDropdownOpen && (
              <div className="z-50 absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    Bonnie Green
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    name@flowbite.com
                  </span>
                </div>
                <ul>
                  <li>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/earnings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Earnings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Desktop menu items */}
        <div className="hidden md:flex items-center justify-between w-full md:w-auto md:order-1">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/home"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </Link>
            </li>

            <li className="relative group">
              <button
                className="flex items-center justify-between px-3 py-2 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500"
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
              >
                Genre
                <svg
                  className="w-2.5 h-2.5 ms-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {isGenreDropdownOpen && (
                <div className="absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li className="relative">
                      <button
                        className="flex justify-between items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setIsNestedDropdownOpen(!isNestedDropdownOpen)}
                      >
                        Dropdown
                        <svg
                          className="w-2.5 h-2.5 ms-2.5"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </button>
                      {isNestedDropdownOpen && (
                        <div className="absolute left-full top-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                          <ul className="py-2 text-sm">
                            <li>
                              <Link
                                to="/overview"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                              >
                                Overview
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/downloads"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                              >
                                My downloads
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/billing"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                              >
                                Billing
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/rewards"
                                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                              >
                                Rewards
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </li>
                    <li>
                      <Link
                        to="/earnings"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        Earnings
                      </Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <Link
                      to="/signout"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </li>

            <li>
              <Link
                to="/countries"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Countries
              </Link>
            </li>
            <li>
              <Link
                to="/movies"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                to="/tv"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                TV Shows
              </Link>
            </li>
            <li>
              <Link
                to="/topIMDB"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Top IMDB
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden w-full mt-4 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="relative">
            <input
              type="text"
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>

          <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/countries"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Countries
              </Link>
            </li>
            <li>
              <Link
                to="/movies"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Movies
              </Link>
            </li>
            <li>
              <Link
                to="/tv"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                TV Shows
              </Link>
            </li>
            <li>
              <Link
                to="/topIMDB"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Top IMDB
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/signout"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
              >
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}