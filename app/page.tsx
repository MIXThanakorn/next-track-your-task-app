import Header from "@/components/header";
import Image from "next/image";
export default function homePage() {
  return (
    <div className="h-full">
      {" "}
      <Header />{" "}
      <div className="flex items-center justify-center w-full">
        {" "}
        <Image
          src="/home.png"
          alt="home_image"
          width={1050}
          height={500}
        />{" "}
      </div>{" "}
    </div>
  );
}
