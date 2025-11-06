"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SimpleAuth } from "./SimpleAuth";

/**
 * Navbar component renders the top navigation bar for the application.
 * - Displays the logo, navigation links (Add Service, View Map), and authentication controls.
 * - Adjusts link display for small screens, showing compact icons when necessary.
 * - Integrates the SimpleAuth component for login/logout functionality.
 * - Handles responsive layout by monitoring viewport width and updating the `isSmall` state.
 */

export default function Navbar() {
  const [isSmall, setIsSmall] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handler = () => setIsSmall(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const compactLinks = isSmall && showLogin;

  return (
    <header className="bg-white shadow-sm font-work-sans backdrop-blur-sm sticky top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-14 sm:h-16 min-h-14 overflow-x-auto no-scrollbar  overflow-y-hidden">
          {/* Logo section */}
          <div className="shrink-0 flex items-center w-32 sm:w-36">
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="logo"
                width={144}
                height={25}
                className="h-auto object-contain"
              />
            </Link>
          </div>

          {/* Nav links + Auth */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 shrink min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
              {/* Add Service */}
              {!compactLinks ? (
                <Link
                  href="/create"
                  className="text-xs sm:text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
                >
                  Add Service
                </Link>
              ) : (
                <Link
                  href="/create"
                  aria-label="Add Service"
                  className="p-1.5 rounded-md hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                </Link>
              )}

              {/* View Map */}
              {!compactLinks ? (
                <Link
                  href="/map"
                  className="text-xs sm:text-sm font-medium hover:text-primary transition-colors whitespace-nowrap"
                >
                  View Map
                </Link>
              ) : (
                <Link
                  href="/map"
                  aria-label="View Map"
                  className="p-1.5 rounded-md hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 1118 0z"></path>
                    <circle cx="12" cy="10" r="2"></circle>
                  </svg>
                </Link>
              )}
            </div>

            {/* Auth section */}
            <SimpleAuth showLogin={showLogin} setShowLogin={setShowLogin} />
          </div>
        </nav>
      </div>
    </header>
  );
}
