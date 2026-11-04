import type { Prisma, Project } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PublicProject = Project;

export const FEATURED_COUNT = 6;

// Guest-facing order: lower priority number first, ties broken by creation date.
export const PROJECT_ORDER: Prisma.ProjectOrderByWithRelationInput[] = [
  { priority: "asc" },
  { createdAt: "asc" }
];

export async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { status: { not: "hidden" } },
    orderBy: PROJECT_ORDER,
    take: FEATURED_COUNT
  });
}

// Keep the `featured` flag equal to "in the first FEATURED_COUNT visible projects".
export async function syncFeaturedFlags() {
  const top = await prisma.project.findMany({
    where: { status: { not: "hidden" } },
    orderBy: PROJECT_ORDER,
    take: FEATURED_COUNT,
    select: { id: true }
  });
  const ids = top.map((project) => project.id);

  await prisma.$transaction([
    prisma.project.updateMany({
      where: { id: { notIn: ids }, featured: true },
      data: { featured: false }
    }),
    prisma.project.updateMany({
      where: { id: { in: ids }, featured: false },
      data: { featured: true }
    })
  ]);
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
          : PROJECT_ORDER;

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
