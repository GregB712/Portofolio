"use client";

import { Trash2 } from "lucide-react";
import { deleteProjectAction } from "@/lib/admin-actions";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteProjectAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="danger" className="h-9 px-3">
        <Trash2 size={14} /> Delete
      </SubmitButton>
    </form>
  );
}
