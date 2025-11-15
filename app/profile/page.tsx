"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// กำหนด Types
interface User {
  user_id: string;
  fullname: string;
  username: string;
  email: string;
  phone_num: string;
  gender: string;
  image_url: string;
  update_at?: Date;
}

interface Task {
  task_id: string;
  user_id: string;
  status: "todo" | "in_progress" | "done" | "overdue";
  title: string;
  description?: string;
  due_date?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  useEffect(() => {
    if (userId) {
      fetchUser();
      fetchTasks();
    }
  }, [userId]);

  const fetchUser = async () => {
    const { data, error } = await supabase
      .from("user_tb")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (!error && data) setUser(data as User);
    setLoading(false);
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("task_tb")
      .select("*")
      .eq("user_id", userId);
    if (!error && data) setTasks(data as Task[]);
  };

  // --- สถิติ ---
  const totalTasks = tasks.length || 0;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const inprogressCount = tasks.filter(
    (t) => t.status === "in_progress"
  ).length;
  const doneCount = tasks.filter((t) => t.status === "done").length;
  const overdueCount = tasks.filter((t) => t.status === "overdue").length;

  // --- แก้ไขโปรไฟล์ ---
  const handleEdit = () => setEditing(true);

  const handleConfirm = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let imageUrl = user.image_url;

      // ถ้ามีการอัปโหลดรูปใหม่
      if (uploadFile) {
        // ลบรูปเก่า
        if (imageUrl) {
          const fileName = imageUrl.split("/").pop();
          if (fileName) {
            await supabase.storage.from("user_bk").remove([fileName]);
          }
        }

        // อัปโหลดใหม่
        const fileExt = uploadFile.name.split(".").pop();
        const newFileName = `${Date.now()}_${user.username}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("user_bk")
          .upload(newFileName, uploadFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("user_bk")
          .getPublicUrl(newFileName);
        imageUrl = publicUrlData.publicUrl;
      }

      // อัปเดตข้อมูล user_tb
      const { error: updateError } = await supabase
        .from("user_tb")
        .update({
          fullname: user.fullname,
          phone_num: user.phone_num,
          gender: user.gender,
          username: user.username,
          image_url: imageUrl,
          update_at: new Date(),
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      setEditing(false);
      setPreview(null);
      setUploadFile(null);
      fetchUser();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        ไม่พบข้อมูลผู้ใช้
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6 space-y-6 border border-blue-100">
        <h1 className="text-2xl font-semibold text-blue-600 text-center">
          My Profile
        </h1>

        {/* รูปโปรไฟล์ */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Image
              src={preview || user.image_url || "/default_profile.png"}
              alt="profile"
              width={120}
              height={120}
              className="rounded-full object-cover border-4 border-blue-300 shadow-md"
            />
            {editing && (
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* ข้อมูลโปรไฟล์ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Fullname", key: "fullname" as keyof User },
            { label: "Username", key: "username" as keyof User },
            { label: "Email", key: "email" as keyof User },
            { label: "Phone", key: "phone_num" as keyof User },
            { label: "Gender", key: "gender" as keyof User, type: "select" },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm text-gray-600">{field.label}</label>
              {editing ? (
                field.type === "select" ? (
                  <select
                    value={String(user[field.key] || "")}
                    onChange={(e) =>
                      setUser({ ...user, [field.key]: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={String(user[field.key] || "")}
                    onChange={(e) =>
                      setUser({ ...user, [field.key]: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg mt-1 focus:ring-2 focus:ring-blue-400"
                  />
                )
              ) : (
                <p className="mt-1 font-medium text-gray-800">
                  {String(user[field.key] || "-")}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* สถิติ */}
        {!editing && (
          <div className="bg-blue-50 rounded-xl p-4 text-center space-y-3 mt-4">
            {totalTasks === 0 ? (
              <p className="text-gray-500">กรุณาบันทึกข้อมูลงานที่ต้องทำ</p>
            ) : (
              <div className="space-y-4">
                {/* ทั้งหมด */}
                <div className="flex justify-center">
                  <div className="text-center">
                    <p className="text-blue-600 font-semibold">ทั้งหมด</p>
                    <p>{totalTasks || "-"}</p>
                  </div>
                </div>

                {/*ค้างอยู่ / กำลังทำ */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-gray-600 font-semibold">ค้างอยู่</p>
                    <p>{todoCount || "-"}</p>
                  </div>

                  <div>
                    <p className="text-yellow-600 font-semibold">กำลังทำ</p>
                    <p>{inprogressCount || "-"}</p>
                  </div>
                </div>

                {/* เสร็จแล้ว / เลยกำหนด */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-green-600 font-semibold">เสร็จแล้ว</p>
                    <p>{doneCount || "-"}</p>
                  </div>

                  <div>
                    <p className="text-red-600 font-semibold">เลยกำหนด</p>
                    <p>{overdueCount || "-"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ปุ่ม Edit / Cancel + Logout */}
        <div className="flex items-center justify-center gap-4">
          {editing ? (
            <>
              {/* ปุ่ม Confirm */}
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Confirm Edit
              </button>

              {/* ปุ่ม Cancel */}
              <button
                onClick={() => {
                  setEditing(false);
                  setPreview(null);
                  setUploadFile(null);
                  fetchUser(); // โหลดข้อมูลเดิมกลับมาเพื่อยกเลิกการแก้ไข
                }}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              {/* ปุ่ม Edit */}
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>

              {/* ปุ่ม Logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("user_id");
                  window.location.href = "/signin";
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
              >
                Log Out
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-4">
          <Link
            href="/dashboard"
            className="text-sm text-blue-500 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
        <div>
          <hr className="border-gray-200" />
        </div>
        <div>
          <p className="text-xs text-gray-400 text-center">
            Last Updated:{" "}
            {user.update_at
              ? new Date(user.update_at).toLocaleString()
              : "Never"}
          </p>
        </div>
      </div>
    </div>
  );
}
