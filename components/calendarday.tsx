"use client";

import { useState } from "react";
import TaskPopup from "./taskpopup";
import { TaskItem } from "@/types/task";
import { FaExclamationTriangle } from "react-icons/fa";

interface Props {
  day: number;
  tasks: TaskItem[];
  dateStr: string;
}

export default function CalendarDay({ day, tasks, dateStr }: Props) {
  const [open, setOpen] = useState(false);

  const hasTask = tasks.length > 0;

  // ตรวจสอบสถานะรวมของงานทั้งหมด
  const allOverdue = hasTask && tasks.every((t) => t.status === "overdue");
  const allDone = hasTask && tasks.every((t) => t.status === "done");

  // เลือกสีพื้นหลัง + สีกรอบตามประเภท
  let wrapperClass = "";
  if (allOverdue) {
    wrapperClass = "bg-red-100 border-red-500 hover:bg-red-200";
  } else if (allDone) {
    wrapperClass = "bg-green-100 border-green-500 hover:bg-green-200";
  } else if (hasTask) {
    wrapperClass = "bg-blue-100 border-blue-400 hover:bg-blue-200";
  } else {
    wrapperClass = "bg-gray-50 border-gray-200";
  }

  return (
    <>
      <div
        onClick={() => hasTask && setOpen(true)}
        className={`h-20 md:h-28 p-1.5 md:p-2 rounded-lg cursor-pointer transition border flex flex-col ${wrapperClass}`}
      >
        {/* วันที่ + ไอคอน */}
        <div className="flex items-center gap-1">
          <p
            className={`font-semibold text-sm md:text-base ${
              allOverdue
                ? "text-red-700"
                : allDone
                ? "text-green-700"
                : hasTask
                ? "text-blue-700"
                : "text-gray-700"
            }`}
          >
            {day}
          </p>

          {/* ไอคอนตกใจเฉพาะกรณี overdue */}
          {allOverdue && (
            <FaExclamationTriangle className="text-red-600 text-xs md:text-sm" />
          )}
        </div>

        {/* จำนวนงาน */}
        <div className="mt-auto">
          {hasTask ? (
            <p
              className={`text-[10px] md:text-xs ${
                allOverdue
                  ? "text-red-700"
                  : allDone
                  ? "text-green-700"
                  : "text-blue-700"
              }`}
            >
              {tasks.length} งาน
            </p>
          ) : (
            <p className="text-[10px] md:text-xs text-gray-400">ไม่มีงาน</p>
          )}
        </div>
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
