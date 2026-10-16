import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineItem } from "@/components/ui/TimelineItem";
import type { ExperienceView } from "@/lib/site-content";

export function ExperienceTimeline({ items }: { items: ExperienceView[] }) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Experience"
          title="Machine learning, forecasting, and GenAI delivery across production teams."
        />
        <div className="space-y-6">
          {items.map((item) => (
            <TimelineItem
              key={item.id}
              title={item.role}
              subtitle={item.company}
              dates={item.dates}
              current={item.current}
              bullets={item.bullets}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
