"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 md:py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2">
          {/* Logo */}
          <div className="w-8 h-8 md:w-10 md:h-10 relative">
            <Image
              src="/icon1.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-base md:text-xl font-semibold text-blue-700">
            Track Your Task
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link
            href="/signup"
            className="px-2 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/signin"
            className="px-2 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
