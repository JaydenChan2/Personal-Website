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
  { href: "/activity", label: "Activity" },
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
      {/* Phones: name + theme toggle on the first row, the links spread across a second row. */}
      <nav
        aria-label="Primary"
        className={`${container} flex flex-wrap items-center justify-between gap-x-3 pt-3 sm:h-16 sm:flex-nowrap sm:pt-0`}
      >
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className="-ml-1 rounded px-1 text-[1.0625rem] font-medium tracking-tight"
        >
          Jayden Chan
        </Link>

        <ul
          ref={listRef}
          className="relative order-last -mx-2 flex w-[calc(100%+1rem)] items-center justify-between py-2 text-[0.9375rem] sm:order-none sm:mx-0 sm:ml-auto sm:w-auto sm:justify-start sm:py-0"
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-2 bottom-2 -z-10 rounded-full bg-sunken transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:inset-y-0"
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
                  className={`block rounded-full px-2 py-1.5 transition-colors sm:px-3.5 ${
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
              <a href={site.resume} target="_blank" rel="noreferrer" className="block px-2 py-1.5 text-muted hover:text-ink sm:px-3.5">
                Resume
              </a>
            </li>
          )}
        </ul>

        <div className="sm:ml-3">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
