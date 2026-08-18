import type { Metadata } from "next";
import { Search } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { pageDescriptions } from "@/content/site";
import { getProjectFacets, getVisibleProjects } from "@/lib/projects";
import { trackPageView } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: pageDescriptions.projects
};

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = single(params.q) ?? "";
  const category = single(params.category) ?? "";
  const tag = single(params.tag) ?? "";
  const sort = single(params.sort) ?? "featured";

  const [projects, facets] = await Promise.all([
    getVisibleProjects({ query, category, tag, sort }),
    getProjectFacets(),
    trackPageView("/projects")
  ]);

  return (
    <main className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={[{ label: "Projects", href: "/projects" }]} className="mb-8" />
        <div className="mb-8">
          <Badge>Projects</Badge>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Project showcase</h1>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">
            Search and filter database-backed projects by category, tag, impact, recency, and recruiter-relevant priority.
          </p>
        </div>

        <form className="glass mb-8 grid gap-3 rounded-lg p-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={16} />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search projects"
              className="focus-ring h-11 w-full rounded-md border border-[var(--line)] bg-white/5 pl-10 pr-3 text-sm"
            />
          </label>
          <select
            name="category"
            defaultValue={category}
            className="focus-ring h-11 rounded-md border border-[var(--line)] bg-[var(--background)] px-3 text-sm"
          >
            <option value="">All categories</option>
            {facets.categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            name="tag"
            defaultValue={tag}
            className="focus-ring h-11 rounded-md border border-[var(--line)] bg-[var(--background)] px-3 text-sm"
          >
            <option value="">All tags</option>
            {facets.tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            name="sort"
            defaultValue={sort}
            className="focus-ring h-11 rounded-md border border-[var(--line)] bg-[var(--background)] px-3 text-sm"
          >
            <option value="featured">Featured first</option>
            <option value="updated">Recently updated</option>
            <option value="views">Most viewed</option>
            <option value="github">Most GitHub clicks</option>
            <option value="priority">Custom priority</option>
          </select>
          <button className="focus-ring h-11 rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-black">
            Apply
          </button>
        </form>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
