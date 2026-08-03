import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--accent)] text-black hover:brightness-110 border-transparent shadow-[0_0_30px_rgba(214,246,93,0.25)]",
  secondary:
    "bg-transparent text-[var(--foreground)] border-[var(--line)] hover:bg-white/10",
  ghost: "bg-transparent text-[var(--foreground)] border-transparent hover:bg-white/10",
  danger: "bg-red-500/15 text-red-100 border-red-400/30 hover:bg-red-500/25"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({ className, variant = "secondary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof variants;
};

export function LinkButton({
  href,
  className,
  variant = "secondary",
  children,
  ...props
}: LinkButtonProps) {
  const classes = cn(
    "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition",
    variants[variant],
    className
  );

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...props}>
      {children}
    </a>
  );
}
