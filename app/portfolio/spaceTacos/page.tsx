import { projectData } from "@/app/data/SpaceTacos";

export default function SpaceTacos() {
  return (
    <div className="min-h-screen"
    >

      {/* Hero Section */}
      <div className="relative py-70 px-4 sm:px-6 lg:px-8"
            style={{
        backgroundImage: `url(${projectData.images.image1})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left",
        backgroundSize: "cover",
      }}>
        <div className="max-w-4xl border-3 border-slate-700/30 bg-slate-950/70 rounded-2xl mx-auto backdrop-blur-sm p-3">
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
      <div className="bg-red-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="label mb-2">
                Duration
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {projectData.duration}
              </p>
            </div>
            <div>
              <h3 className="label mb-4">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 backdrop-blur-sm">
        <div className="space-y-12">
          {/* Overview */}
          <section>
            <h2 className="heading-h2 mb-4 !text-slate-100">UV's</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <img src={projectData.images.imageUv1} alt="UV Map 1" className="rounded-lg shadow-md" />
              <img src={projectData.images.imageUv2} alt="UV Map 2" className="rounded-lg shadow-md" />
              <img src={projectData.images.imageUv3} alt="UV Map 3" className="rounded-lg shadow-md" />
              <img src={projectData.images.imageUv4} alt="UV Map 4" className="rounded-lg shadow-md" />
            </div>
          </section>

          {/* Objectives */}
          <section>
            <h2 className="heading-h2 mb-4 !text-slate-100">Model</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <img src={projectData.thumbnail} alt="Model Thumbnail" className="rounded-lg shadow-md" />
              <img src={projectData.images.wireframe} alt="Wireframe Image" className="rounded-lg shadow-md" />
              <img src={projectData.images.baseColor} alt="Model Image" className="rounded-lg shadow-md" />
              <img src={projectData.images.normal} alt="Normal Map Image" className="rounded-lg shadow-md" />
            </div>
          </section>
        </div>
      </div>

      {/* Footer for Navigation */}
      <div className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <a
            href="/portfolio"
            className="link-primary"
          >
            ← Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
