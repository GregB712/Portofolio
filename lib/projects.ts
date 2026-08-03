import type { Prisma, Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PublicProject = Project;

export async function getFeaturedProjects(limit = 6) {
  return prisma.project.findMany({
    where: { status: { not: "hidden" }, featured: true },
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }],
    take: limit
  });
}

export async function getVisibleProjects(params?: {
  query?: string;
  category?: string;
  tag?: string;
  sort?: string;
}) {
  const where: Prisma.ProjectWhereInput = {
    status: { not: "hidden" }
  };

  if (params?.query) {
    where.OR = [
      { title: { contains: params.query, mode: "insensitive" } },
      { description: { contains: params.query, mode: "insensitive" } },
      { repoName: { contains: params.query, mode: "insensitive" } }
    ];
  }

  if (params?.category) {
    where.category = { has: params.category };
  }

  if (params?.tag) {
    where.tags = { has: params.tag };
  }

  const sort = params?.sort ?? "featured";
  const orderBy: Prisma.ProjectOrderByWithRelationInput[] =
    sort === "updated"
      ? [{ githubUpdatedAt: "desc" }, { updatedAt: "desc" }]
      : sort === "views"
        ? [{ viewCount: "desc" }]
        : sort === "github"
          ? [{ githubClickCount: "desc" }]
          : sort === "priority"
            ? [{ priority: "asc" }]
            : [{ featured: "desc" }, { priority: "asc" }, { updatedAt: "desc" }];

  return prisma.project.findMany({ where, orderBy });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, status: { not: "hidden" } }
  });
}

export async function getProjectFacets() {
  const projects = await prisma.project.findMany({
    where: { status: { not: "hidden" } },
    select: { tags: true, category: true }
  });

  return {
    tags: Array.from(new Set(projects.flatMap((project) => project.tags))).sort(),
    categories: Array.from(new Set(projects.flatMap((project) => project.category))).sort()
  };
}
