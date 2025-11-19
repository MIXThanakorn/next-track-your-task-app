"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { TaskItem } from "@/types/task";

export default function EditTaskPage() {
  const router = useRouter();

  const [task, setTask] = useState<TaskItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // state สำหรับแก้ไข
  const [taskName, setTaskName] = useState("");
  const [taskDetail, setTaskDetail] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");

  // โหลดข้อมูล task จาก task_id ใน localStorage
  useEffect(() => {
    const id = localStorage.getItem("task_id");
    if (!id) return;

    const fetchTask = async () => {
      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .eq("task_id", id)
        .single();

      if (!error && data) {
        setTask(data as TaskItem);
        setTaskName(data.task_name);
        setTaskDetail(data.task_detail || "");
        setPriority(data.priority);
        setDueDate(data.due_date || "");
      }
      setLoading(false);
    };

    fetchTask();
  }, []);

  // alert แบบ custom
  const alertStyled = (message: string, success: boolean) => {
    const bg = success ? "bg-blue-500" : "bg-red-500";
    const box = document.createElement("div");
    box.className =
      "fixed inset-0 bg-black/60 flex items-center justify-center z-50";
    box.innerHTML = `
      <div class="${bg} text-white p-6 rounded-xl w-72 text-center">
        <p class="font-semibold mb-4">${message}</p>
        <button class="px-5 py-2 bg-white/20 rounded-lg hover:bg-white/30">OK</button>
      </div>
    `;
    document.body.appendChild(box);
    box.querySelector("button")?.addEventListener("click", () => box.remove());
  };

  // อัปเดตข้อมูล
  const handleUpdate = async () => {
    const id = localStorage.getItem("task_id");
    if (!id) return;

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("task_tb")
      .update({
        task_name: taskName,
        task_detail: taskDetail,
        priority,
        due_date: dueDate,
        update_at: now,
      })
      .eq("task_id", id);

    if (error) {
      alertStyled("อัปเดตไม่สำเร็จ", false);
      return;
    }

    alertStyled("อัปเดตสำเร็จ", true);
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600">
        Loading...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        ไม่พบข้อมูล Task
      </div>
    );
  }

  // แปลงสถานะสำหรับโชว์
  const statusShow =
    task.status === "todo"
      ? "To Do"
      : task.status === "in_progress"
      ? "In Progress"
      : task.status === "done"
      ? "Done"
      : "Over Due";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 border border-blue-100 space-y-6">
        <h1 className="text-center text-2xl font-semibold text-blue-600">
          Task Detail
        </h1>

        {/* Fields */}
        <div className="space-y-4">
          {/* Task Name */}
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Task Name
            </label>
            {editMode ? (
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="mt-1 w-full p-3 border rounded-lg"
              />
            ) : (
              <p className="mt-1 text-gray-600">{task.task_name}</p>
            )}
          </div>

          {/* Task Detail */}
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Task Detail
            </label>
            {editMode ? (
              <textarea
                rows={3}
                value={taskDetail}
                onChange={(e) => setTaskDetail(e.target.value)}
                className="mt-1 w-full p-3 border rounded-lg"
              />
            ) : (
              <p className="mt-1 text-gray-600">{task.task_detail || "-"}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Priority
            </label>
            {editMode ? (
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 w-full p-3 border rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            ) : (
              <p className="mt-1 text-gray-600 capitalize">{task.priority}</p>
            )}
          </div>

          {/* Status */}
          {!editMode && (
            <div>
              <label className="text-gray-700 font-medium text-sm">
                Status
              </label>
              <p className="mt-1 text-gray-600">{statusShow}</p>
            </div>
          )}

          {/* Start Date */}
          {!editMode && (
            <div>
              <label className="text-gray-700 font-medium text-sm">
                Start Date
              </label>
              <p className="mt-1 text-gray-600">
                {task.start_date || "คุณยังไม่เริ่มทำ"}
              </p>
            </div>
          )}

          {/* Finished Date */}
          {!editMode && (
            <div>
              <label className="text-gray-700 font-medium text-sm">
                Finished Date
              </label>
              <p className="mt-1 text-gray-600">
                {task.finished_date || "คุณยังทำไม่เสร็จ"}
              </p>
            </div>
          )}

          {/* Due Date */}
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Due Date
            </label>
            {editMode ? (
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 w-full p-3 border rounded-lg"
              />
            ) : (
              <p className="mt-1 text-gray-600">{task.due_date}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          {editMode ? (
            <>
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Update
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
              >
                Edit
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
