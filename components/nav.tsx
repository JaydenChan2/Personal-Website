"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { container } from "./container";
import { ThemeToggle } from "./theme-toggle";

const items = [
  { href: "/work", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Top bar. The active page gets a pill that slides between items as you navigate.
 */
export function Nav() {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const active = items.find((i) => pathname === i.href || pathname.startsWith(`${i.href}/`));

  useLayoutEffect(() => {
    const measure = () => {
      const el = listRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
      setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md">
      <nav aria-label="Primary" className={`${container} flex h-16 items-center justify-between gap-3`}>
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className="-ml-1 rounded px-1 text-[1.0625rem] font-medium tracking-tight"
        >
          <span className="sm:hidden" aria-hidden="true">
            JC
          </span>
          <span className="max-sm:sr-only">Jayden Chan</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <ul ref={listRef} className="relative flex items-center text-[0.9375rem]">
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 -z-10 rounded-full bg-sunken transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{
                width: pill?.w ?? 0,
                transform: `translateX(${pill?.x ?? 0}px)`,
                opacity: pill ? 1 : 0,
              }}
            />
            {items.map((item) => {
              const isActive = item === active;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`block rounded-full px-2.5 py-1.5 transition-colors sm:px-3.5 ${
                      isActive ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {site.resume && (
              <li>
                <a href={site.resume} target="_blank" rel="noreferrer" className="block px-2.5 py-1.5 text-muted hover:text-ink sm:px-3.5">
                  Resume
                </a>
              </li>
            )}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
