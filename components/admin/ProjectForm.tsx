import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";

type ProjectFormProps = {
  action: (formData: FormData) => Promise<void>;
  project?: Project | null;
  mode: "create" | "edit";
};

function value(project: Project | null | undefined, key: keyof Project) {
  const current = project?.[key];
  if (Array.isArray(current)) return current.join(", ");
  if (current instanceof Date) return current.toISOString();
  return current?.toString() ?? "";
}

export function ProjectForm({ action, project, mode }: ProjectFormProps) {
  return (
    <form action={action} className="glass grid gap-5 rounded-lg p-5">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={value(project, "title")} required />
        <Field label="Slug" name="slug" defaultValue={value(project, "slug")} required />
        <Field label="Repo name" name="repoName" defaultValue={value(project, "repoName")} required />
        <Field label="Repo URL" name="repoUrl" defaultValue={value(project, "repoUrl")} required />
        <Field label="Deployment URL" name="deploymentUrl" defaultValue={value(project, "deploymentUrl")} />
        <Field label="Image URL" name="imageUrl" defaultValue={value(project, "imageUrl")} />
        <Field label="Priority" name="priority" type="number" defaultValue={value(project, "priority") || "100"} />
        <Field label="Primary language" name="primaryLanguage" defaultValue={value(project, "primaryLanguage")} />
      </div>
      <Field label="Short description" name="description" defaultValue={value(project, "description")} required />
      <TextArea label="Long description" name="longDescription" defaultValue={value(project, "longDescription")} />
      <TextArea label="Problem solved" name="problemSolved" defaultValue={value(project, "problemSolved")} />
      <TextArea
        label="Technical highlights"
        name="technicalHighlights"
        defaultValue={value(project, "technicalHighlights")}
        help="Comma-separated"
      />
      <Field label="Tags" name="tags" defaultValue={value(project, "tags")} help="Comma-separated" />
      <Field label="Categories" name="category" defaultValue={value(project, "category")} help="Comma-separated" />
      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2 text-sm">
          Status
          <select
            name="status"
            defaultValue={project?.status ?? "active"}
            className="focus-ring h-11 rounded-md border border-[var(--line)] bg-[var(--background)] px-3"
          >
            <option value="featured">Featured</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="hidden">Hidden</option>
            <option value="in_progress">In progress</option>
          </select>
        </label>
        <Field label="Stars" name="stars" type="number" defaultValue={value(project, "stars")} />
        <Field label="Forks" name="forks" type="number" defaultValue={value(project, "forks")} />
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} />
        Featured on homepage
      </label>
      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          {mode === "create" ? "Create project" : "Save project"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  help,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  help?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <input
        name={name}
        className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
        {...props}
      />
      {help ? <span className="text-xs text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}

function TextArea({
  label,
  name,
  help,
  defaultValue
}: {
  label: string;
  name: string;
  help?: string;
  defaultValue?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <textarea
        name={name}
        rows={4}
        defaultValue={defaultValue}
        className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
      />
      {help ? <span className="text-xs text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}
