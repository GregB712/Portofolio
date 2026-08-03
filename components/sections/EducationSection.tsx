import { GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education } from "@/content/education";

export function EducationSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Education" title="Computer science depth with data and web science focus." />
        <div className="grid gap-5 md:grid-cols-3">
          {education.map((item) => (
            <article key={item.degree} className="glass rounded-lg p-5">
              <GraduationCap className="mb-5 text-[var(--accent-3)]" size={26} />
              <h3 className="text-lg font-semibold">{item.degree}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.school}</p>
              <p className="mt-4 text-sm text-[var(--accent)]">{item.dates}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
