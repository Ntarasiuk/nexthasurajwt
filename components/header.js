import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { useUser } from "../lib/hooks";

const Header = () => {
  const router = useRouter();
  const user = useUser({redirectTo: '/'});
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header>
      <nav className="bg-gray-800 fixed w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>

                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>

                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <Link href="/">
                    <a
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        router.pathname === "/"
                          ? "text-white bg-gray-900"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/spotify">
                    <a
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        router.pathname === "spotify"
                          ? "text-white bg-gray-900"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      Spotify
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="ml-3 relative">
                {user ? (
                  <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                    <button
                      className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      id="user-menu"
                      aria-haspopup="true"
                      onClick={() => setMenuOpen(!menuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </button>
                  </ClickAwayListener>
                ) : (
                  <Link href="/login">
                    <a
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        router.pathname === "/login"
                          ? "text-white bg-gray-900"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      Login
                    </a>
                  </Link>
                )}
                {menuOpen ? (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <Link href="/profile">
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Your Profile
                      </a>
                    </Link>
                    <Link href="/api/logout">
                      <a
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </a>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Team
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Projects
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Calendar
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
