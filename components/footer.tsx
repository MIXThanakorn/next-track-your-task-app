"use client";

import { FaGithub } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-6 md:py-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center md:text-left">
        {/* Logo + Website Name */}
        <div className="flex flex-col items-center md:items-start space-y-2 md:space-y-3">
          <div className="w-10 h-10 md:w-12 md:h-12 relative bg-white rounded-xl p-1">
            <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <h2 className="text-lg md:text-xl font-semibold">Track Your Task</h2>
          <p className="text-xs md:text-sm opacity-80 max-w-xs">
            ระบบช่วยจัดการงานและติดตามภารกิจของคุณ
          </p>
        </div>

        {/* About Section */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            เกี่ยวกับเรา
          </h3>
          <p className="text-xs md:text-sm opacity-90 max-w-xs leading-relaxed">
            Track Your Task เป็นเครื่องมือช่วยให้คุณสามารถจัดการงาน
            รายการสิ่งที่ต้องทำ
            และติดตามความคืบหน้าได้อย่างง่ายดายและมีประสิทธิภาพ
          </p>
        </div>

        {/* Contact / Social Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-base md:text-lg font-semibold mb-2 md:mb-3">
            ติดต่อเรา
          </h3>

          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/MIXThanakorn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:underline justify-center md:justify-start text-sm md:text-base"
              >
                <FaGithub className="text-lg md:text-xl" />
                <span>MIXThanakorn</span>
              </a>
            </li>

            <li>
              <a
                href="https://github.com/Thitibuntana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:underline justify-center md:justify-start text-sm md:text-base"
              >
                <FaGithub className="text-lg md:text-xl" />
                <span>Thitibuntana</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
