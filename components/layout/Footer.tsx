import Link from "next/link";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { TrackedLink } from "@/components/ui/TrackedLink";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[var(--muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <p className="font-medium text-[var(--foreground)]">{profile.name}</p>
          <p>Production ML, RAG, LLM applications, and forecasting systems.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/projects" className="focus-ring rounded-sm hover:text-[var(--foreground)]">
            Projects
          </Link>
          <Link href="/cv" className="focus-ring rounded-sm hover:text-[var(--foreground)]">
            CV
          </Link>
          {socials.slice(0, 2).map((social) => (
            <TrackedLink
              key={social.href}
              href={social.href}
              target="_blank"
              eventName={social.eventName}
              className="rounded-sm hover:text-[var(--foreground)]"
            >
              {social.label}
            </TrackedLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
