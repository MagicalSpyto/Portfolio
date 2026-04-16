import { projectData } from "@/app/data/BachelorProject";
import WebGLRenderer from "@/app/components/lib/WebGLRenderer";

export default function BachelorProject() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-400 to-white">
      {/* Hero Section */}
      <div className="relative py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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

      {/* WebGL Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <WebGLRenderer />
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
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <figure className="self-center pb-10">
          <div className="grid grid-cols-2">
            <img
              src={projectData.images.densePointCloud}
              alt="Dense Point Cloud"
              className="shadow-md aspect-square w-full object-cover"
            />
            <img
              src={projectData.images.sparsePointCloud}
              alt="Sparse Point Cloud"
              className="shadow-md aspect-square w-full object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm text-slate-600 text-center">
            A sparse pointcloud (right) generated from the multi-device AR scanning process in real-time, and a dense pointcloud (left) generated after the data collection was completed.
          </figcaption>
        </figure>
        <div className="space-y-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="">
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
          </div>
          <figure className="self-center">
            <img
              src={projectData.images.image1}
              alt="Project Overview"
              className="shadow-md"
            />
            <figcaption className="mt-3 text-sm text-slate-600">
              A sparse point cloud generated from the multi-device AR scanning process.
            </figcaption>
          </figure>
          <figure className="self-center">
            <img
              src={projectData.images.image2}
              alt="Project Baseline Result"
              className="shadow-md"
            />
            <figcaption className="mt-3 text-sm text-slate-600">
              The baseline result of the multi-device AR scanning process. with Limited Data
            </figcaption>
          </figure>
          <div>
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