"use client";

import { TaskItem } from "@/types/task";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  tasks: TaskItem[];
  dateStr: string;
  onClose: () => void;
}

const priorityColor: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export default function TaskPopup({ tasks, dateStr, onClose }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const sorted = [...tasks].sort((a, b) => {
    const order = { high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });

  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999] p-4">
      <div
        className={`
          bg-white rounded-xl w-full max-w-lg shadow-xl transform transition-all duration-300 
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
        `}
        style={{ height: "70vh" }}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-blue-700">
            งานประจำวันที่ {dateStr}
          </h2>
          <button
            onClick={() => {
              setShow(false);
              setTimeout(onClose, 250);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            ✕
          </button>
        </div>

        <div
          className="overflow-y-auto p-5 space-y-4"
          style={{ height: "calc(70vh - 70px)" }}
        >
          {sorted.map((t) => (
            <div
              key={t.task_id}
              className="p-4 border rounded-lg shadow-sm bg-blue-50 hover:shadow transition"
            >
              <div className="flex justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <span
                    className={`w-2 h-6 rounded-full ${
                      priorityColor[t.priority]
                    }`}
                  ></span>
                  {t.task_name}
                </h3>

                <span className="text-sm text-gray-600">
                  {t.status === "todo"
                    ? "To Do"
                    : t.status === "in_progress"
                    ? "In Progress"
                    : t.status === "done"
                    ? "Done"
                    : "Over Due"}
                </span>
              </div>

              <p className="text-gray-600 mt-2">{t.task_detail}</p>

              {/* ซ่อนปุ่มแก้ไข ถ้า status = done หรือ overdue */}
              {t.status !== "done" && t.status !== "overdue" && (
                <div className="mt-3 flex justify-end">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                    onClick={() => {
                      localStorage.setItem("task_id", t.task_id);
                      router.push("/edittask");
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
