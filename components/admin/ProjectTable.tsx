import { Archive, EyeOff, Pencil, RefreshCw, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Project } from "@prisma/client";
import {
  deleteProjectAction,
  reorderProjectAction,
  setProjectStatusAction,
  syncProjectGithubAction,
  toggleProjectFeaturedAction
} from "@/lib/admin-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProjectTable({ projects }: { projects: Project[] }) {
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
                <p>{project.viewCount} views</p>
                <p>{project.githubClickCount} repo clicks</p>
                <p>{project.demoClickCount} demo clicks</p>
              </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-[var(--line)] px-3"
                  >
                    <Pencil size={14} /> Edit
                  </Link>
                  <form action={toggleProjectFeaturedAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="featured" value={String(project.featured)} />
                    <Button className="h-9 px-3" type="submit">
                      <Star size={14} /> Toggle
                    </Button>
                  </form>
                  <form action={syncProjectGithubAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <Button className="h-9 px-3" type="submit">
                      <RefreshCw size={14} /> Sync
                    </Button>
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
                  <form action={deleteProjectAction}>
                    <input type="hidden" name="id" value={project.id} />
                    <Button className="h-9 px-3" variant="danger" type="submit">
                      <Trash2 size={14} /> Delete
                    </Button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
