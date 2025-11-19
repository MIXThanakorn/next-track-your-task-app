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
        className={`h-28 p-2 rounded-lg cursor-pointer transition border
        ${
          hasTask
            ? "bg-blue-100 border-blue-400 hover:bg-blue-200"
            : "bg-gray-50"
        }
        `}
      >
        <p
          className={`font-semibold ${
            hasTask ? "text-blue-700" : "text-gray-700"
          }`}
        >
          {day}
        </p>

        {hasTask ? (
          <p className="text-xs text-blue-700 mt-1">{tasks.length} งาน</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">ไม่มีงาน</p>
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
