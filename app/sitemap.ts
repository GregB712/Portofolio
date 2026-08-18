import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getVisibleProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/projects",
    "/contact",
    "/cv",
    "/privacy"
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "monthly" : "weekly",
    priority: path === "" ? 1 : 0.8
  }));

  try {
    const projects = await getVisibleProjects({ sort: "updated" });

    return [
      ...staticRoutes,
      ...projects.map((project) => ({
        url: `${site.url}/projects/${project.slug}`,
        lastModified: project.githubUpdatedAt ?? project.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7
      }))
    ];
  } catch {
    return staticRoutes;
  }
}
