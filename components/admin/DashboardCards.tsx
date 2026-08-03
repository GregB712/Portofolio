import { cn } from "@/lib/utils";

export function DashboardCards({
  cards
}: {
  cards: { label: string; value: string | number; accent?: boolean }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className={cn("glass rounded-lg p-5", card.accent && "border-[var(--accent)]")}>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{card.label}</p>
          <p className="mt-3 text-3xl font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
