import { ProjectForm } from "@/components/admin/ProjectForm";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { createProjectAction } from "@/lib/admin-actions";

export default function NewProjectPage() {
  return (
    <>
      <AdminHeader title="New project" subtitle="Create a project that can appear in the public database-backed showcase." />
      <ProjectForm action={createProjectAction} mode="create" />
    </>
  );
}
