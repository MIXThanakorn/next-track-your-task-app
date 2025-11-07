"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export default function SignInPage() {
  const router = useRouter();

  // state หลัก
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชัน alert แบบ custom
  const alertStyled = (message: string, success: boolean) => {
    if (typeof window === "undefined") return;
    const color = success ? "bg-green-600" : "bg-red-600";
    const div = document.createElement("div");
    div.className = `fixed inset-0 flex items-center justify-center z-50`;
    div.innerHTML = `
      <div class='${color} text-white px-10 py-6 rounded-lg shadow-lg text-center space-y-4'>
        <p class='text-lg font-semibold'>${message}</p>
        <button id='okBtn' class='bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200 transition'>OK</button>
      </div>
    `;
    document.body.appendChild(div);
    document
      .getElementById("okBtn")
      ?.addEventListener("click", () => div.remove());
  };

  // ฟังก์ชัน login
  const handleLogin = async () => {
    if (!email || !password) {
      alertStyled("กรุณากรอกอีเมลและรหัสผ่าน", false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_tb")
        .select("user_id, email, password")
        .eq("email", email)
        .maybeSingle();

      if (error || !data) {
        alertStyled("ไม่พบบัญชีนี้ในระบบ", false);
        return;
      }

      const stored = data.password as string;
      let isMatch = false;

      if (typeof stored === "string" && stored.startsWith("$2")) {
        isMatch = await bcrypt.compare(password, stored);
      } else {
        isMatch = password === stored;
        if (isMatch) {
          const newHashed = await bcrypt.hash(password, 10);
          await supabase
            .from("user_tb")
            .update({ password: newHashed })
            .eq("user_id", data.user_id);
        }
      }

      if (!isMatch) {
        alertStyled("รหัสผ่านไม่ถูกต้อง", false);
        return;
      }

      // ✅ เก็บ user_id ใน localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user_id", data.user_id);
      }

      alertStyled("เข้าสู่ระบบสำเร็จ!", true);

      // ✅ ไปหน้า /home แทน
      router.push("/home");
    } catch {
      alertStyled("เกิดข้อผิดพลาดในการเข้าสู่ระบบ", false);
    } finally {
      setLoading(false);
    }
  };

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        {/* Sign In Button */}
        <button
          id="signin_button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

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
