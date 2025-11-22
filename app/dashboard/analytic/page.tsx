"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TaskItem } from "@/types/task";

/* ----------------------------- Helpers ----------------------------- */

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};

const daysBetween = (a?: string | null, b?: string | null) => {
  if (!a || !b) return null;
  const da = new Date(a);
  const db = new Date(b);
  return (db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24);
};

const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

/* ----------------------------- Chart Components ----------------------------- */

function PriorityBarChart({
  data,
}: {
  data: Record<"high" | "medium" | "low", number>;
}) {
  if (!data) return null;

  const total = data.high + data.medium + data.low || 1;

  const color = {
    high: "bg-red-500",
    medium: "bg-yellow-400",
    low: "bg-green-500",
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-semibold mb-4">Tasks by Priority</h3>

      <div className="flex justify-between items-end h-[100px] gap-6">
        {(["high", "medium", "low"] as const).map((p) => {
          const count = data[p];
          const percent = ((count / total) * 100).toFixed(1);

          return (
            <div
              key={p}
              className="flex flex-col items-center flex-1 relative group"
            >
              {/* Percentage Text */}
              <span className="text-xs font-semibold mb-1">{percent}%</span>

              {/* Bar */}
              <div
                className={`w-full ${color[p]} rounded-md shadow-sm transition-all duration-300`}
                style={{
                  height: percent === "0.0" ? "14px" : `${percent}%`,
                  minHeight: "14px",
                }}
              ></div>

              {/* Label */}
              <span className="text-xs mt-2 capitalize">{p}</span>

              {/* Tooltip */}
              <div
                className="
                absolute -top-10 
                opacity-0 group-hover:opacity-100 
                transition 
                bg-black text-white text-xs px-2 py-1 rounded-md 
                pointer-events-none shadow-lg
              "
              >
                {count} tasks
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutChart({
  started,
  notStarted,
}: {
  started: number;
  notStarted: number;
}) {
  const total = Math.max(1, started + notStarted);
  const size = 160;
  const stroke = 18;
  const r = size / 2;
  const circumference = 2 * Math.PI * (r - stroke / 2);
  const pct = (started / total) * 100;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
      <h3 className="text-sm font-semibold mb-3">Started vs Not Started</h3>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={r}
          cy={r}
          r={r - stroke / 2}
          stroke="#e6eefc"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={r}
          cy={r}
          r={r - stroke / 2}
          stroke="#1d4ed8"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <div className="mt-2 text-sm font-semibold">
        {Math.round(pct)}% Started
      </div>
    </div>
  );
}

/* ----------------------------- Main Page ----------------------------- */

export default function DashboardPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .eq("user_id", user_id);

      if (!error && data) setTasks(data as TaskItem[]);
      setLoading(false);
    };

    load();
  }, []);

  /* ----------------------------- Derived Data ----------------------------- */

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "done").length;
    return { total, done, notDone: total - done };
  }, [tasks]);

  const upcoming = useMemo(() => {
    const now = new Date();
    const three = 3 * 24 * 3600 * 1000;

    return tasks.filter((t) => {
      if (!t.due_date) return false;
      const due = new Date(t.due_date);
      const diff = due.getTime() - now.getTime();
      return diff >= 0 && diff <= three && t.status !== "done";
    });
  }, [tasks]);

  const priorityCounts = useMemo(() => {
    const result = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => result[t.priority]++);
    return result;
  }, [tasks]);

  const startedVsNot = useMemo(() => {
    const started = tasks.filter((t) => t.start_date).length;
    return { started, notStarted: tasks.length - started };
  }, [tasks]);

  const avgDurationDays = useMemo(() => {
    const finished = tasks.filter((t) => t.start_date && t.finished_date);
    if (finished.length === 0) return 0;

    const total = finished.reduce((sum, t) => {
      const diff = daysBetween(t.start_date, t.finished_date) || 0;
      return sum + diff;
    }, 0);

    return total / finished.length;
  }, [tasks]);

  const notifiedCounts = useMemo(() => {
    const notified = tasks.filter((t) => t.notification_status === true).length;

    return {
      notified,
      notNotified: tasks.length - notified,
    };
  }, [tasks]);

  /* ----------------------------- UI ----------------------------- */

  return (
    <div className="p-6 min-h-screen bg-[#f8fbff]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Analytic</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-teal-200 rounded-xl border shadow">
            <div className="text-sm text-gray-600">Total Tasks</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>

          <div className="p-4 bg-green-200 rounded-xl border shadow">
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-3xl font-bold">{stats.done}</div>
          </div>

          <div className="p-4 bg-red-200 rounded-xl border shadow">
            <div className="text-sm text-gray-600">Incomplete</div>
            <div className="text-3xl font-bold">{stats.notDone}</div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming */}
            <div className="p-4 bg-white rounded-xl border shadow">
              <h2 className="text-lg font-semibold mb-3">
                Upcoming (Next 3 Days)
              </h2>
              {upcoming.length === 0 && (
                <p className="text-gray-500">No upcoming tasks.</p>
              )}

              {upcoming.map((t) => (
                <div
                  key={t.task_id}
                  className="p-3 border rounded-lg mb-2 bg-teal-100"
                >
                  <div className="font-semibold">{t.task_name}</div>
                  <div className="text-sm text-gray-500">
                    Due: {formatDate(t.due_date)}
                  </div>
                </div>
              ))}
            </div>

            {/* Average Duration */}
            <div className="p-4 bg-white rounded-xl border shadow">
              <h3 className="text-lg font-semibold">Average Duration</h3>
              <p className="text-2xl font-bold mt-2">
                {avgDurationDays === 0
                  ? "-"
                  : `${avgDurationDays.toFixed(1)} days`}
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            <PriorityBarChart data={priorityCounts} />
            <DonutChart
              started={startedVsNot.started}
              notStarted={startedVsNot.notStarted}
            />

            <div className="p-4 bg-white rounded-xl border shadow">
              <h3 className="text-sm font-semibold mb-2">Notification</h3>
              <p>Notified: {notifiedCounts.notified}</p>
              <p>Not Notified: {notifiedCounts.notNotified}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
