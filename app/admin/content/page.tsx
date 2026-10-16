import type { EducationEntry, ExperienceEntry, SiteContent } from "@prisma/client";
import { EducationEntryForm } from "@/components/admin/EducationEntryForm";
import { ExperienceEntryForm } from "@/components/admin/ExperienceEntryForm";
import { SiteContentForm } from "@/components/admin/SiteContentForm";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { Button } from "@/components/ui/button";
import {
  createEducationAction,
  createExperienceAction,
  deleteEducationAction,
  deleteExperienceAction,
  seedContentDefaultsAction,
  updateEducationAction,
  updateExperienceAction,
  updateSiteContentAction
} from "@/lib/admin-actions";
import { prisma } from "@/lib/prisma";
import { siteContentDefaults, type SiteContentView } from "@/lib/site-content";

export const dynamic = "force-dynamic";

type ContentData = {
  siteContent: SiteContent | null;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  error: string | null;
};

async function getContent(): Promise<ContentData> {
  try {
    const [siteContent, experience, education] = await Promise.all([
      prisma.siteContent.findUnique({ where: { id: "main" } }),
      prisma.experienceEntry.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
      prisma.educationEntry.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
    ]);
    return { siteContent, experience, education, error: null };
  } catch {
    return {
      siteContent: null,
      experience: [],
      education: [],
      error:
        "The editable content tables are not available yet. Run `npx prisma migrate deploy` against the production Neon database, then redeploy or reload."
    };
  }
}

export default async function AdminContentPage() {
  const { siteContent, experience, education, error } = await getContent();

  const content: SiteContentView = siteContent
    ? {
        heroStatus: siteContent.heroStatus,
        heroName: siteContent.heroName,
        heroLocation: siteContent.heroLocation,
        heroTitle: siteContent.heroTitle,
        heroSubtitle: siteContent.heroSubtitle,
        aboutTitle: siteContent.aboutTitle,
        aboutSummary: siteContent.aboutSummary,
        aboutHighlights: siteContent.aboutHighlights
      }
    : siteContentDefaults;

  const needsImport = !error && (!siteContent || experience.length === 0 || education.length === 0);

  return (
    <>
      <AdminHeader
        title="Landing content"
        subtitle="Edit the hero, about, experience, and education content shown on the landing page and CV."
      />

      {error ? (
        <div className="glass mb-5 rounded-lg border border-[var(--accent-3)] p-4 text-sm leading-6 text-[var(--accent-3)]">
          {error}
        </div>
      ) : null}

      {needsImport ? (
        <section className="glass mb-5 rounded-lg p-5">
          <h2 className="text-lg font-semibold">Import current content</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Some sections have no saved entries yet, so the public site shows the built-in defaults. Import them here to start
            editing from the current content.
          </p>
          <form action={seedContentDefaultsAction} className="mt-4">
            <Button type="submit" variant="secondary">
              Import current content
            </Button>
          </form>
        </section>
      ) : null}

      <SiteContentForm action={updateSiteContentAction} content={content} />

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Experience</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Add, edit, or remove roles. Lower order shows first.</p>
          </div>
        </div>
        <div className="grid gap-5">
          {experience.map((entry) => (
            <ExperienceEntryForm
              key={entry.id}
              action={updateExperienceAction}
              deleteAction={deleteExperienceAction}
              entry={entry}
              mode="edit"
            />
          ))}
        </div>
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold">Add a role</h3>
          <ExperienceEntryForm action={createExperienceAction} mode="create" />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Education</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Add, edit, or remove education entries. Lower order shows first.</p>
          </div>
        </div>
        <div className="grid gap-5">
          {education.map((entry) => (
            <EducationEntryForm
              key={entry.id}
              action={updateEducationAction}
              deleteAction={deleteEducationAction}
              entry={entry}
              mode="edit"
            />
          ))}
        </div>
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold">Add education</h3>
          <EducationEntryForm action={createEducationAction} mode="create" />
        </div>
      </section>
    </>
  );
}
