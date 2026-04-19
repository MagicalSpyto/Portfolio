import Link from "next/link";
import { homeData } from "@/app/data/HomePage";
import { projects } from "@/app/data/projects";
import ContinueButton from "@/app/components/layout/continueButton";
import { projectData as bachelorData } from "@/app/data/BachelorProject";
import { projectData as webDesignData } from "@/app/data/WebDesignProject";
import FrontPageWebglRenderer from "@/app/components/lib/FrontPageWebglRenderer";

// The homepage reuses the same project sources as the portfolio overview.
const projectDataMap = {
  bachelorproject: bachelorData,
  webdesign: webDesignData,
};

export default function Home() {
  return (
    <main className="mx-auto flex w-full flex-col">
      {/* Hero: core identity, short positioning, and CTA placeholders. */}
      <div className="relative min-h-150 h-screen left-1/2 -translate-x-1/2" style={{ width: "calc(100vw - var(--scrollbar-width, 0px))" }}>
        <div className="absolute inset-0 h-full w-full">
          <FrontPageWebglRenderer />
        </div>
        <section className="relative z-10 mx-auto grid h-full w-full max-w-6xl content-center items-center gap-8 px-6 py-6 md:grid-cols-[1.4fr_0.6fr] md:px-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-slate-100">
              {homeData.hero.subtitle}
            </p>
            <h1 className="mb-6 text-4xl font-semibold tracking-tight text-slate-50 md:text-6xl">
              {homeData.hero.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-50 md:text-xl">
              {homeData.hero.description}
            </p>
          </div>
          {/* contact information and work intent */}
          <div className="rounded-2xl border-2 border-slate-500/70 bg-slate-500/30 backdrop-blur-sm p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-50">
              About me
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-50">
              I am based in Germany and am currently seeking work opportunities within a creative and collaborative environment. I am open to roles that would allow me to utilise my design and development skills.
            </p>
            <div className="mt-6 text-sm font-medium text-slate-700">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-50">
                Contact
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-4 py-2 ring-1 ring-slate-200 shadow-xl">
                  {homeData.contact.primary}
                </span>
                <span className="rounded-full bg-white px-4 py-2 ring-1 ring-slate-200 shadow-xl">
                  <a
                    href={homeData.contact.secondary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <img src="/imports/linkedin.svg" alt="LinkedIn" className="h-4 w-4" />
                    <span>Ede Dust</span>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </section>
        <ContinueButton targetId="selected-work" />
      </div>
      {/* Spacer to build a visual separation */}
      <div className="h-10 w-full bg-slate-100 ">

      </div>
      {/* Selected work: uses dynamic project data*/}
      <section id="selected-work" className="grid gap-8 pt-8 mx-auto w-full bg-gradient-to-b from-slate-900 to-slate-900/0">
        <div className="max-w-3xl px-12 mx-auto">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            {homeData.selectedWork.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-100">
            {homeData.selectedWork.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            {homeData.selectedWork.description}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 px-6 max-w-7xl mx-auto">
          {projects.map((project) => {
            // Each slug is resolved to the detailed project content used by the portfolio pages.
            const data = projectDataMap[project.slug as keyof typeof projectDataMap];
            if (!data) return null;

            return (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-slate-500/70 p-6 shadow-md duration-300 ease-out hover:scale-[1.02] hover:shadow-xl"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${data.thumbnail})` }}
                />
                <div className="absolute -inset-px bg-slate-500/30 backdrop-blur-sm duration-300 ease-out group-hover:backdrop-blur-xl" />

                <div className="relative z-10">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                    {data.duration}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-slate-50">
                    {data.title}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-50">
                    {data.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-50">
                    {data.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {data.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                  <p className="mt-6 text-sm font-medium text-slate-200">
                    View case study
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="">
          <Link
            href="/portfolio"
            className="inline-flex items-center text-sm font-medium px-24 py-6 bg-slate-50 text-slate-900
            hover:pl-48 transition-[padding] ease-out
            [clip-path:polygon(0_0,100%_0,100%_0%,85%_50%,100%_100%,100%_100%,0_100%)]"
          >
            View all projects
          </Link>
        </div>
      </section>
      <div className="pt-10 pb-6 px-12">
          <div className="border-t-3 border-slate-800/30 max-w-8xl mx-auto"></div>
      </div>
      {/* Technical focus: grouped capability areas instead of a long skill list. */}
      <section className="grid gap-8 max-w-7xl px-6 mx-auto pb-8 ">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            {homeData.technicalFocus.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            {homeData.technicalFocus.title}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {homeData.technicalFocus.items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-slate-100 p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Contact: final conversion section with primary contact and supporting links. */}
      <section className=" bg-slate-100 p-8 md:p-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          {homeData.contact.eyebrow}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
          {homeData.contact.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          {homeData.contact.description}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Primary contact
            </p>
            <p className="mt-3 text-sm text-slate-700">{homeData.contact.primary}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Supporting links
            </p>
            <a href={homeData.contact.secondary} 
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-sm text-slate-700"
            >
              {homeData.contact.secondary}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
