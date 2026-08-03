import { ArrowUpRight, Eye, GitFork, Github, Star } from "lucide-react";
import Link from "next/link";
import type { PublicProject } from "@/lib/projects";
import { Badge } from "@/components/ui/badge";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { compactNumber } from "@/lib/utils";

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <article className="glass flex h-full flex-col rounded-lg p-5 transition hover:-translate-y-1 hover:border-[var(--accent-2)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent-2)]">
            {project.category[0] ?? "AI System"}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
        </div>
        {project.featured ? <Badge className="border-[var(--accent)]">Featured</Badge> : null}
      </div>
      <p className="text-sm leading-6 text-[var(--muted)]">{project.description}</p>
      {project.problemSolved ? (
        <p className="mt-4 border-l border-[var(--accent)] pl-3 text-sm leading-6">
          {project.problemSolved}
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.slice(0, 5).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-4 text-xs text-[var(--muted)]">
        <span className="inline-flex items-center gap-1">
          <Eye size={14} /> {compactNumber(project.viewCount)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star size={14} /> {compactNumber(project.stars)}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork size={14} /> {compactNumber(project.forks)}
        </span>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
        <Link
          href={`/projects/${project.slug}`}
          className="focus-ring inline-flex items-center gap-2 rounded-md text-sm font-semibold text-[var(--accent)]"
        >
          Case study <ArrowUpRight size={16} />
        </Link>
        <TrackedLink
          href={project.repoUrl}
          target="_blank"
          eventName="project_github_click"
          metadata={{ projectId: project.id, slug: project.slug }}
          className="inline-flex items-center gap-2 rounded-md text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <Github size={16} /> Repo
        </TrackedLink>
        {project.deploymentUrl ? (
          <TrackedLink
            href={project.deploymentUrl}
            target="_blank"
            eventName="project_demo_click"
            metadata={{ projectId: project.id, slug: project.slug }}
            className="inline-flex items-center gap-2 rounded-md text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            Demo
          </TrackedLink>
        ) : null}
      </div>
    </article>
  );
}
