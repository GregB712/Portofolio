"use client";

import { MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label="Toggle theme"
      className="h-10 w-10 px-0"
      onClick={() => setTheme(nextTheme)}
      title="Theme"
    >
      {theme === "dark" ? <Moon size={17} /> : theme === "light" ? <Sun size={17} /> : <MonitorCog size={17} />}
    </Button>
  );
}
