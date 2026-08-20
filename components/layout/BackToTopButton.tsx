"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const SCROLL_VISIBLE_OFFSET = 24;

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_VISIBLE_OFFSET);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  return (
    <Button
      type="button"
      variant="secondary"
      aria-label="Back to top"
      title="Back to top"
      onClick={scrollToTop}
      className={[
        "fixed right-4 bottom-4 z-40 h-11 w-11 rounded-md border-[var(--line)] bg-[var(--panel-strong)] px-0 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-xl",
        "transition duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black hover:shadow-[0_22px_54px_rgba(214,246,93,0.24)] sm:right-6 sm:bottom-6",
        isVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      ].join(" ")}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </Button>
  );
}
