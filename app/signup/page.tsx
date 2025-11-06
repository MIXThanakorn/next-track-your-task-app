"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    const input = document.getElementById("profile_image") as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6 border border-blue-100 mt-10 mb-10">
        <h1 className="text-2xl font-semibold text-center text-blue-600">
          Create Account
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Join us and start tracking your tasks efficiently
        </p>

        {/* Upload Image */}
        <div className="flex flex-col items-center gap-3">
          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Profile preview"
                width={120}
                height={120}
                className="rounded-full object-cover border border-blue-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ) : (
            <label
              htmlFor="profile_image"
              className="w-28 h-28 rounded-full flex flex-col items-center justify-center bg-blue-50 border-2 border-dashed border-blue-300 text-blue-500 cursor-pointer hover:bg-blue-100"
            >
              <span className="text-sm">Upload</span>
              <span className="text-xs text-gray-500">profile image</span>
            </label>
          )}
          <input
            id="profile_image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. 0812345678"
              className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-2"
            />
          </div>

          {/* Password + Show/Hide */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
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
                // 👁 Hide icon
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
                // 👁 Show icon
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

          {/* Gender Radio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="gender_male"
                  className="text-blue-500"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="gender_female"
                  className="text-blue-500"
                />
                <span>Female</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="gender_other"
                  className="text-blue-500"
                />
                <span>Other</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          id="signup_button"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        {/* Signin link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
