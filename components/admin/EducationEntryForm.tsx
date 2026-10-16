import { Trash2 } from "lucide-react";
import type { EducationEntry } from "@prisma/client";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";

type EducationEntryFormProps = {
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  entry?: EducationEntry | null;
  mode: "create" | "edit";
};

export function EducationEntryForm({ action, deleteAction, entry, mode }: EducationEntryFormProps) {
  return (
    <div className="glass rounded-lg p-5">
      <form action={action} className="grid gap-4">
        {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
        <Field label="Degree" name="degree" defaultValue={entry?.degree ?? ""} required />
        <Field label="School" name="school" defaultValue={entry?.school ?? ""} required />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Dates" name="dates" defaultValue={entry?.dates ?? ""} required help="e.g. Oct 2021 - Sep 2024" />
          <Field
            label="Order"
            name="sortOrder"
            type="number"
            defaultValue={String(entry?.sortOrder ?? 100)}
            help="Lower shows first"
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton variant="primary">
            {mode === "create" ? "Add education" : "Save education"}
          </SubmitButton>
        </div>
      </form>
      {mode === "edit" && entry && deleteAction ? (
        <form action={deleteAction} className="mt-3 flex justify-end border-t border-[var(--line)] pt-3">
          <input type="hidden" name="id" value={entry.id} />
          <Button type="submit" variant="danger" className="h-9 px-3">
            <Trash2 size={14} /> Delete education
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
