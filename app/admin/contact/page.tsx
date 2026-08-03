import { AdminHeader } from "@/components/layout/AdminHeader";
import { ContactTable } from "@/components/admin/ContactTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminContactPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = single(params.q) ?? "";
  const status = single(params.status) ?? "";

  const messages = await prisma.contactSubmission.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { company: { contains: q, mode: "insensitive" as const } },
              { subject: { contains: q, mode: "insensitive" as const } }
            ]
          }
        : {}),
      ...(status ? { status: status as never } : {})
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <AdminHeader title="Contact messages" subtitle="Review, search, reply-state, archive, spam, or delete stored submissions." />
      <form className="glass mb-5 grid gap-3 rounded-lg p-3 sm:grid-cols-[1fr_220px_auto]">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name, email, company, subject"
          className="focus-ring h-10 rounded-md border border-[var(--line)] bg-white/5 px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="focus-ring h-10 rounded-md border border-[var(--line)] bg-[var(--background)] px-3 text-sm"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
          <option value="spam">Spam</option>
        </select>
        <button className="focus-ring h-10 rounded-md bg-[var(--accent)] px-4 text-sm font-semibold text-black">
          Filter
        </button>
      </form>
      <ContactTable messages={messages} />
    </>
  );
}
