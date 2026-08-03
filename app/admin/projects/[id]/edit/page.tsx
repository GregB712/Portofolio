import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { updateProjectAction } from "@/lib/admin-actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <AdminHeader title={`Edit ${project.title}`} subtitle="Update recruiter-facing project content and metadata." />
      <ProjectForm action={updateProjectAction} project={project} mode="edit" />
    </>
  );
}
