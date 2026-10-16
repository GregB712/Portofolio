"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  className,
  variant = "primary"
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      disabled={pending}
      aria-busy={pending}
      className={`transition active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 ${className ?? ""}`}
    >
      {pending ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
      {children}
    </Button>
  );
}
