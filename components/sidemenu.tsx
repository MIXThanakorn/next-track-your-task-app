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
  { name: "Home", path: "/home", icon: "🏠" },
  { name: "Dashboard", path: "/home/dashboard", icon: "📊" },
  { name: "Calendar", path: "/home/calender", icon: "📅" },
  { name: "Profile", path: "/home/profile", icon: "👤" },
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
      className={`fixed left-0 top-0 h-screen bg-white border-r border-blue-200 shadow-md flex flex-col py-6 space-y-4 transition-all duration-500 ease-in-out ${
        expanded ? "w-48" : "w-16"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out
              ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-blue-600 hover:bg-blue-50"
              }`}
          >
            {/* Icon */}
            <div
              className={`text-2xl flex-shrink-0 transition-transform duration-300 ${
                isActive ? "scale-125" : "group-hover:scale-110"
              }`}
            >
              {item.icon}
            </div>

            {/* Text */}
            <span
              className={`ml-3 text-sm whitespace-nowrap transition-all duration-300 ease-in-out ${
                expanded ? "opacity-100" : "opacity-0"
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
