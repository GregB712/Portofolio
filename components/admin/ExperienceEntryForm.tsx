import { Trash2 } from "lucide-react";
import type { ExperienceEntry } from "@prisma/client";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";

type ExperienceEntryFormProps = {
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  entry?: ExperienceEntry | null;
  mode: "create" | "edit";
};

export function ExperienceEntryForm({ action, deleteAction, entry, mode }: ExperienceEntryFormProps) {
  return (
    <div className="glass rounded-lg p-5">
      <form action={action} className="grid gap-4">
        {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Role" name="role" defaultValue={entry?.role ?? ""} required />
          <Field label="Company" name="company" defaultValue={entry?.company ?? ""} required />
          <Field label="Dates" name="dates" defaultValue={entry?.dates ?? ""} required help="e.g. Sep 2025 - Current" />
          <Field
            label="Order"
            name="sortOrder"
            type="number"
            defaultValue={String(entry?.sortOrder ?? 100)}
            help="Lower shows first"
          />
        </div>
        <TextArea
          label="Bullets"
          name="bullets"
          defaultValue={entry?.bullets.join("\n") ?? ""}
          rows={6}
          help="One per line"
        />
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="current" defaultChecked={entry?.current ?? false} />
          Current role
        </label>
        <div className="flex justify-end">
          <SubmitButton variant="primary">
            {mode === "create" ? "Add role" : "Save role"}
          </SubmitButton>
        </div>
      </form>
      {mode === "edit" && entry && deleteAction ? (
        <form action={deleteAction} className="mt-3 flex justify-end border-t border-[var(--line)] pt-3">
          <input type="hidden" name="id" value={entry.id} />
          <Button type="submit" variant="danger" className="h-9 px-3">
            <Trash2 size={14} /> Delete role
          </Button>
        </form>
      ) : null}
    </div>
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
  defaultValue,
  rows = 4
}: {
  label: string;
  name: string;
  help?: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2 text-sm">
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
      />
      {help ? <span className="text-xs text-[var(--muted)]">{help}</span> : null}
    </label>
  );
}
