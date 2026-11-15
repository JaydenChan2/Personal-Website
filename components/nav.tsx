"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { ThemeToggle } from "./theme-toggle";

const items = [
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/activity", label: "Activity" },
  { href: "/contact", label: "Contact" },
];

/** Fixed top bar: wordmark, mono links (the active one keeps its underline), ground switch. */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-in">
        <Link href="/" className="wordmark" aria-current={pathname === "/" ? "page" : undefined}>
          {site.name}
          <span>.</span>
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
          {site.resume && (
            <a href={site.resume} target="_blank" rel="noreferrer">
              Resume
            </a>
          )}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
