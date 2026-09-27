"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => setTheme(currentTheme()), []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {}
        setTheme(next);
      }}
      className="group -m-2 grid size-10 place-items-center rounded-full text-muted transition-colors hover:text-ink"
      aria-label={theme ? `Switch to ${next} theme` : "Toggle theme"}
    >
      {/* Half-filled disc: the filled half swaps sides with the theme. */}
      <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden="true">
        <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10 2.75a7.25 7.25 0 0 1 0 14.5z"
          fill="currentColor"
          className="theme-half origin-center transition-transform duration-300 ease-out motion-reduce:transition-none"
        />
      </svg>
    </button>
  );
}
