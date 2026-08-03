export function TimelineItem({
  title,
  subtitle,
  dates,
  bullets,
  current
}: {
  title: string;
  subtitle: string;
  dates: string;
  bullets: readonly string[];
  current?: boolean;
}) {
  return (
    <article className="relative border-l border-[var(--line)] pl-6">
      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_18px_rgba(214,246,93,0.65)]" />
      <div className="glass rounded-lg p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-[var(--muted)]">{subtitle}</p>
          </div>
          <p className="text-sm text-[var(--accent)]">{current ? `${dates}` : dates}</p>
        </div>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-[var(--muted)]">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
