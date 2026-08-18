"use client";

import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type State = "idle" | "submitting" | "error";

export function ContactForm({ sourcePage = "/contact" }: { sourcePage?: string }) {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setState("submitting");
    setError("");

    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "The message could not be sent.");
      setState("error");
      return;
    }

    router.push("/thank-you");
  }

  return (
    <form action={submit} className="glass grid gap-4 rounded-lg p-6">
      <input type="hidden" name="sourcePage" value={sourcePage} />
      <label className="hidden">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Name
          <input
            required
            name="name"
            className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Email
          <input
            required
            type="email"
            name="email"
            className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm">
        Company
        <input name="company" className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3" />
      </label>
      <label className="grid gap-2 text-sm">
        Subject
        <input
          required
          name="subject"
          className="focus-ring rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Message
        <textarea
          required
          name="message"
          rows={7}
          className="focus-ring resize-y rounded-md border border-[var(--line)] bg-white/5 px-3 py-3"
        />
      </label>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <Button type="submit" variant="primary" disabled={state === "submitting"}>
        <Send size={16} />
        {state === "submitting" ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
