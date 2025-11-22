"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/notificationbell";

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
    <header className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center space-x-2">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10">
            <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
          </div>

          <span className="text-lg sm:text-2xl font-bold text-blue-700">
            Track Your Task
          </span>
        </div>

        {/* RIGHT */}
        <div className="flex items-center space-x-3">
          <NotificationBell />
          {user && (
            <div
              onClick={handleClickProfile}
              className="flex items-center cursor-pointer hover:opacity-80 transition"
            >
              <span className="hidden md:inline text-blue-700 text-sm font-semibold mr-2">
                {user.username}
              </span>
              <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 text-white font-bold border-2 border-blue-400 flex items-center justify-center">
                {user.image_url ? (
                  <Image
                    src={user.image_url}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <span className="text-sm">
                    {user.username[0].toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
