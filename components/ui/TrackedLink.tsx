"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function TrackedLink({
  href,
  eventName,
  metadata,
  children,
  className,
  target,
  download,
  "aria-label": ariaLabel
}: {
  href: string;
  eventName: string;
  metadata?: Record<string, unknown>;
  children: React.ReactNode;
  className?: string;
  target?: string;
  download?: boolean;
  "aria-label"?: string;
}) {
  const handleClick = () => {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        path: window.location.pathname,
        metadata
      }),
      keepalive: true
    });
  };

  if (href.startsWith("/") && !download) {
    return (
      <Link href={href} onClick={handleClick} className={cn("focus-ring", className)}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      download={download}
      onClick={handleClick}
      className={cn("focus-ring", className)}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
