import { AdminHeader } from "@/components/layout/AdminHeader";
import { Badge } from "@/components/ui/badge";

const requiredEnv = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "GITHUB_ID",
  "GITHUB_SECRET",
  "ADMIN_EMAIL",
  "RESEND_API_KEY",
  "CONTACT_TO_EMAIL",
  "GITHUB_TOKEN"
];

export default function AdminSettingsPage() {
  return (
    <>
      <AdminHeader title="Settings" subtitle="Deployment readiness checklist for Vercel, Neon, Auth.js, Resend, and GitHub sync." />
      <section className="glass rounded-lg p-5">
        <h2 className="text-xl font-semibold">Environment</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {requiredEnv.map((key) => (
            <div key={key} className="flex items-center justify-between rounded-md border border-[var(--line)] p-3">
              <code className="text-sm">{key}</code>
              <Badge className={process.env[key] ? "border-[var(--accent)]" : ""}>
                {process.env[key] ? "configured" : "missing"}
              </Badge>
            </div>
          ))}
        </div>
      </section>
      <section className="glass mt-5 rounded-lg p-5">
        <h2 className="text-xl font-semibold">Operational notes</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
          <li>Run Prisma migrations against Neon before deploying the public site.</li>
          <li>Seed projects with the provided script, then refine copy in the admin dashboard.</li>
          <li>Use a GitHub token for higher sync rate limits.</li>
          <li>Resend forwarding requires a verified sender domain for production delivery.</li>
          <li>Analytics hash IPs and store event/page metadata without retaining raw addresses.</li>
        </ul>
      </section>
    </>
  );
}
