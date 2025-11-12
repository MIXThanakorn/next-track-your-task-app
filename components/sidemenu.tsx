"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  name: string;
  path: string;
  icon: string; // placeholder
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: "🏠" },
  { name: "Analytic", path: "/dashboard/analytic", icon: "📊" },
  { name: "Calendar", path: "/dashboard/calender", icon: "📅" },
];

interface SideMenuProps {
  onExpandChange?: (expanded: boolean) => void;
}

export default function SideMenu({ onExpandChange }: SideMenuProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const handleMouseEnter = () => {
    setExpanded(true);
    onExpandChange?.(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
    onExpandChange?.(false);
  };

  return (
    <div
      className={`fixed left-0  h-screen bg-white border-r border-blue-200 shadow-md flex flex-col py-6 space-y-4 transition-all duration-500 ease-in-out z-50
        ${expanded ? "w-48" : "w-16"}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.name}
            href={item.path}
            className={`group flex items-center w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
          >
            {/* Icon */}
            <div
              className={`text-2xl flex-shrink-0 transition-transform duration-300 ease-in-out ${
                isActive ? "scale-125" : "group-hover:scale-110"
              }`}
            >
              {item.icon}
            </div>

            {/* Text */}
            <span
              className={`ml-3 text-sm whitespace-nowrap transition-all duration-500 ease-in-out ${
                expanded
                  ? "opacity-100 translate-x-0 delay-100"
                  : "opacity-0 -translate-x-3"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
