import { projectData } from "@/app/data/EscapeMe";

export default function EscapeMe() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white"
    style={{ backgroundImage: `url(${projectData.images.image1})`,
             backgroundRepeat: "no-repeat",
             backgroundPosition: "top",
             backgroundSize: "cover",
           }}>
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black/100 to-black/0">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-h1 mb-4 !text-slate-100">
            {projectData.title}
          </h1>
          <p className="subtitle mb-6 !text-slate-100">
            {projectData.subtitle}
          </p>
          <p className="body-text mb-8 !text-slate-100">
            {projectData.description}
          </p>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white/30 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="label mb-4">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <video
          src={projectData.videos.video}
          controls
          className="w-full max-w-4xl mx-auto mt-8 rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
