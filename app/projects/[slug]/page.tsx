import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getProjectBySlug, getVisibleProjects } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { compactNumber, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) return { title: "Project" };

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Gregory Barmpas`,
      description: project.description
    }
  };
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const [related] = await Promise.all([
    getVisibleProjects({ category: project.category[0], sort: "priority" }),
    prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } }
    }),
    trackPageView(`/projects/${project.slug}`),
    trackEvent({
      eventName: "project_view",
      path: `/projects/${project.slug}`,
      metadata: { projectId: project.id, slug: project.slug }
    })
  ]);

  return (
    <main className="px-4 py-14 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <Breadcrumbs
          items={[{ label: "Projects", href: "/projects" }, { label: project.title, href: `/projects/${project.slug}` }]}
          className="mb-8"
        />
        <Link
          href="/projects"
          className="focus-ring mb-8 inline-flex items-center gap-2 rounded-md text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft size={16} /> Back to projects
        </Link>
        <div className="glass rounded-lg p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            {project.category.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </div>
          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">{project.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TrackedLink
              href={project.repoUrl}
              target="_blank"
              eventName="project_github_click"
              metadata={{ projectId: project.id, slug: project.slug }}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black"
            >
              <Github size={16} /> GitHub repository
            </TrackedLink>
            {project.deploymentUrl ? (
              <TrackedLink
                href={project.deploymentUrl}
                target="_blank"
                eventName="project_demo_click"
                metadata={{ projectId: project.id, slug: project.slug }}
                className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--line)] px-4 py-2 text-sm font-semibold"
              >
                <ExternalLink size={16} /> Live demo
              </TrackedLink>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-4">
          {[
            ["Views", compactNumber(project.viewCount + 1)],
            ["Stars", compactNumber(project.stars)],
            ["Forks", compactNumber(project.forks)],
            ["Updated", project.githubUpdatedAt ? formatDate(project.githubUpdatedAt) : "Manual"]
          ].map(([label, value]) => (
            <div key={label} className="glass rounded-lg p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
              <p className="mt-2 text-xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="glass rounded-lg p-6">
            <h2 className="text-2xl font-semibold">Case study</h2>
            <p className="mt-4 leading-8 text-[var(--muted)]">
              {project.longDescription || project.description}
            </p>
            {project.problemSolved ? (
              <>
                <h3 className="mt-8 text-xl font-semibold">Problem solved</h3>
                <p className="mt-3 leading-8 text-[var(--muted)]">{project.problemSolved}</p>
              </>
            ) : null}
          </section>
          <aside className="glass rounded-lg p-6">
            <h2 className="text-xl font-semibold">Technical highlights</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {project.technicalHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <h2 className="mt-8 text-xl font-semibold">Tech stack</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </aside>
        </div>
      </article>

      <section className="mx-auto mt-16 max-w-7xl">
        <h2 className="mb-5 text-2xl font-semibold">Related projects</h2>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {related
            .filter((item) => item.id !== project.id)
            .slice(0, 3)
            .map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
        </div>
      </section>
    </main>
  );
}
