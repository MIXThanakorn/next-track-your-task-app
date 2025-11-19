"use client";

import { useEffect, useState, useMemo } from "react";
import TaskCard from "@/components/taskcard";
import Section from "@/components/section";
import { supabase } from "@/lib/supabaseClient";
import { TaskItem } from "@/types/task";
import { useRouter } from "next/navigation";

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

      const { data } = await supabase
        .from("task_tb")
        .select("*")
        .eq("user_id", user_id);

      if (data) setTasks(data as TaskItem[]);
    };

    loadTasks();
  }, [user_id]);

  // Refresh
  const refreshTasks = async () => {
    if (!user_id) return;

    const { data } = await supabase
      .from("task_tb")
      .select("*")
      .eq("user_id", user_id);

    if (data) setTasks(data as TaskItem[]);
  };

  // Filter + Sorting + Grouping
  const grouped = useMemo(() => {
    let result = [...tasks];

    if (statusFilter) result = result.filter((t) => t.status === statusFilter);
    if (priorityFilter)
      result = result.filter((t) => t.priority === priorityFilter);

    if (searchText.trim() !== "")
      result = result.filter((t) =>
        t.task_name.toLowerCase().includes(searchText.toLowerCase())
      );

    // Priority order
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const groups = {
      todo: [] as TaskItem[],
      in_progress: [] as TaskItem[],
      done: [] as TaskItem[],
      overdue: [] as TaskItem[],
    };

    result.forEach((t) => {
      groups[t.status]?.push(t);
    });

    // Sort each group
    Object.keys(groups).forEach((key) => {
      groups[key as keyof typeof groups].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    });

    return groups;
  }, [tasks, statusFilter, priorityFilter, searchText]);

  // No tasks at all
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-xl mb-4">กรุณาเพิ่มงานของคุณ</p>
        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          onClick={() => router.push("/addtask")}
        >
          + Add Task
        </button>
      </div>
    );
  }

  // ---- Actions ----
  const handleStart = async (id: string) => {
    await supabase
      .from("task_tb")
      .update({
        status: "in_progress",
        update_at: new Date().toISOString(),
        start_date: new Date().toISOString(),
      })
      .eq("task_id", id);

    refreshTasks();
  };

  const handleDone = async (id: string) => {
    await supabase
      .from("task_tb")
      .update({
        status: "done",
        update_at: new Date().toISOString(),
        finished_date: new Date().toISOString(),
      })
      .eq("task_id", id);

    refreshTasks();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบงานนี้หรือไม่?")) return;

    await supabase.from("task_tb").delete().eq("task_id", id);
    refreshTasks();
  };

  const handleEdit = (id: string) => {
    localStorage.setItem("task_id", id);
    router.push("/edittask");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white shadow-md p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        <select
          className="border rounded-lg px-3 py-2"
          onChange={(e) =>
            setStatusFilter(e.target.value === "none" ? null : e.target.value)
          }
        >
          <option value="none">Status (ทั้งหมด)</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
          <option value="over_due">Over Due</option>
        </select>

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

        <input
          type="text"
          placeholder="ค้นหา งาน..."
          className="border rounded-lg px-3 py-2 flex-1"
          onChange={(e) => setSearchText(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg ml-auto"
          onClick={() => router.push("/addtask")}
        >
          + Add Task
        </button>
      </div>

      {/* Sections */}
      {!statusFilter && (
        <>
          <Section
            title="งานที่ต้องทำ - To do"
            emptyText="คุณยังไม่มีงานที่ค้างอยู่"
            items={grouped.todo}
            onStart={handleStart}
            onDone={handleDone}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          <Section
            title="งานที่กำลังทำ - In Progress"
            emptyText="คุณยังไม่มีงานที่เริ่มทำ"
            items={grouped.in_progress}
            onStart={handleStart}
            onDone={handleDone}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          <Section
            title="งานที่เสร็จแล้ว - Done"
            emptyText="คุณยังไม่มีงานที่ทำเสร็จ"
            items={grouped.done}
            onStart={handleStart}
            onDone={handleDone}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />

          <Section
            title="งานที่เลยกำหนด - Over Due"
            emptyText="คุณยังไม่มีงานที่เลยกำหนด"
            items={grouped.overdue}
            onStart={handleStart}
            onDone={handleDone}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </>
      )}

      {statusFilter && (
        <>
          {statusFilter === "todo" && (
            <Section
              title="งานที่ต้องทำ - To do"
              emptyText="คุณยังไม่มีงานที่ค้างอยู่"
              items={grouped.todo}
              onStart={handleStart}
              onDone={handleDone}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}

          {statusFilter === "in_progress" && (
            <Section
              title="งานที่กำลังทำ - In Progress"
              emptyText="คุณยังไม่มีงานที่เริ่มทำ"
              items={grouped.in_progress}
              onStart={handleStart}
              onDone={handleDone}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}

          {statusFilter === "done" && (
            <Section
              title="งานที่เสร็จแล้ว - Done"
              emptyText="คุณยังไม่มีงานที่ทำเสร็จ"
              items={grouped.done}
              onStart={handleStart}
              onDone={handleDone}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}

          {statusFilter === "over_due" && (
            <Section
              title="งานที่เลยกำหนด - Over Due"
              emptyText="คุณยังไม่มีงานที่เลยกำหนด"
              items={grouped.overdue}
              onStart={handleStart}
              onDone={handleDone}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </>
      )}
    </div>
  );
}
