import { AdminHeader } from "@/components/layout/AdminHeader";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function startOfDay() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export default async function AdminDashboardPage() {
  const today = startOfDay();
  const week = new Date();
  week.setDate(week.getDate() - 7);
  const month = new Date();
  month.setDate(month.getDate() - 30);

  const [
    totalVisits,
    visitsToday,
    visitsWeek,
    visitsMonth,
    contactSubmissions,
    unreadMessages,
    cvDownloads,
    githubClicks,
    demoClicks,
    mostViewedProjects
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: today } } }),
    prisma.pageView.count({ where: { createdAt: { gte: week } } }),
    prisma.pageView.count({ where: { createdAt: { gte: month } } }),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "new" } }),
    prisma.analyticsEvent.count({ where: { eventName: "cv_download" } }),
    prisma.analyticsEvent.count({ where: { eventName: "project_github_click" } }),
    prisma.analyticsEvent.count({ where: { eventName: "project_demo_click" } }),
    prisma.project.findMany({ orderBy: { viewCount: "desc" }, take: 5 })
  ]);

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="Portfolio performance and recruiter interaction overview." />
      <DashboardCards
        cards={[
          { label: "Total visits", value: totalVisits, accent: true },
          { label: "Visits today", value: visitsToday },
          { label: "Visits this week", value: visitsWeek },
          { label: "Visits this month", value: visitsMonth },
          { label: "GitHub clicks", value: githubClicks },
          { label: "Demo clicks", value: demoClicks },
          { label: "CV downloads", value: cvDownloads },
          { label: "Contact submissions", value: contactSubmissions },
          { label: "Unread messages", value: unreadMessages, accent: unreadMessages > 0 }
        ]}
      />
      <section className="glass mt-6 rounded-lg p-5">
        <h2 className="text-xl font-semibold">Most viewed projects</h2>
        <div className="mt-4 grid gap-3">
          {mostViewedProjects.map((project) => (
            <div key={project.id} className="flex items-center justify-between border-b border-[var(--line)] pb-3 last:border-0">
              <span>{project.title}</span>
              <span className="text-sm text-[var(--muted)]">{project.viewCount} views</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
