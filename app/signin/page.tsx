"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6 border border-blue-100">
        <h1 className="text-2xl font-semibold text-center text-blue-600">
          Welcome Back
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Sign in to continue your journey
        </p>

        <div className="space-y-5">
          {/* Email */}
          <div>
            <label
              htmlFor="signin_email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="signin_email"
              type="email"
              placeholder="example@email.com"
              className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="signin_password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="signin_password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-blue-500 transition"
            >
              {showPassword ? (
                // Hide icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10
                           0-.838.103-1.653.3-2.435M3.172 3.172l17.656 17.656M15.5 15.5
                           L8.5 8.5m6.28 6.28A3 3 0 018.22 8.22"
                  />
                </svg>
              ) : (
                // Show icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943
                           9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input
                id="remember_me"
                type="checkbox"
                className="accent-blue-500"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Sign In Button */}
        <Link href="/home">
          <button
            id="signin_button"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </Link>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <div className="h-px w-16 bg-gray-200"></div>
          or
          <div className="h-px w-16 bg-gray-200"></div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
