import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { trackPageView } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CV",
  description: "Print-friendly web CV for Gregory Barmpas, Data Scientist and AI Engineer."
};

export default async function CvPage() {
  await trackPageView("/cv");

  return (
    <main className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="no-print mb-6 flex justify-end">
          <TrackedLink
            href={profile.cvPath}
            download
            eventName="cv_download"
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black"
          >
            <Download size={16} /> Download CV
          </TrackedLink>
        </div>
        <article className="glass-strong rounded-lg p-6 sm:p-10">
          <header className="border-b border-[var(--line)] pb-6">
            <Badge>{profile.location}</Badge>
            <h1 className="mt-4 text-4xl font-semibold">{profile.name}</h1>
            <p className="mt-2 text-lg text-[var(--muted)]">{profile.role}</p>
            <p className="mt-4 max-w-3xl leading-7">{profile.summary}</p>
            <p className="mt-4 text-sm text-[var(--muted)]">
              {profile.email} | github.com/GregB712 | linkedin.com/in/gbarmpas
            </p>
          </header>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">Experience</h2>
            <div className="mt-5 space-y-6">
              {experience.map((item) => (
                <div key={`${item.company}-${item.role}`}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <h3 className="font-semibold">
                      {item.role}, {item.company}
                    </h3>
                    <p className="text-sm text-[var(--muted)]">{item.dates}</p>
                  </div>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[var(--muted)]">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">Skills</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="font-semibold">{group.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {group.skills.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-semibold">Education</h2>
            <div className="mt-4 space-y-4">
              {education.map((item) => (
                <div key={item.degree} className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{item.degree}</h3>
                    <p className="text-sm text-[var(--muted)]">{item.school}</p>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{item.dates}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
