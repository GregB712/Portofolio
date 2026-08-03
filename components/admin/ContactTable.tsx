import { Archive, CheckCheck, MailOpen, Reply, ShieldAlert, Trash2 } from "lucide-react";
import type { ContactSubmission } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteContactAction, setContactStatusAction } from "@/lib/admin-actions";
import { formatDate } from "@/lib/utils";

export function ContactTable({ messages }: { messages: ContactSubmission[] }) {
  return (
    <div className="grid gap-4">
      {messages.map((message) => (
        <article key={message.id} className="glass rounded-lg p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{message.status}</Badge>
                <p className="text-xs text-[var(--muted)]">{formatDate(message.createdAt)}</p>
              </div>
              <h2 className="mt-3 text-xl font-semibold">{message.subject}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {message.name} | {message.email}
                {message.company ? ` | ${message.company}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                ["read", MailOpen],
                ["replied", Reply],
                ["archived", Archive],
                ["spam", ShieldAlert],
                ["new", CheckCheck]
              ].map(([status, Icon]) => (
                <form key={status as string} action={setContactStatusAction}>
                  <input type="hidden" name="id" value={message.id} />
                  <input type="hidden" name="status" value={status as string} />
                  <Button className="h-9 px-3" type="submit">
                    <Icon size={14} /> {status as string}
                  </Button>
                </form>
              ))}
              <form action={deleteContactAction}>
                <input type="hidden" name="id" value={message.id} />
                <Button className="h-9 px-3" type="submit" variant="danger">
                  <Trash2 size={14} /> Delete
                </Button>
              </form>
            </div>
          </div>
          <p className="mt-5 whitespace-pre-wrap rounded-md border border-[var(--line)] bg-white/5 p-4 text-sm leading-7 text-[var(--muted)]">
            {message.message}
          </p>
        </article>
      ))}
    </div>
  );
}
