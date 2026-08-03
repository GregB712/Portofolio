import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { ProjectTable } from "@/components/admin/ProjectTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProjectsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = single(params.q) ?? "";
  const status = single(params.status) ?? "";
  const featured = single(params.featured) ?? "";

  const projects = await prisma.project.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { repoName: { contains: q, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(status ? { status: status as never } : {}),
      ...(featured ? { featured: featured === "true" } : {})
    },
    orderBy: [{ priority: "asc" }, { updatedAt: "desc" }]
  });

  return (
    <>
      <AdminHeader title="Projects" subtitle="Create, edit, archive, reorder, hide, delete, and sync GitHub metadata." />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <form className="glass grid gap-3 rounded-lg p-3 sm:grid-cols-4 lg:min-w-[720px]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search"
            className="focus-ring h-10 rounded-md border border-[var(--line)] bg-white/5 px-3 text-sm"
          />
          <select
            name="status"
            defaultValue={status}
            className="focus-ring h-10 rounded-md border border-[var(--line)] bg-[var(--background)] px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="featured">Featured</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="hidden">Hidden</option>
            <option value="in_progress">In progress</option>
          </select>
          <select
            name="featured"
            defaultValue={featured}
            className="focus-ring h-10 rounded-md border border-[var(--line)] bg-[var(--background)] px-3 text-sm"
          >
            <option value="">Featured + non-featured</option>
            <option value="true">Featured only</option>
            <option value="false">Not featured</option>
          </select>
          <button className="focus-ring h-10 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-black">
            Filter
          </button>
        </form>
        <Link
          href="/admin/projects/new"
          className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-black"
        >
          <Plus size={16} /> New project
        </Link>
      </div>
      <ProjectTable projects={projects} />
    </>
  );
}
