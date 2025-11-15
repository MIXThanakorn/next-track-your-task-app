"use client";

import { FaGithub } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        {/* Logo + Website Name */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <div className="w-12 h-12 relative bg-white rounded-xl">
            <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <h2 className="text-xl font-semibold">Track Your Task</h2>
          <p className="text-sm opacity-80">
            ระบบช่วยจัดการงานและติดตามภารกิจของคุณ
          </p>
        </div>

        {/* About Section */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-2">เกี่ยวกับเรา</h3>
          <p className="text-sm opacity-90 max-w-xs">
            Track Your Task เป็นเครื่องมือช่วยให้คุณสามารถจัดการงาน
            รายการสิ่งที่ต้องทำ
            และติดตามความคืบหน้าได้อย่างง่ายดายและมีประสิทธิภาพ
          </p>
        </div>

        {/* Contact / Social Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-3">ติดต่อเรา</h3>

          <ul className="space-y-2">
            <li>
              <a
                href="https://github.com/MIXThanakorn"
                target="_blank"
                className="flex items-center space-x-2 hover:underline justify-center md:justify-start"
              >
                <FaGithub /> <span>MIXThanakorn</span>
              </a>
            </li>

            <li>
              <a
                href="https://github.com/Thitibuntana"
                target="_blank"
                className="flex items-center space-x-2 hover:underline justify-center md:justify-start"
              >
                <FaGithub /> <span>Thitibuntana</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
