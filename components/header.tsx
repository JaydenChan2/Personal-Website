import { site } from "@/content/site";
import { container } from "./layout";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-bg/85 backdrop-blur-md supports-[backdrop-filter]:bg-bg/75">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-40 focus:bg-bg focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className={`${container} flex h-14 items-center justify-between gap-4`}>
        <a href="#top" className="font-serif text-[1.375rem] leading-none tracking-tight">
          <span className="sm:hidden" aria-hidden="true">
            JC
          </span>
          <span className="max-sm:sr-only">{site.name}</span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-5 sm:gap-7">
          <ul className="flex items-center gap-4 text-[0.9375rem] sm:gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-muted transition-colors hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
            {site.resume && (
              <li>
                <a href={site.resume} target="_blank" rel="noreferrer" className="text-ink link">
                  Resume
                </a>
              </li>
            )}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
