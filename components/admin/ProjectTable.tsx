import { Archive, EyeOff, Pencil, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { Project } from "@prisma/client";
import {
  reorderProjectAction,
  setProjectStatusAction,
  syncProjectGithubAction
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { formatDate } from "@/lib/utils";

export function ProjectTable({ projects }: { projects: Project[] }) {
  // Position as a guest sees it on /projects (hidden projects excluded).
  const guestPosition = new Map(
    projects.filter((project) => project.status !== "hidden").map((project, index) => [project.id, index + 1])
  );

  return (
    <div className="glass overflow-x-auto rounded-lg">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="border-b border-[var(--line)] text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          <tr>
            <th className="p-4">Project</th>
            <th className="p-4">Status</th>
            <th className="p-4">Priority</th>
            <th className="p-4">Stats</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-[var(--line)] align-top last:border-0">
              <td className="p-4">
                <p className="font-semibold">{project.title}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">{project.repoName}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </td>
              <td className="p-4">
                <Badge>{project.status}</Badge>
                {project.featured ? <Badge className="ml-2 border-[var(--accent)]">featured</Badge> : null}
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {guestPosition.has(project.id) ? `#${guestPosition.get(project.id)} for guests` : "Not shown to guests"}
                </p>
              </td>
              <td className="p-4">
                <form action={reorderProjectAction} className="flex gap-2">
                  <input type="hidden" name="id" value={project.id} />
                  <input
                    name="priority"
                    type="number"
                    defaultValue={project.priority}
                    className="focus-ring h-9 w-20 rounded-md border border-[var(--line)] bg-white/5 px-2"
                  />
                  <Button className="h-9 px-3" type="submit">
                    Save
                  </Button>
                </form>
              </td>
              <td className="p-4 text-xs text-[var(--muted)]">
                <p className="mb-1 font-semibold uppercase tracking-[0.14em]">Site</p>
                <p>{project.viewCount} page views</p>
                <p>{project.githubClickCount} repo clicks</p>
                <p>{project.demoClickCount} demo clicks</p>
                <p className="mb-1 mt-3 font-semibold uppercase tracking-[0.14em]">GitHub</p>
                <p>{project.stars ?? "–"} stars</p>
                <p>{project.forks ?? "–"} forks</p>
                <p>{project.watchers ?? "–"} watchers</p>
                <p>{project.githubUpdatedAt ? `updated ${formatDate(project.githubUpdatedAt)}` : "never synced"}</p>
              </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-[var(--line)] px-3"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                  <form action={syncProjectGithubAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <SubmitButton variant="secondary" className="h-9 px-3">
                      <RefreshCw size={14} /> Sync
                    </SubmitButton>
                  </form>
                  <form action={setProjectStatusAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="status" value="archived" />
                    <Button className="h-9 px-3" type="submit">
                      <Archive size={14} /> Archive
                    </Button>
                  </form>
                  <form action={setProjectStatusAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="status" value="hidden" />
                    <Button className="h-9 px-3" type="submit">
                      <EyeOff size={14} /> Hide
                    </Button>
                  </form>
                  <DeleteProjectButton id={project.id} title={project.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
