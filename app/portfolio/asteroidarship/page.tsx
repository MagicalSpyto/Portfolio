'use client';

import { projectData } from "@/app/data/AsteroidARShip";
import { useState } from "react";
import { motion, Variants } from "framer-motion";

export default function AsteroidARShip() {
  const [animatingImages, setAnimatingImages] = useState<Set<number>>(new Set());

  const handleImageClick = (imageIndex: number) => {
    setAnimatingImages(prev => new Set(prev).add(imageIndex));
    setTimeout(() => {
      setAnimatingImages(prev => {
        const next = new Set(prev);
        next.delete(imageIndex);
        return next;
      });
    }, 1000);
  };

  const wiggleVariants: Variants = {
    initial: { 
      rotate: 0,
      y: 0
     },
    animate: { 
      y: [0, 50, 50, -150, 0], // Wackelbewegung
      rotate: [0, 360],
      transition: {
        duration: 1,
        ease: "backInOut",
        times: [0, 0.15, 0.3, 0.5, 1] // Timing für die Wackelbewegung
      }
    },
    exit: {
      rotate: 0,
      transition: { duration: 1 } // Instant reset, keine Rückwärts-Animation
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-violet-100">
      {/* Hero Section */}
      <div className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="heading-h1 mb-4 text-violet-50!">
            {projectData.title}
          </h1>
          <p className="subtitle mb-6 text-violet-50!">
            {projectData.subtitle}
          </p>
          <p className="body-text mb-8 text-violet-50!">
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
                    className="px-4 py-2 bg-violet-100 text-violet-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
            {/* Gallery Section */}
      <div className="">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="aspect-square cursor-pointer"
              onClick={() => handleImageClick(0)}
              variants={wiggleVariants}
              initial="initial"
              animate={animatingImages.has(0) ? "animate" : "initial"}
              transition={animatingImages.has(0) ? undefined : { duration: 0 }}
            >
              <div className="h-full w-full overflow-hidden rounded-lg">
                <img 
                  src={projectData.images.image1} 
                  alt="Project image 1" 
                  className="h-full w-full object-cover hover:scale-80 transition-transform duration-300"
                />
              </div>
            </motion.div>
            <motion.div 
              className="aspect-square cursor-pointer"
              onClick={() => handleImageClick(1)}
              variants={wiggleVariants}
              initial="initial"
              animate={animatingImages.has(1) ? "animate" : "initial"}
              transition={animatingImages.has(1) ? undefined : { duration: 0 }}
            >
              <div className="h-full w-full overflow-hidden rounded-lg">
                <img 
                  src={projectData.images.image2} 
                  alt="Project image 2" 
                  className="h-full w-full object-cover hover:scale-80 transition-transform duration-300"
                />
              </div>
            </motion.div>
            <motion.div 
              className="aspect-square cursor-pointer"
              onClick={() => handleImageClick(2)}
              variants={wiggleVariants}
              initial="initial"
              animate={animatingImages.has(2) ? "animate" : "initial"}
              transition={animatingImages.has(2) ? undefined : { duration: 0 }}
            >
              <div className="h-full w-full overflow-hidden rounded-lg">
                <img 
                  src={projectData.images.image3} 
                  alt="Project image 3" 
                  className="h-full w-full object-cover hover:scale-80 transition-transform duration-300"
                />
              </div>
            </motion.div>
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
            {/* <h2 className="heading-h2 mb-4">Objectives</h2> */}
            <p className="body-text">
              {/*projectData.sections.objectives*/}
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
            {/* <h2 className="heading-h2 mb-4">Results</h2> */}
            <p className="body-text">
              {/*projectData.sections.results*/}
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
