"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--background)]/76 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md">
          <span className="grid h-9 w-9 place-items-center rounded-md border border-[var(--line)] bg-white/10 font-semibold">
            GB
          </span>
          <span className="hidden text-sm font-semibold sm:inline">Gregory Barmpas</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-md px-3 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="focus-ring rounded-md px-3 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
          >
            Admin
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-10 px-0"
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--line)] px-4 py-3 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md px-3 py-2 text-sm text-[var(--muted)]"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="focus-ring rounded-md px-3 py-2 text-sm text-[var(--muted)]">
              Admin
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
