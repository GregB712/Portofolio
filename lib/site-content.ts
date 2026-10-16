import { education as educationDefaults } from "@/content/education";
import { experience as experienceDefaults } from "@/content/experience";
import { profile, recruiterHighlights } from "@/content/profile";
import { prisma } from "@/lib/prisma";

export type SiteContentView = {
  heroStatus: string;
  heroName: string;
  heroLocation: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutSummary: string;
  aboutHighlights: string[];
};

export type ExperienceView = {
  id: string;
  role: string;
  company: string;
  dates: string;
  current: boolean;
  bullets: string[];
};

export type EducationView = {
  id: string;
  degree: string;
  school: string;
  dates: string;
};

export const siteContentDefaults: SiteContentView = {
  heroStatus: profile.status,
  heroName: profile.name,
  heroLocation: profile.location,
  heroTitle: profile.headline,
  heroSubtitle: profile.subheadline,
  aboutTitle: "A practical AI engineer who can ship the model, API, and product surface.",
  aboutSummary: profile.summary,
  aboutHighlights: [...recruiterHighlights]
};

export const experienceDefaultsView: ExperienceView[] = experienceDefaults.map((item, index) => ({
  id: `static-${index}`,
  role: item.role,
  company: item.company,
  dates: item.dates,
  current: item.current,
  bullets: [...item.bullets]
}));

export const educationDefaultsView: EducationView[] = educationDefaults.map((item, index) => ({
  id: `static-${index}`,
  degree: item.degree,
  school: item.school,
  dates: item.dates
}));

export async function getSiteContent(): Promise<SiteContentView> {
  try {
    const row = await prisma.siteContent.findUnique({ where: { id: "main" } });
    if (!row) return siteContentDefaults;
    return {
      heroStatus: row.heroStatus,
      heroName: row.heroName,
      heroLocation: row.heroLocation,
      heroTitle: row.heroTitle,
      heroSubtitle: row.heroSubtitle,
      aboutTitle: row.aboutTitle,
      aboutSummary: row.aboutSummary,
      aboutHighlights: row.aboutHighlights
    };
  } catch {
    return siteContentDefaults;
  }
}

export async function getExperienceEntries(): Promise<ExperienceView[]> {
  try {
    const rows = await prisma.experienceEntry.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });
    if (rows.length === 0) return experienceDefaultsView;
    return rows.map((row) => ({
      id: row.id,
      role: row.role,
      company: row.company,
      dates: row.dates,
      current: row.current,
      bullets: row.bullets
    }));
  } catch {
    return experienceDefaultsView;
  }
}

export async function getEducationEntries(): Promise<EducationView[]> {
  try {
    const rows = await prisma.educationEntry.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
    });
    if (rows.length === 0) return educationDefaultsView;
    return rows.map((row) => ({
      id: row.id,
      degree: row.degree,
      school: row.school,
      dates: row.dates
    }));
  } catch {
    return educationDefaultsView;
  }
}
