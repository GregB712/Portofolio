"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyEmailButton({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName: "email_copy",
        path: window.location.pathname,
        metadata: { email }
      }),
      keepalive: true
    });
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button type="button" onClick={copyEmail} variant="secondary" className={className}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span className="grid">
        <span className="invisible col-start-1 row-start-1" aria-hidden>
          Copy email
        </span>
        <span className="col-start-1 row-start-1 text-left">{copied ? "Copied" : "Copy email"}</span>
      </span>
    </Button>
  );
}
