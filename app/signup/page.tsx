"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export default function SignUpPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  // แสดง preview ของรูปภาพเมื่อผู้ใช้เลือกไฟล์
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ลบรูปภาพออกจาก preview
  const handleRemoveImage = () => {
    setPreview(null);
    setImageFile(null);
    const input = document.getElementById("profile_image") as HTMLInputElement;
    if (input) input.value = "";
  };

  // รีเซ็ตฟอร์ม
  const handleReset = () => {
    setFullname("");
    setEmail("");
    setPassword("");
    setPhone("");
    setGender("");
    setPreview(null);
    setImageFile(null);
    const fileInput = document.getElementById(
      "profileImage"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // ✅ ฟังก์ชันหลักในการสมัครสมาชิก
  const handleSubmit = async () => {
    if (!fullname || !email || !password || !gender || !phone) {
      alertStyled("กรุณากรอกข้อมูลให้ครบถ้วน", false);
      return;
    }

    setLoading(true);
    try {
      // 🔎 ตรวจสอบว่ามีอีเมลนี้ในระบบหรือยัง
      const { data: existingUser, error: checkError } = await supabase
        .from("user_tb")
        .select("user_id")
        .eq("email", email)
        .maybeSingle();
      if (checkError) throw checkError;
      if (existingUser) {
        alertStyled("อีเมลนี้ถูกใช้ไปแล้ว", false);
        setLoading(false);
        return;
      }

      // 🔐 เข้ารหัสรหัสผ่านก่อนเก็บในฐานข้อมูล
      const hashedPassword = await bcrypt.hash(password, 10);

      let imageUrl = null;
      // 🧩 ถ้ามีอัปโหลดรูป จะอัปโหลดไปยัง bucket user_bk
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("user_bk")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        // 🌐 ดึงลิงก์แบบ public ของรูป
        const { data: publicUrl } = supabase.storage
          .from("user_bk")
          .getPublicUrl(fileName);
        imageUrl = publicUrl.publicUrl;
      }

      // 🧾 บันทึกข้อมูลลงตาราง user_tb
      const { error: insertError } = await supabase.from("user_tb").insert([
        {
          fullname,
          email,
          phone_num: phone,
          password: hashedPassword,
          gender,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        },
      ]);
      if (insertError) throw insertError;

      // สมัครสำเร็จ
      alertStyled("สมัครสมาชิกสำเร็จ!", true, () => {
        window.location.href = "/signin";
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alertStyled(`เกิดข้อผิดพลาด: ${error.message}`, false);
      } else {
        alertStyled("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ", false);
      }
    }
  };

  // 🪧 ฟังก์ชันแสดงข้อความแจ้งเตือน
  const alertStyled = (
    message: string,
    success: boolean,
    callback?: () => void
  ) => {
    const bgColor = success ? "bg-blue-500" : "bg-red-500";
    const modal = document.createElement("div");
    modal.className = `fixed inset-0 flex items-center justify-center bg-black/60 z-50`;
    modal.innerHTML = `
      <div class='rounded-xl p-6 ${bgColor} text-white shadow-xl text-center w-80'>
        <p class='mb-4 text-lg font-semibold'>${message}</p>
        <button class='mt-2 rounded-full bg-white/20 px-6 py-2 text-white hover:bg-white/30 transition'>OK</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("button")?.addEventListener("click", () => {
      modal.remove();
      if (callback) callback();
    });
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
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-blue-500 transition"
            >
              {showPassword ? (
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
                  value="Male"
                  checked={gender === "Male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="text-blue-500"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="gender_female"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="text-blue-500"
                />
                <span>Female</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="gender_other"
                  value="Other"
                  checked={gender === "Other"}
                  onChange={(e) => setGender(e.target.value)}
                  className="text-blue-500"
                />
                <span>Other</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            id="signup_button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mr-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
          <button
            id="reset_button"
            onClick={handleReset}
            disabled={loading}
            className="w-full ml-2 bg-orange-600 text-white py-2 rounded-lg font-medium hover:bg-orange-700 transition"
          >
            Reset
          </button>
        </div>

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
