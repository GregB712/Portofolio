import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { HeroSection } from "@/components/sections/HeroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { WhatIBuildSection } from "@/components/sections/WhatIBuildSection";
import { pageDescriptions } from "@/content/site";
import { getFeaturedProjects } from "@/lib/projects";
import { trackPageView } from "@/lib/analytics";
import { getLandingAvatarUrl } from "@/lib/github-profile";
import { getEducationEntries, getExperienceEntries, getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Data Scientist & AI Engineer",
  description: pageDescriptions.home
};

export default async function HomePage() {
  const [projects, avatarUrl, content, experience, education] = await Promise.all([
    getFeaturedProjects(6),
    getLandingAvatarUrl(),
    getSiteContent(),
    getExperienceEntries(),
    getEducationEntries(),
    trackPageView("/")
  ]);

  return (
    <main>
      <HeroSection avatarUrl={avatarUrl} content={content} />
      <AboutSection content={content} />
      <FeaturedProjects projects={projects} />
      <WhatIBuildSection />
      <SkillsSection />
      <ExperienceTimeline items={experience} />
      <EducationSection items={education} />
      <ContactSection />
    </main>
  );
}
