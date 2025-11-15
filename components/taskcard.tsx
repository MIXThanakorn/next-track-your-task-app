"use client";

import React from "react";
import {
  FaLaptop,
  FaFileAlt,
  FaPenFancy,
  FaTasks,
  FaCheck,
  FaTrash,
  FaPlay,
  FaEdit,
} from "react-icons/fa";
import { TaskItem } from "@/types/task";

// กำหนดชุดไอคอนให้เลือกแบบ deterministic
const icons = [FaLaptop, FaFileAlt, FaPenFancy, FaTasks];

// ฟังก์ชันสร้าง hash ที่เสถียรจาก task_id
function getDeterministicIcon(id: string) {
  const hash = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return icons[hash % icons.length];
}

interface TaskCardProps {
  task: TaskItem;
  onStart: (id: string) => void;
  onDone: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStart,
  onDone,
  onDelete,
  onEdit,
}) => {
  // สีของ priority
  const priorityColor = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-red-600",
  }[task.priority];

  // สีของ status
  const statusColor = {
    todo: "text-gray-500",
    in_progress: "text-yellow-600",
    done: "text-green-600",
    over_due: "text-red-600",
  }[task.status];

  // สีของแถบด้านล่าง
  const barColor = {
    todo: "bg-gray-400",
    in_progress: "bg-yellow-500",
    done: "bg-green-500",
    over_due: "bg-red-500",
  }[task.status];

  return (
    <div className="relative flex flex-col bg-white p-5 rounded-xl shadow-md border hover:scale-[1.02] transition-transform duration-200">
      {/* Icon */}
      <div className="flex justify-center mb-3">
        {React.createElement(getDeterministicIcon(task.task_id), {
          size: 40,
          className: "text-blue-600",
        })}
      </div>

      {/* Header */}
      <h2 className="text-lg font-bold text-blue-800 text-center">
        {task.task_name}
      </h2>

      {/* Priority */}
      <p className={`text-sm font-semibold text-center ${priorityColor}`}>
        {task.priority.toUpperCase()}
      </p>

      {/* Detail */}
      <p className="text-gray-600 text-center text-sm mt-1">
        {task.task_detail}
      </p>

      {/* Status */}
      <p className={`text-sm mt-2 text-center font-medium ${statusColor}`}>
        {task.status.replace("_", " ").toUpperCase()}
      </p>

      {/* Due Date */}
      <p className="text-sm text-center text-blue-700 mt-2">
        start : {task.start_date}
      </p>

      {/* Due Date */}
      <p className="text-sm text-center text-blue-700 mt-2">
        Due : {task.due_date}
      </p>

      {/* แถบสีสถานะ */}
      <div className={`w-full h-2 rounded-full mt-3 ${barColor}`} />

      {/* ปุ่มต่างๆ */}
      <div className="flex justify-between items-center mt-4">
        {/* TODO status */}
        {task.status === "todo" && (
          <>
            <button
              onClick={() => onStart(task.task_id)}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaPlay />
            </button>

            <button
              onClick={() => onEdit(task.task_id)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => onDelete(task.task_id)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </>
        )}

        {/* In progress */}
        {task.status === "in_progress" && (
          <>
            <button
              onClick={() => onDone(task.task_id)}
              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <FaCheck />
            </button>

            <button
              onClick={() => onEdit(task.task_id)}
              className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => onDelete(task.task_id)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </>
        )}

        {/* Done */}
        {task.status === "done" && (
          <>
            <p className="text-gray-500 text-sm">
              Finished:{" "}
              {task.finished_date
                ? new Date(task.finished_date).toISOString().split("T")[0]
                : "-"}
            </p>

            <button
              onClick={() => onDelete(task.task_id)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </>
        )}

        {/* Over due */}
        {task.status === "over_due" && (
          <div className="w-full flex justify-end">
            <button
              onClick={() => onDelete(task.task_id)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
