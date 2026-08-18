import type { Metadata } from "next";
import { CheckCircle2, Clock, FolderGit2, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LinkButton } from "@/components/ui/button";
import { pageDescriptions, site } from "@/content/site";
import { trackPageView } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thank You",
  description: pageDescriptions.thankYou,
  robots: {
    index: false,
    follow: true
  }
};

export default async function ThankYouPage() {
  await trackPageView("/thank-you");

  return (
    <main className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs items={[{ label: "Thank You", href: "/thank-you" }]} className="mb-8" />

        <section className="glass-strong overflow-hidden rounded-lg">
          <div className="h-1 bg-gradient-to-r from-[var(--accent-2)] via-[var(--accent)] to-[var(--accent-3)]" />
          <div className="p-6 sm:p-10">
            <div className="grid h-14 w-14 place-items-center rounded-md border border-[var(--line)] bg-white/10">
              <CheckCircle2 aria-hidden size={28} className="text-[var(--accent)]" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">Thank you for reaching out.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Your message has been received and forwarded. I will review the details and reply through the email
              address you provided.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-white/5 px-3 py-2 text-sm font-semibold">
              <Clock aria-hidden size={16} className="text-[var(--accent)]" />
              {site.responseTimePromise}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/projects" variant="primary" className="min-h-11 px-5 py-3">
                <FolderGit2 size={16} />
                View projects
              </LinkButton>
              <LinkButton href="/contact" className="min-h-11 px-5 py-3">
                <Mail size={16} />
                Send another message
              </LinkButton>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
