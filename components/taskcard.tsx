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

const icons = [FaLaptop, FaFileAlt, FaPenFancy, FaTasks];

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
  const priorityColor = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-red-600",
  }[task.priority];

  const statusColor = {
    todo: "text-gray-800",
    in_progress: "text-yellow-600",
    done: "text-green-600",
    overdue: "text-red-600",
  }[task.status];

  const barColor = {
    todo: "bg-gray-600",
    in_progress: "bg-yellow-500",
    done: "bg-green-500",
    overdue: "bg-red-500",
  }[task.status];

  return (
    <div className="relative flex flex-col bg-white p-5 rounded-xl shadow-md border hover:scale-[1.02] transition-transform duration-200 min-h-[300px]">
      {/* ทำ layout ภายในให้คงขนาด */}
      <div className="flex flex-col justify-between h-full">
        {/* TOP SECTION */}
        <div>
          <div className="flex justify-center mb-3">
            {React.createElement(getDeterministicIcon(task.task_id), {
              size: 40,
              className: "text-blue-600",
            })}
          </div>

          <h2 className="text-lg font-bold text-blue-800 text-center">
            {task.task_name}
          </h2>

          <p className={`text-sm font-semibold text-center ${priorityColor}`}>
            {task.priority.toUpperCase()}
          </p>

          {/* LIMIT DETAIL TEXT (ขึ้น ... ถ้ายาวเกิน) */}
          <p className="text-gray-600 text-center text-sm mt-1 line-clamp-2 overflow-hidden text-ellipsis">
            {task.task_detail}
          </p>

          <p className={`text-sm mt-2 text-center font-medium ${statusColor}`}>
            {task.status.replace("_", " ").toUpperCase()}
          </p>

          {task.start_date && (
            <p className="text-sm text-center text-blue-700 mt-2">
              Start : {task.start_date}
            </p>
          )}

          <p className="text-sm text-center text-blue-700 mt-2">
            Due : {task.due_date}
          </p>

          <div className={`w-full h-2 rounded-full mt-3 ${barColor}`} />
        </div>

        {/* BUTTONS SECTION — อยู่ล่างสุดเสมอ */}
        <div className="flex justify-between items-center mt-4">
          {task.status === "todo" && (
            <>
              <button
                onClick={() => onStart(task.task_id)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                title="Start Work"
              >
                <FaPlay />
              </button>

              <button
                onClick={() => onEdit(task.task_id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                title="Edit Work"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => onDelete(task.task_id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                title="Dissmiss"
              >
                <FaTrash />
              </button>
            </>
          )}

          {task.status === "in_progress" && (
            <>
              <button
                onClick={() => onDone(task.task_id)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                title="Mark as Done"
              >
                <FaCheck />
              </button>

              <button
                onClick={() => onEdit(task.task_id)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                title="Edit Work"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => onDelete(task.task_id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                title="Dissmiss"
              >
                <FaTrash />
              </button>
            </>
          )}

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
                title="Dissmiss"
              >
                <FaTrash />
              </button>
            </>
          )}

          {task.status === "overdue" && (
            <div className="w-full flex justify-end">
              <button
                onClick={() => onDelete(task.task_id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                title="Dissmiss"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
