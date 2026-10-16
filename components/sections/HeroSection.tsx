import { ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import type { SiteContentView } from "@/lib/site-content";

const nodes = [
  ["12%", "24%"],
  ["78%", "18%"],
  ["52%", "44%"],
  ["18%", "78%"],
  ["86%", "72%"],
  ["44%", "84%"]
];

const githubSocial = socials.find((social) => social.label === "GitHub") ?? socials[0];

export function HeroSection({
  avatarUrl,
  content
}: {
  avatarUrl: string;
  content: SiteContentView;
}) {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="ai-field" aria-hidden>
        {nodes.map(([left, top], index) => (
          <span key={`${left}-${top}`} style={{ left, top, animationDelay: `${index * 0.4}s` }} />
        ))}
      </div>
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className="border-[var(--accent)] bg-[var(--accent)]/10">
              {content.heroStatus}
            </Badge>
            <span className="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
              <MapPin size={16} /> {content.heroLocation}
            </span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent-2)]">
            {content.heroName}
          </p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            {content.heroTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
            {content.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedLink
              href="/projects"
              eventName="page_view"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
            >
              View Projects <ArrowRight size={16} />
            </TrackedLink>
            <TrackedLink
              href={profile.cvPath}
              download
              eventName="cv_download"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--line)] px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              <Download size={16} /> Download CV
            </TrackedLink>
            <TrackedLink
              href="/contact"
              eventName="page_view"
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-[var(--line)] px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              <Mail size={16} /> Contact Me
            </TrackedLink>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {socials.slice(0, 2).map((social) => {
              const Icon = social.icon;
              return (
                <TrackedLink
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  eventName={social.eventName}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
                >
                  {social.label === "GitHub" ? <Github size={16} /> : <Linkedin size={16} />}
                  <Icon className="hidden" size={0} />
                  {social.label}
                </TrackedLink>
              );
            })}
            <CopyEmailButton email={profile.email} />
          </div>
        </div>
        <div className="glass-strong relative rounded-lg p-4">
          <div className="absolute -right-4 -top-4 rounded-md border border-[var(--accent)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--accent)]">
            AI systems portfolio
          </div>
          <TrackedLink
            href={githubSocial.href}
            target="_blank"
            eventName={githubSocial.eventName}
            aria-label="Open Gregory Barmpas on GitHub"
            className="group relative block aspect-[4/5] overflow-hidden rounded-md border border-[var(--line)] bg-black transition duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_0_1px_var(--accent),0_22px_60px_rgba(33,215,166,0.22)]"
          >
            <Image
              src={avatarUrl}
              alt="Gregory Barmpas GitHub avatar"
              fill
              priority
              sizes="(min-width: 1024px) 36vw, 90vw"
              className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-100"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[var(--accent)]/0 mix-blend-screen transition duration-300 group-hover:bg-[var(--accent)]/20"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-4 right-4 grid size-11 translate-y-2 place-items-center rounded-full border border-[var(--accent)] bg-black/75 text-[var(--accent)] opacity-0 shadow-[0_0_28px_rgba(33,215,166,0.35)] backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <Github size={20} />
            </span>
          </TrackedLink>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {["RAG", "Forecasting", "LLM Apps"].map((item) => (
              <div key={item} className="rounded-md border border-[var(--line)] bg-white/5 px-2 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
