"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddTaskPage() {
  const router = useRouter();

  const [taskName, setTaskName] = useState("");
  const [taskDetail, setTaskDetail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("low");
  const [loading, setLoading] = useState(false);

  // รีเซ็ตฟอร์ม
  const handleReset = () => {
    setTaskName("");
    setTaskDetail("");
    setDueDate("");
    setPriority("low");
  };

  // บันทึก Task
  const handleSubmit = async () => {
    if (!taskName || !dueDate) {
      alertStyled("กรุณากรอกชื่องานและวันครบกำหนด", false);
      return;
    }

    // ตรวจสอบ due date ห้ามเป็นวันอดีต
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDue = new Date(dueDate);
    selectedDue.setHours(0, 0, 0, 0);

    if (selectedDue < today) {
      alertStyled("วันกำหนดส่งต้องไม่เป็นวันก่อนหน้า", false);
      return;
    }

    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
      alertStyled("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่", false);
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();

      const { error: insertError } = await supabase.from("task_tb").insert([
        {
          task_name: taskName,
          task_detail: taskDetail,
          due_date: dueDate,
          priority: priority,
          status: "todo",
          user_id: user_id,
          created_at: now,
          update_at: now,
          notification_status: false,
          notified: false,
        },
      ]);

      if (insertError) throw insertError;

      alertStyled("เพิ่มงานสำเร็จ!", true, () => {
        handleReset();
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        alertStyled(`เกิดข้อผิดพลาด: ${error.message}`, false);
      } else {
        alertStyled("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ", false);
      }
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันแสดงข้อความแจ้งเตือน
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 space-y-6 border border-blue-100">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
          >
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
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-center text-blue-600">
          Add New Task
        </h1>
        <p className="text-center text-gray-500 text-sm">
          Create a new task and track your progress
        </p>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <label
              htmlFor="task_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              id="task_name"
              type="text"
              placeholder="Enter task name"
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-3"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          {/* Task Detail */}
          <div>
            <label
              htmlFor="task_detail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Detail
            </label>
            <textarea
              id="task_detail"
              placeholder="Enter task description (optional)"
              rows={4}
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-3 resize-none"
              value={taskDetail}
              onChange={(e) => setTaskDetail(e.target.value)}
            />
          </div>

          {/* Due Date with Calendar Icon */}
          <div>
            <label
              htmlFor="due_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="due_date"
                type="date"
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-3 pr-10"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-3"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Task"}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex-1 bg-orange-400 text-white py-3 rounded-lg font-medium hover:bg-orange-500 transition disabled:bg-orange-300 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>

        {/* Info Text */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Fields marked with <span className="text-red-500">*</span> are
          required
        </p>
      </div>
    </div>
  );
}
