import { Clock, Mail } from "lucide-react";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

export function ContactSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-lg border border-[var(--line)] bg-[var(--foreground)] p-8 text-[var(--background)] shadow-2xl sm:p-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--background)]/60">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-semibold">Need AI systems shipped cleanly?</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[var(--background)]/70">
              Reach out for Data Science, AI Engineering, LLM application, retrieval, or forecasting roles.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--background)]/70">
              <Clock aria-hidden size={16} />
              {site.responseTimePromise}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href="/contact"
              eventName="page_view"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black"
            >
              <Mail size={16} /> Contact Gregory
            </TrackedLink>
            <CopyEmailButton
              email={profile.email}
              className="text-[var(--background)] border-[var(--background)]/30 hover:bg-[var(--background)]/10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
