import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Content (scroll ได้เอง เพราะ flex-1 + overflow-auto) */}
      <div className="flex-1">
        <div className="flex items-center justify-center w-full py-8">
          <Image src="/home.png" alt="home_image" width={1050} height={500} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
