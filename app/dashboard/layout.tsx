"use client";

import React, { useState } from "react";
import { Prompt } from "next/font/google";
import SideMenu from "@/components/sidemenu";
import DashboardHeader from "@/components/dashboardheader";

const prompt = Prompt({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col bg-blue-50 min-h-screen">
      {/* 🔹 Header ด้านบนสุด */}
      <div className="sticky top-0 z-40">
        <DashboardHeader />
      </div>

      {/* 🔹 ส่วนล่าง: SideMenu + Main content */}
      <div className="flex flex-1">
        {/* Sidebar ทางซ้าย */}
        <SideMenu onExpandChange={setExpanded} />

        {/* เนื้อหาหลักทางขวา */}
        <main
          className={`${
            prompt.className
          } flex-1 p-6 transition-all duration-500 ease-in-out ${
            expanded ? "ml-32" : "ml-20"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
