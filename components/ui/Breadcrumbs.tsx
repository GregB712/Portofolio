import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({
  items,
  className
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const crumbs = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-[var(--muted)]", className)}>
      <ol
        className="flex flex-wrap items-center gap-2"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {crumbs.map((item, index) => {
          const isCurrent = index === crumbs.length - 1;
          const itemUrl = item.href ? `${site.url}${item.href}` : undefined;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex min-w-0 items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 ? <ChevronRight aria-hidden size={14} className="shrink-0 opacity-60" /> : null}
              {item.href && !isCurrent ? (
                <Link
                  href={item.href}
                  className="focus-ring inline-flex items-center gap-1 rounded-sm transition hover:text-[var(--foreground)]"
                  itemProp="item"
                >
                  {index === 0 ? <Home aria-hidden size={14} /> : null}
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span className="truncate text-[var(--foreground)]" aria-current="page" itemProp="name">
                  {item.label}
                </span>
              )}
              {itemUrl && isCurrent ? <meta itemProp="item" content={itemUrl} /> : null}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
