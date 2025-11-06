"use client";

import React, { useState } from "react";
import { Prompt } from "next/font/google";
import SideMenu from "@/components/sidemenu";

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
    <div className="flex bg-blue-50 min-h-screen transition-all duration-500 ease-in-out">
      {/* Sidebar */}
      <SideMenu onExpandChange={setExpanded} />

      {/* Content */}
      <main
        className={`flex-1 transition-all duration-500 ease-in-out ${
          expanded ? "ml-48" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
