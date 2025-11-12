"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface UserProfile {
  username: string;
  image_url?: string | null;
}

export default function DashboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("user_tb")
        .select("username, image_url")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setUser(data);
      }
    };

    fetchProfile();
  }, []);

  const handleClickProfile = () => {
    router.push("/profile");
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* ✅ Logo & Title */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 relative">
            <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-xl font-semibold text-blue-700">
            Track Your Task
          </span>
        </div>

        {/* ✅ Username + Profile */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div
              onClick={handleClickProfile}
              className="flex items-center cursor-pointer hover:opacity-80 transition"
            >
              {/* ชื่อผู้ใช้ */}
              <span className="hidden sm:inline text-blue-700 font-medium mr-2">
                {user.username}
              </span>

              {/* รูปโปรไฟล์ */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white font-bold border-2 border-blue-400 flex items-center justify-center">
                {user.image_url ? (
                  <Image
                    src={user.image_url}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <span className="text-lg">
                    {user.username[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          )}
        </div>
      </div>
    </header>
  );
}
