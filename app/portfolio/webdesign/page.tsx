import { projectData } from "@/app/data/WebDesignProject";

export default function WebDesignProject() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-h1 mb-4">
            {projectData.title}
          </h1>
          <p className="subtitle mb-6">
            {projectData.subtitle}
          </p>
          <p className="body-text mb-8">
            {projectData.description}
          </p>
        </div>
      </div>

      {/* Project Info */}
      <div className="bg-white border-y border-gray-200">
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

      {/* Content Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Overview */}
          <section>
            <h2 className="heading-h2 mb-4">Overview</h2>
            <p className="body-text">
              {projectData.sections.overview}
            </p>
          </section>

          {/* Objectives */}
          <section>
            <h2 className="heading-h2 mb-4">Objectives</h2>
            <p className="body-text">
              {projectData.sections.objectives}
            </p>
          </section>

          {/* Challenges */}
          <section>
            <h2 className="heading-h2 mb-4">Challenges</h2>
            <p className="body-text">
              {projectData.sections.challenges}
            </p>
          </section>

          {/* Results */}
          <section>
            <h2 className="heading-h2 mb-4">Results</h2>
            <p className="body-text">
              {projectData.sections.results}
            </p>
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
