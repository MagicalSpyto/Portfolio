import Image from "next/image";
import { homeData } from "@/app/data/HomePage";
export default function Home() {
  return (
    <div className="text-center pt-12">
      <h1 className="text-4xl font-bold mb-6">{homeData.hero.title}</h1>
      <p>{homeData.hero.subtitle}</p>
      <p>{homeData.hero.description}</p>
    </div>
  );
}
