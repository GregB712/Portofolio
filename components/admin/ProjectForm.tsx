"use client";

import { useMemo, useState, useTransition } from "react";
import type { Project } from "@prisma/client";
import { Github, Loader2, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listGithubReposAction } from "@/lib/admin-actions";
import type { GithubRepoPrefill } from "@/lib/github";

type ProjectFormProps = {
  action: (formData: FormData) => Promise<void>;
  project?: Project | null;
  mode: "create" | "edit";
};

const TEXT_FIELDS = [
  "title",
  "slug",
  "repoName",
  "repoUrl",
  "deploymentUrl",
  "imageUrl",
  "priority",
  "primaryLanguage",
  "description",
  "longDescription",
  "problemSolved",
  "technicalHighlights",
  "tags",
  "category",
  "stars",
  "forks"
] as const;

type TextField = (typeof TEXT_FIELDS)[number];
type Values = Record<TextField, string>;

function value(project: Project | null | undefined, key: keyof Project) {
  const current = project?.[key];
  if (Array.isArray(current)) return current.join(", ");
  if (current instanceof Date) return current.toISOString();
  return current?.toString() ?? "";
}

function initialValues(project: Project | null | undefined): Values {
  const base = Object.fromEntries(
    TEXT_FIELDS.map((field) => [field, value(project, field as keyof Project)])
  ) as Values;
  if (!base.priority) base.priority = "100";
  return base;
}

export function ProjectForm({ action, project, mode }: ProjectFormProps) {
  const [values, setValues] = useState<Values>(() => initialValues(project));

  const set = (name: TextField, next: string) =>
    setValues((prev) => ({ ...prev, [name]: next }));

  const applyRepo = (repo: GithubRepoPrefill) =>
    setValues((prev) => ({
      ...prev,
      title: repo.title,
      slug: repo.slug,
      repoName: repo.repoName,
      repoUrl: repo.repoUrl,
      deploymentUrl: repo.deploymentUrl,
      primaryLanguage: repo.primaryLanguage,
      description: repo.description,
      stars: String(repo.stars),
      forks: String(repo.forks),
      tags: repo.tags.join(", ")
    }));

  return (
    <div className="grid gap-5">
      {mode === "create" ? <GithubImporter onSelect={applyRepo} /> : null}
      <form action={action} className="glass grid gap-5 rounded-lg p-5">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" name="title" value={values.title} onChange={set} required />
          <Field label="Slug" name="slug" value={values.slug} onChange={set} required />
          <Field label="Repo name" name="repoName" value={values.repoName} onChange={set} required />
          <Field label="Repo URL" name="repoUrl" value={values.repoUrl} onChange={set} required />
          <Field label="Deployment URL" name="deploymentUrl" value={values.deploymentUrl} onChange={set} />
          <Field label="Image URL" name="imageUrl" value={values.imageUrl} onChange={set} />
          <Field label="Priority" name="priority" type="number" value={values.priority} onChange={set} />
          <Field label="Primary language" name="primaryLanguage" value={values.primaryLanguage} onChange={set} />
        </div>
        <Field label="Short description" name="description" value={values.description} onChange={set} required />
        <TextArea label="Long description" name="longDescription" value={values.longDescription} onChange={set} />
        <TextArea label="Problem solved" name="problemSolved" value={values.problemSolved} onChange={set} />
        <TextArea
          label="Technical highlights"
          name="technicalHighlights"
          value={values.technicalHighlights}
          onChange={set}
          help="Comma-separated"
        />
        <Field label="Tags" name="tags" value={values.tags} onChange={set} help="Comma-separated" />
        <Field label="Categories" name="category" value={values.category} onChange={set} help="Comma-separated" />
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
          <Field label="Stars" name="stars" type="number" value={values.stars} onChange={set} />
          <Field label="Forks" name="forks" type="number" value={values.forks} onChange={set} />
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
    </div>
  );
}

function GithubImporter({ onSelect }: { onSelect: (repo: GithubRepoPrefill) => void }) {
  const [repos, setRepos] = useState<GithubRepoPrefill[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = () => {
    setError(null);
    startTransition(async () => {
      try {
        setRepos(await listGithubReposAction());
      } catch {
        setError("Could not load repositories from GitHub. Try again.");
      }
    });
  };

  const filtered = useMemo(() => {
    if (!repos) return [];
    const q = query.trim().toLowerCase();
    if (!q) return repos;
    return repos.filter(
      (repo) =>
        repo.repoName.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q)
    );
  }, [repos, query]);

  return (
    <div className="glass grid gap-4 rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Github size={16} aria-hidden /> Import from GitHub
          </span>
          <span className="text-xs text-[var(--muted)]">
            Load a public repository to auto-fill the fields below. You can edit everything after.
          </span>
        </div>
        <Button type="button" variant="secondary" onClick={load} disabled={isPending}>
          {isPending ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Github size={16} aria-hidden />}
          {repos ? "Refresh repositories" : "Load repositories"}
        </Button>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {repos ? (
        <div className="grid gap-3">
          <label className="relative text-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search repositories"
              className="focus-ring w-full rounded-md border border-[var(--line)] bg-white/5 py-3 pl-9 pr-3"
            />
          </label>
          <ul className="grid max-h-80 gap-1 overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <li className="px-1 py-2 text-sm text-[var(--muted)]">No repositories match.</li>
            ) : (
              filtered.map((repo) => (
                <li key={repo.repoName}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(repo);
                      setSelected(repo.repoName);
                    }}
                    aria-pressed={selected === repo.repoName}
                    className={`focus-ring grid w-full gap-1 rounded-md border px-3 py-2 text-left transition hover:bg-white/10 ${
                      selected === repo.repoName
                        ? "border-[var(--accent)] bg-white/10"
                        : "border-[var(--line)]"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3 text-sm font-medium">
                      {repo.repoName}
                      <span className="flex items-center gap-3 text-xs text-[var(--muted)]">
                        {repo.primaryLanguage ? <span>{repo.primaryLanguage}</span> : null}
                        <span className="flex items-center gap-1">
                          <Star size={12} aria-hidden /> {repo.stars}
                        </span>
                      </span>
                    </span>
                    {repo.description ? (
                      <span className="line-clamp-1 text-xs text-[var(--muted)]">{repo.description}</span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
          {selected ? (
            <p className="text-xs text-[var(--accent)]">
              Loaded <span className="font-semibold">{selected}</span> into the form. Review and adjust before saving.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  help,
  value,
  onChange,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  label: string;
  name: TextField;
  help?: string;
  value: string;
  onChange: (name: TextField, value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <input
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
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
  value,
  onChange
}: {
  label: string;
  name: TextField;
  help?: string;
  value: string;
  onChange: (name: TextField, value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <textarea
        name={name}
        rows={4}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
      />
      {help ? <span className="text-xs text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}
