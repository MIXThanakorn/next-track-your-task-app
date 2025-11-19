"use client";

import { JSX } from "react";
import CalendarDay from "./calendarday";
import { TaskItem } from "@/types/task";

interface Props {
  currentMonth: Date;
  tasks: TaskItem[];
}

export default function CalendarGrid({ currentMonth, tasks }: Props) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: JSX.Element[] = [];

  // เติมช่องว่างก่อนวันที่ 1
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`blank-${i}`} className="h-28"></div>);
  }

  // เติมวันที่
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().split("T")[0];

    const dayTasks = tasks.filter((t) => t.due_date === dateStr);

    days.push(
      <CalendarDay key={d} day={d} tasks={dayTasks} dateStr={dateStr} />
    );
  }

  return (
    <div className="w-full max-w-4xl grid grid-cols-7 gap-2 bg-white p-4 rounded-xl shadow-md">
      {days}
    </div>
  );
}
