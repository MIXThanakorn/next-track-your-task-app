import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Content - Darker background for separation */}
      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <div className="w-full px-4 md:px-8 py-0.5 md:py-3 flex flex-col items-center justify-center">
          {/* Main Image */}
          <div className="relative w-full max-w-xs md:max-w-2xl lg:max-w-4xl">
            <Image
              src="/home.png"
              alt="Track Your Task - จัดการงานของคุณได้ง่ายขึ้น"
              width={1050}
              height={500}
              className="w-full h-auto object-contain rounded-lg"
              priority
            />
          </div>

          {/* Caption/Description below image */}
          <div className="mt-8 md:mt-12 my-12 md:my-18 max-w-xs md:max-w-2xl text-center">
            <h2 className="text-xl md:text-3xl font-bold text-blue-700 mb-3 md:mb-4">
              จัดการงานของคุณได้อย่างมีประสิทธิภาพ
            </h2>
            <p className="text-sm md:text-lg text-gray-700 leading-relaxed mb-2 md:mb-3">
              Track Your Task ช่วยให้คุณสามารถติดตามงาน วางแผน
              และจัดการภารกิจต่างๆ ได้อย่างเป็นระบบ
            </p>
            <p className="text-xs md:text-base text-gray-600">
              เริ่มต้นใช้งานง่ายๆ เพียงสร้างบัญชีและเพิ่มงานของคุณได้ทันที
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
