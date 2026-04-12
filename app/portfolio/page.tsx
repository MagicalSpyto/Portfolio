import { projects } from "@/app/data/projects";
import { projectData as bachelorData } from "@/app/data/BachelorProject";
import { projectData as webDesignData } from "@/app/data/WebDesignProject";
import Link from "next/link";

// Map slug to actual project data
const projectDataMap = {
  bachelorproject: bachelorData,
  webdesign: webDesignData
};

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-h1 mb-4">Portfolio</h1>
          <p className="body-text">
            A collection of projects showcasing my design and development expertise.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const data = projectDataMap[project.slug as keyof typeof projectDataMap];
            if (!data) return null;

            return (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group"
              >
                <div className="h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200 hover:border-gray-300">
                  {/* Project Preview */}
                  <div className={`h-48 bg-gradient-to-b ${project.theme.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 group-hover:scale-105 transition-transform duration-300">
                      <div className="text-center px-4">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {data.title}
                        </h3>
                        <p className="text-gray-700">
                          {data.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {data.description}
                    </p>

                    {/* Duration */}
                    <div className="mb-4">
                      <p className="label mb-1">Duration</p>
                      <p className="text-sm font-medium text-gray-900">
                        {data.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
