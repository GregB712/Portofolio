"use client";

import { BarChart3, FileText, FolderKanban, Inbox, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/contact", label: "Contact", icon: Inbox },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-strong h-fit rounded-lg p-3 lg:sticky lg:top-24">
      <nav className="grid gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`focus-ring inline-flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm transition hover:bg-white/10 hover:text-[var(--foreground)] ${
                active
                  ? "border-[var(--accent)] bg-white/10 font-semibold text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted)]"
              }`}
            >
              <Icon size={16} className={active ? "text-[var(--accent)]" : undefined} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
