import { projects } from "@/app/data/projects";
import { projectData as bachelorData } from "@/app/data/BachelorProject";
import { projectData as webDesignData } from "@/app/data/WebDesignProject";
import { projectData as asteroidARShipData } from "@/app/data/AsteroidARShip";
import { projectData as escapeMeData } from "@/app/data/EscapeMe";
import { projectData as animationData } from "@/app/data/Animation";
import { projectData as spaceTacosData } from "@/app/data/SpaceTacos";
import PortfolioRow from "@/app/components/layout/portfolioRow";

// Map slug to actual project data
const projectDataMap = {
  bachelorproject: bachelorData,
  webdesign: webDesignData,
  asteroidarship: asteroidARShipData,
  escapeMe: escapeMeData,
  spaceTacos: spaceTacosData,
  animation: animationData
};

export default function Portfolio() {
  return (
    <div className="min-h-screen pb-10 bg-gradient-to-b from-slate-50/0 to-white">
      {/* Header */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="heading-h1 mb-4 !text-slate-100">Portfolio</h1>
          <p className="body-text !text-slate-100">
            A collection of projects showcasing my design and development expertise.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-8 px-6 mx-auto">
        <PortfolioRow projects={projects} projectDataMap={projectDataMap} />
      </div>
    </div>
  );
}
