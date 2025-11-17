"use client";

import React from "react";
import { TaskNotification } from "@/types/notification";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";

interface Props {
  notifications: TaskNotification[];
  onClose: () => void;
  setNotifications: React.Dispatch<React.SetStateAction<TaskNotification[]>>;
}

export default function NotificationList({
  notifications,
  onClose,
  setNotifications,
}: Props) {
  const handleMarkAsRead = async (task_id: string) => {
    await supabase
      .from("task_tb")
      .update({ notification_status: false })
      .eq("task_id", task_id);

    // ❗ ลบออกจาก state เพื่อหายจาก UI ทันที
    setNotifications((prev) => prev.filter((n) => n.task_id !== task_id));
  };

  return (
    <div className="absolute top-14 right-0 w-80 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden animate-slideDown z-50">
      <div className="p-4 border-b border-gray-200 font-semibold text-blue-700">
        Notification
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-gray-500 text-sm">ไม่มีการแจ้งเตือน</div>
        ) : (
          notifications.map((n) => {
            // สี priority
            let priorityColor = "";
            switch (n.priority) {
              case "high":
                priorityColor = "bg-red-500";
                break;
              case "medium":
                priorityColor = "bg-yellow-400";
                break;
              case "low":
                priorityColor = "bg-green-500";
                break;
            }

            // สี status bar
            let statusColor = "";
            switch (n.status) {
              case "todo":
                statusColor = "bg-blue-400";
                break;
              case "in_progress":
                statusColor = "bg-yellow-400";
                break;
              case "overdue":
                statusColor = "bg-red-600";
                break;
            }

            return (
              <div
                key={n.task_id}
                className="flex flex-col p-3 border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-2 h-6 ${statusColor} mr-2 rounded`} />
                  <div className="flex-1 text-sm font-semibold text-gray-700">
                    {n.task_name}{" "}
                    {n.status === "overdue" && (
                      <span className="text-red-600">เลยกำหนด</span>
                    )}
                  </div>
                  <div
                    className={`ml-2 px-2 py-0.5 rounded text-white text-xs ${priorityColor}`}
                  >
                    {n.priority}
                  </div>
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  Due: {format(new Date(n.due_date), "dd/MM/yyyy")}
                </div>

                {/* ✅ ปุ่ม Mark as Read */}
                <button
                  onClick={() => handleMarkAsRead(n.task_id)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline self-end"
                >
                  Mark as read
                </button>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full text-center py-2 text-sm text-blue-600 hover:bg-blue-50 transition"
      >
        Close
      </button>
    </div>
  );
}
