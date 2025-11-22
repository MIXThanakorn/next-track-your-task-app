"use client";

import React, { useState } from "react";
import { Prompt } from "next/font/google";
import SideMenu from "@/components/sidemenu";
import DashboardHeader from "@/components/dashboardheader";
import BottomMenu from "@/components/bottommenu";

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
      {/* Header */}
      <div className="sticky top-0 z-40">
        <DashboardHeader />
      </div>

      <div className="flex flex-1">
        {/* SideMenu: ซ่อนบนมือถือ (hidden md:block) */}
        <div className="hidden md:block">
          <SideMenu onExpandChange={setExpanded} />
        </div>

        {/* Main content: ใช้ md:ml-20 หรือ md:ml-32 เมื่อ side ขยาย */}
        <main
          className={`${prompt.className} flex-1 p-4 sm:p-6 transition-all duration-500 ease-in-out md:ml-0`}
        >
          {children}
        </main>
      </div>
      {/* Bottom menu for mobile */}
      <BottomMenu />
    </div>
  );
}
