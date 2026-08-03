import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PublicProject } from "@/lib/projects";

export function FeaturedProjects({ projects }: { projects: PublicProject[] }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Project Showcase"
          title="Recruiter-readable projects with real engineering depth."
          description="Featured work prioritizes production AI systems, retrieval infrastructure, NLP internals, and full-stack deployment readiness."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/projects"
            className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-semibold text-[var(--accent)]"
          >
            Explore all projects <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
