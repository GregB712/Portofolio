import { BrainCircuit, Boxes, LineChart, Rocket, Search, Workflow } from "lucide-react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile, recruiterHighlights } from "@/content/profile";

const icons = [LineChart, BrainCircuit, Search, Workflow, Rocket, Boxes];

export function AboutSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="About"
          title="A practical AI engineer who can ship the model, API, and product surface."
          description={profile.summary}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recruiterHighlights.map((highlight, index) => {
            const Icon = icons[index] ?? Rocket;
            return (
              <AnimatedCard key={highlight} delay={index * 0.04} className="p-5">
                <Icon className="mb-5 text-[var(--accent)]" size={24} />
                <p className="text-lg font-semibold">{highlight}</p>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
