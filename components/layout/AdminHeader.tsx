import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.18em] text-[var(--accent-2)]">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
        {subtitle ? <p className="mt-2 text-[var(--muted)]">{subtitle}</p> : null}
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </header>
  );
}
