"use client";

import { useState } from "react";
import TaskPopup from "./taskpopup";
import { TaskItem } from "@/types/task";

interface Props {
  day: number;
  tasks: TaskItem[];
  dateStr: string;
}

export default function CalendarDay({ day, tasks, dateStr }: Props) {
  const [open, setOpen] = useState(false);

  const hasTask = tasks.length > 0;

  return (
    <>
      <div
        onClick={() => hasTask && setOpen(true)}
        className={`h-20 md:h-28 p-1.5 md:p-2 rounded-lg cursor-pointer transition border flex flex-col
        ${
          hasTask
            ? "bg-blue-100 border-blue-400 hover:bg-blue-200"
            : "bg-gray-50 border-gray-200"
        }
        `}
      >
        {/* วันที่ */}
        <p
          className={`font-semibold text-sm md:text-base ${
            hasTask ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {day}
        </p>

        {/* จำนวนงาน */}
        {hasTask ? (
          <div className="mt-auto">
            <p className="text-[10px] md:text-xs text-blue-700">
              {tasks.length} งาน
            </p>
          </div>
        ) : (
          <div className="mt-auto">
            <p className="text-[10px] md:text-xs text-gray-400">ไม่มีงาน</p>
          </div>
        )}
      </div>

      {open && (
        <TaskPopup
          tasks={tasks}
          dateStr={dateStr}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
