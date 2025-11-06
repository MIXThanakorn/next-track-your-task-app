"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2">
          {/* Placeholder Logo */}
          <div className="w-10 h-10 relative">
            <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-semibold text-blue-700">
            Track Your Task
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/signin"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
