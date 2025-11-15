"use client";

import { useEffect, useState, useMemo } from "react";
import TaskCard from "@/components/taskcard";
import { supabase } from "@/lib/supabaseClient";
import { TaskItem } from "@/types/task";
import { useRouter } from "next/navigation";
import { start } from "repl";

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const user_id =
    typeof window !== "undefined" ? localStorage.getItem("user_id") : null;

  // Fetch tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      if (!user_id) return;

      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .eq("user_id", user_id);

      if (!error && data) {
        setTasks(data as TaskItem[]);
      }
    };

    loadTasks();
  }, [user_id]);

  // Refresh function for handlers
  const refreshTasks = async () => {
    if (!user_id) return;

    const { data, error } = await supabase
      .from("task_tb")
      .select("*")
      .eq("user_id", user_id);

    if (!error && data) {
      setTasks(data as TaskItem[]);
    }
  };

  // Filtering + Searching + Sorting with useMemo
  const filtered = useMemo(() => {
    let result = [...tasks];

    // Filter status
    if (statusFilter) result = result.filter((t) => t.status === statusFilter);

    // Filter priority
    if (priorityFilter)
      result = result.filter((t) => t.priority === priorityFilter);

    // Search task name
    if (searchText.trim() !== "")
      result = result.filter((t) =>
        t.task_name.toLowerCase().includes(searchText.toLowerCase())
      );

    // Sort priority
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const statusOrder = { todo: 1, in_progress: 2, done: 3, over_due: 4 };

    result.sort((a, b) => {
      const p = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (p !== 0) return p;
      return statusOrder[a.status] - statusOrder[b.status];
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, searchText]);

  // --- ACTION Handlers ---
  const handleStart = async (id: string) => {
    const { error } = await supabase
      .from("task_tb")
      .update({
        status: "in_progress",
        update_at: new Date().toISOString(),
        start_date: new Date().toISOString(),
      })
      .eq("task_id", id);

    if (error) {
      console.error("Error updating task:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
      return;
    }

    await refreshTasks();
  };

  const handleDone = async (id: string) => {
    const { error } = await supabase
      .from("task_tb")
      .update({
        status: "done",
        finished_date: new Date().toISOString(),
        update_at: new Date().toISOString(),
      })
      .eq("task_id", id);

    if (error) {
      console.error("Error updating task:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดต");
      return;
    }

    await refreshTasks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบงานนี้หรือไม่?")) return;

    const { error } = await supabase.from("task_tb").delete().eq("task_id", id);

    if (error) {
      console.error("Error deleting task:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
      return;
    }

    await refreshTasks();
  };

  const handleEdit = (id: string) => {
    localStorage.setItem("edit_task_id", id);
    router.push("/edittask");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-md p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        {/* Filter status */}
        <select
          className="border rounded-lg px-3 py-2"
          onChange={(e) =>
            setStatusFilter(e.target.value === "none" ? null : e.target.value)
          }
        >
          <option value="none">Status (ทั้งหมด)</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="complete">Completed</option>
          <option value="over_due">Over Due</option>
        </select>

        {/* Filter priority */}
        <select
          className="border rounded-lg px-3 py-2"
          onChange={(e) =>
            setPriorityFilter(e.target.value === "none" ? null : e.target.value)
          }
        >
          <option value="none">Priority (ทั้งหมด)</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder="ค้นหา งาน..."
          className="border rounded-lg px-3 py-2 flex-1"
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* Add Task */}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-auto"
          onClick={() => router.push("/addtask")}
        >
          + Add Task
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((task) => (
          <TaskCard
            key={task.task_id}
            task={task}
            onStart={handleStart}
            onDone={handleDone}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}
