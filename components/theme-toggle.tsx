"use client";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * The ground switch: a split disc that turns over with the theme. The label and
 * the disc are both driven by CSS from data-theme, so nothing flashes on load.
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      className="ground"
      onClick={() => {
        const next: Theme = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("theme", next);
        } catch {}
      }}
    >
      <span className="disc" aria-hidden="true" />
      <span className="to-dark">
        Dark<span className="sr-only"> theme</span>
      </span>
      <span className="to-light">
        Light<span className="sr-only"> theme</span>
      </span>
    </button>
  );
}
