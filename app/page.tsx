import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceTimeline } from "@/components/sections/ExperienceTimeline";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { HeroSection } from "@/components/sections/HeroSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { WhatIBuildSection } from "@/components/sections/WhatIBuildSection";
import { getFeaturedProjects } from "@/lib/projects";
import { trackPageView } from "@/lib/analytics";
import { getGitHubAvatarUrl } from "@/lib/github-profile";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, avatarUrl] = await Promise.all([
    getFeaturedProjects(6),
    getGitHubAvatarUrl(),
    trackPageView("/")
  ]);

  return (
    <main>
      <HeroSection avatarUrl={avatarUrl} />
      <AboutSection />
      <FeaturedProjects projects={projects} />
      <WhatIBuildSection />
      <SkillsSection />
      <ExperienceTimeline />
      <EducationSection />
      <ContactSection />
    </main>
  );
}
