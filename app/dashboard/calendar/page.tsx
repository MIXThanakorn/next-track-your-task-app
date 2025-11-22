"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TaskItem } from "@/types/task";
import CalendarGrid from "@/components/calendargrid";

export default function CalendarPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  // โหลดข้อมูลจาก Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      if (!userId) return;

      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      );

      const { data } = await supabase
        .from("task_tb")
        .select("*")
        .eq("user_id", userId)
        .gte("due_date", startOfMonth.toISOString())
        .lte("due_date", endOfMonth.toISOString());

      if (data) setTasks(data as TaskItem[]);
    };

    fetchTasks();
  }, [currentMonth, userId]);

  const goPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 p-3 md:p-6 flex flex-col items-center">
      {/* header month */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-4 md:mb-6">
        <button
          onClick={goPrevMonth}
          className="w-10 h-10 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-lg md:text-base"
        >
          &lt;
        </button>

        <h2 className="text-lg md:text-2xl font-semibold text-blue-700 text-center">
          {currentMonth.toLocaleString("th-TH", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={goNextMonth}
          className="w-10 h-10 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center text-lg md:text-base"
        >
          &gt;
        </button>
      </div>

      <div className="w-full max-w-4xl flex justify-end mb-3 md:mb-4">
        <button
          onClick={() => (window.location.href = "/addtask")}
          className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          + Add Task
        </button>
      </div>

      {/* calendar grid */}
      <CalendarGrid tasks={tasks} currentMonth={currentMonth} />
    </div>
  );
}
