import { Bot, DatabaseZap, LineChart, SearchCheck } from "lucide-react";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whatIBuild } from "@/content/profile";

const icons = [SearchCheck, Bot, LineChart, DatabaseZap];

export function WhatIBuildSection() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What I Build"
          title="Business-facing AI systems with production constraints in mind."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {whatIBuild.map((item, index) => {
            const Icon = icons[index] ?? Bot;
            return (
              <AnimatedCard key={item.title} delay={index * 0.05} className="p-6">
                <Icon className="mb-6 text-[var(--accent-2)]" size={28} />
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{item.description}</p>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
