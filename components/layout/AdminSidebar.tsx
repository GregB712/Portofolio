import { BarChart3, FolderKanban, Inbox, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/contact", label: "Contact", icon: Inbox },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminSidebar() {
  return (
    <aside className="glass-strong h-fit rounded-lg p-3 lg:sticky lg:top-24">
      <nav className="grid gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-white/10 hover:text-[var(--foreground)]"
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
