"use client";

import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import NotificationList from "./notificationlist";
import { supabase } from "@/lib/supabaseClient";
import { TaskNotification } from "@/types/notification";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("user_id"); // ดึง user_id ของผู้ใช้งานปัจจุบัน
      if (!userId) return;

      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .eq("notification_status", true)
        .eq("user_id", userId);

      if (error) {
        console.error(error);
        return;
      }

      if (data) setNotifications(data);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition"
      >
        <FaBell />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <NotificationList
          notifications={notifications}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
