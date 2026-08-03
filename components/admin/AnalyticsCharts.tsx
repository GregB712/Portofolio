"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function AnalyticsCharts({
  visits,
  pages,
  events
}: {
  visits: { date: string; visits: number }[];
  pages: { path: string; views: number }[];
  events: { eventName: string; count: number }[];
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartPanel title="Visits over time">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={visits}>
            <defs>
              <linearGradient id="visits" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#d6f65d" stopOpacity={0.75} />
                <stop offset="95%" stopColor="#d6f65d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#101312", border: "1px solid rgba(255,255,255,.14)" }} />
            <Area type="monotone" dataKey="visits" stroke="#d6f65d" fill="url(#visits)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartPanel>
      <ChartPanel title="Most visited pages">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={pages}>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="path" tick={{ fill: "var(--muted)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#101312", border: "1px solid rgba(255,255,255,.14)" }} />
            <Bar dataKey="views" fill="#3ddbd9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
      <ChartPanel title="Recent event mix">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={events}>
            <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
            <XAxis dataKey="eventName" tick={{ fill: "var(--muted)", fontSize: 12 }} />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} />
            <Tooltip contentStyle={{ background: "#101312", border: "1px solid rgba(255,255,255,.14)" }} />
            <Bar dataKey="count" fill="#ff8f5f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}

function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-lg p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
