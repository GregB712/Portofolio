import type { Metadata } from "next";
import { Mail, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { LinkButton } from "@/components/ui/button";
import { profile } from "@/content/profile";
import { pageDescriptions } from "@/content/site";
import { trackPageView } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: pageDescriptions.privacy
};

const policySections = [
  {
    title: "Contact form data",
    body:
      "When you submit the contact form, the site collects your name, email address, optional company, subject, message, and the page where the form was submitted."
  },
  {
    title: "Technical context",
    body:
      "To protect the form from abuse and understand site usage, the site may store a hashed IP address, browser user agent, referrer, country, device type, browser category, route, and basic interaction events. Raw IP addresses are not stored by the application."
  },
  {
    title: "How the data is used",
    body:
      "Contact details are used only to read, manage, and reply to your message. Submissions may be forwarded by email and reviewed in the private admin dashboard. Analytics are used to understand portfolio traffic and improve the site."
  },
  {
    title: "Sharing and retention",
    body:
      "Contact submissions are not sold. They may be processed by hosting, database, authentication, and email providers that support this portfolio. Messages are retained as long as needed for professional follow-up, administration, and abuse prevention."
  },
  {
    title: "Your choices",
    body:
      "You can request deletion of a contact submission or ask a privacy question by emailing Gregory directly."
  }
] as const;

export default async function PrivacyPage() {
  await trackPageView("/privacy");

  return (
    <main className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy" }]} className="mb-8" />

        <header className="glass-strong rounded-lg p-6 sm:p-10">
          <div className="grid h-12 w-12 place-items-center rounded-md border border-[var(--line)] bg-white/10">
            <ShieldCheck aria-hidden size={24} className="text-[var(--accent)]" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold sm:text-5xl">Privacy Policy</h1>
          <p className="mt-5 max-w-3xl leading-8 text-[var(--muted)]">
            This page explains what information is collected through the portfolio contact form and basic site
            analytics, why it is collected, and how it is used.
          </p>
        </header>

        <div className="mt-6 grid gap-5">
          {policySections.map((section) => (
            <section key={section.title} className="glass rounded-lg p-6">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="mt-3 leading-8 text-[var(--muted)]">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--foreground)] p-6 text-[var(--background)] sm:p-8">
          <h2 className="text-2xl font-semibold">Privacy contact</h2>
          <p className="mt-3 max-w-2xl leading-7 text-black/70 dark:text-white/70">
            For access, correction, deletion, or other privacy requests, contact Gregory at {profile.email}.
          </p>
          <LinkButton
            href={`mailto:${profile.email}`}
            className="mt-5 min-h-11 border-black/20 bg-[var(--accent)] px-5 py-3 text-black hover:brightness-110"
          >
            <Mail size={16} />
            Email Gregory
          </LinkButton>
        </section>
      </div>
    </main>
  );
}
