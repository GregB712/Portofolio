import Link from "next/link";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { DashboardCards } from "@/components/admin/DashboardCards";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { analyticsSince } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function groupVisitsByDay(items: { createdAt: Date }[]) {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = item.createdAt.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map, ([date, visits]) => ({ date, visits })).sort((a, b) => a.date.localeCompare(b.date));
}

function countBy<T extends string>(items: T[]) {
  const map = new Map<T, number>();
  for (const item of items) map.set(item, (map.get(item) ?? 0) + 1);
  return Array.from(map, ([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
}

export default async function AdminAnalyticsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const range = (single(params.range) ?? "30d") as "today" | "7d" | "30d" | "all";
  const since = await analyticsSince(range);
  const where = since ? { createdAt: { gte: since } } : {};

  const [pageViews, events, projects, contactCount] = await Promise.all([
    prisma.pageView.findMany({ where, orderBy: { createdAt: "asc" } }),
    prisma.analyticsEvent.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.project.findMany({ orderBy: { viewCount: "desc" }, take: 8 }),
    prisma.contactSubmission.count({ where })
  ]);

  const pageCounts = countBy(pageViews.map((view) => view.path)).map((item) => ({
    path: item.key,
    views: item.count
  }));
  const eventCounts = countBy(events.map((event) => event.eventName)).map((item) => ({
    eventName: item.key,
    count: item.count
  }));
  const contactConversion =
    pageViews.length > 0 ? `${Math.round((contactCount / pageViews.length) * 1000) / 10}%` : "0%";

  return (
    <>
      <AdminHeader title="Analytics" subtitle="Privacy-friendly portfolio events without storing raw IP addresses." />
      <div className="mb-5 flex flex-wrap gap-2">
        {[
          ["today", "Today"],
          ["7d", "Last 7 days"],
          ["30d", "Last 30 days"],
          ["all", "All time"]
        ].map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/analytics?range=${value}`}
            className="focus-ring rounded-md border border-[var(--line)] px-3 py-2 text-sm hover:bg-white/10"
          >
            {label}
          </Link>
        ))}
      </div>
      <DashboardCards
        cards={[
          { label: "Visits", value: pageViews.length, accent: true },
          { label: "Project views", value: events.filter((event) => event.eventName === "project_view").length },
          { label: "CV downloads", value: events.filter((event) => event.eventName === "cv_download").length },
          { label: "Contact conversion", value: contactConversion }
        ]}
      />
      <div className="mt-6">
        <AnalyticsCharts visits={groupVisitsByDay(pageViews)} pages={pageCounts.slice(0, 8)} events={eventCounts.slice(0, 8)} />
      </div>
      <section className="glass mt-6 rounded-lg p-5">
        <h2 className="text-xl font-semibold">Project interaction ranking</h2>
        <div className="mt-4 grid gap-3">
          {projects.map((project) => (
            <div key={project.id} className="grid gap-2 border-b border-[var(--line)] pb-3 last:border-0 md:grid-cols-[1fr_auto_auto_auto]">
              <span>{project.title}</span>
              <span className="text-sm text-[var(--muted)]">{project.viewCount} views</span>
              <span className="text-sm text-[var(--muted)]">{project.githubClickCount} repo clicks</span>
              <span className="text-sm text-[var(--muted)]">{project.demoClickCount} demo clicks</span>
            </div>
          ))}
        </div>
      </section>
      <section className="glass mt-6 overflow-x-auto rounded-lg">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[var(--line)] text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            <tr>
              <th className="p-4">Event</th>
              <th className="p-4">Path</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {events.slice(0, 40).map((event) => (
              <tr key={event.id} className="border-b border-[var(--line)] last:border-0">
                <td className="p-4">{event.eventName}</td>
                <td className="p-4 text-[var(--muted)]">{event.path}</td>
                <td className="p-4 text-[var(--muted)]">{formatDate(event.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
