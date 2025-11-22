"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, CalendarDays } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={22} /> },
    {
      name: "Analytic",
      path: "/dashboard/analytic",
      icon: <BarChart2 size={22} />,
    },
    {
      name: "Calendar",
      path: "/dashboard/calender",
      icon: <CalendarDays size={22} />,
    },
  ];

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 
        bg-white border-t border-blue-200 
        shadow-lg z-50 
        flex justify-around items-center py-2
        md:hidden
      "
    >
      {menu.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            className="
              flex flex-col items-center gap-1 
              text-xs font-medium transition-all
            "
          >
            <div
              className={`
                p-2 rounded-full transition-all
                ${isActive ? "text-blue-600 bg-blue-100" : "text-gray-500"}
              `}
            >
              {item.icon}
            </div>
            <span className={isActive ? "text-blue-700" : "text-gray-500"}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
