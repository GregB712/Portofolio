import { ArrowLeft, Compass, Home, Mail, SearchX } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

const waypoints = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "/projects", icon: Compass },
  { label: "Contact", href: "/contact", icon: Mail }
];

export default function NotFound() {
  return (
    <main className="relative isolate min-h-[calc(100vh-9rem)] overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="ai-field" aria-hidden>
        {[
          ["14%", "18%"],
          ["72%", "16%"],
          ["88%", "54%"],
          ["28%", "78%"],
          ["58%", "86%"]
        ].map(([left, top], index) => (
          <span key={`${left}-${top}`} style={{ left, top, animationDelay: `${index * 0.35}s` }} />
        ))}
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-17rem)] max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="glass-strong relative overflow-hidden rounded-lg p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--accent-2)] via-[var(--accent)] to-[var(--accent-3)]" />
          <div className="relative aspect-square overflow-hidden rounded-md border border-[var(--line)] bg-black/90">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(214,246,93,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(61,219,217,0.14)_1px,transparent_1px)] bg-[size:38px_38px]" />
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)]/45 shadow-[0_0_80px_rgba(214,246,93,0.24)] sm:h-56 sm:w-56" />
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[var(--accent-2)]/45 sm:h-96 sm:w-96" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_32%,rgba(0,0,0,0.76)_74%)]" />
            <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center gap-4 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-md border border-[var(--line)] bg-white/10 backdrop-blur">
                <SearchX size={34} className="text-[var(--accent)]" />
              </div>
              <p className="font-mono text-6xl font-semibold tracking-normal text-white sm:text-8xl">404</p>
            </div>
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 text-center text-[10px] uppercase text-white/70 sm:text-xs">
              {["Route", "Signal", "Index"].map((item, index) => (
                <div key={item} className="rounded-md border border-white/10 bg-white/10 px-2 py-3">
                  <span className="block text-white">{index === 0 ? "Null" : index === 1 ? "Lost" : "Miss"}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent-2)]">
            Missing endpoint
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
            This page is outside the model&apos;s context window.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            The route you requested does not exist, may have moved, or was never shipped. Try one of
            the stable paths below.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/" variant="primary" className="min-h-11 px-5 py-3">
              <ArrowLeft size={16} />
              Back home
            </LinkButton>
            <LinkButton href="/projects" className="min-h-11 px-5 py-3">
              <Compass size={16} />
              View projects
            </LinkButton>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {waypoints.map((waypoint) => {
              const Icon = waypoint.icon;

              return (
                <Link
                  key={waypoint.href}
                  href={waypoint.href}
                  className="focus-ring group rounded-lg border border-[var(--line)] bg-white/5 p-4 transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <Icon size={18} className="text-[var(--accent)] transition group-hover:scale-110" />
                  <span className="mt-4 block text-sm font-semibold">{waypoint.label}</span>
                  <span className="mt-1 block text-xs text-[var(--muted)]">{waypoint.href}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
