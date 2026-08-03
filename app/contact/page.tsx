import type { Metadata } from "next";
import { Github, Linkedin, Mail } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { profile } from "@/content/profile";
import { trackPageView } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Gregory Barmpas for AI Engineering, Data Science, LLM, RAG, forecasting, and production ML opportunities."
};

export default async function ContactPage() {
  await trackPageView("/contact");

  return (
    <main className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section>
          <h1 className="text-4xl font-semibold sm:text-5xl">Contact Gregory</h1>
          <p className="mt-5 leading-7 text-[var(--muted)]">
            For AI/Data Science roles, LLM application work, RAG systems, forecasting pipelines, or technical discussions.
          </p>
          <div className="mt-8 grid gap-3">
            <TrackedLink
              href={`mailto:${profile.email}`}
              eventName="email_click"
              className="glass inline-flex items-center gap-3 rounded-lg p-4"
            >
              <Mail size={18} /> {profile.email}
            </TrackedLink>
            <TrackedLink
              href="https://github.com/GregB712"
              target="_blank"
              eventName="github_profile_click"
              className="glass inline-flex items-center gap-3 rounded-lg p-4"
            >
              <Github size={18} /> GitHub
            </TrackedLink>
            <TrackedLink
              href="https://www.linkedin.com/in/gbarmpas/"
              target="_blank"
              eventName="linkedin_click"
              className="glass inline-flex items-center gap-3 rounded-lg p-4"
            >
              <Linkedin size={18} /> LinkedIn
            </TrackedLink>
            <CopyEmailButton email={profile.email} />
          </div>
        </section>
        <ContactForm sourcePage="/contact" />
      </div>
    </main>
  );
}
