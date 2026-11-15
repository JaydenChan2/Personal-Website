"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/types";
import { CoverPlate } from "./plate";

export type IndexItem = {
  key: string;
  no: string;
  title: string;
  summary: string;
  kind: string;
  year: string;
  href: string;
  external?: boolean;
  plate: Pick<Project, "title" | "stack" | "cover">;
};

/**
 * Catalogue of every project. On a fine pointer, a preview hangs in its own
 * column and follows the cursor vertically; each new entry "prints" over the
 * last with the same downward wipe the montages use. Below 960px each row
 * carries its own thumbnail instead.
 */
export function ProjectIndex({ items }: { items: IndexItem[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);
  const [on, setOn] = useState(false);
  const peekRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const motion = useRef({ py: 0, ty: 0, raf: 0 });

  const select = (key: string) => {
    if (key === current) return;
    setPrev(current);
    setCurrent(key);
  };

  // Pin the preview's X and width to its column.
  useEffect(() => {
    const measure = () => {
      const peek = peekRef.current;
      const col = colRef.current;
      if (!peek || !col) return;
      const r = col.getBoundingClientRect();
      if (r.width < 1) return;
      peek.style.setProperty("--px", `${r.left}px`);
      peek.style.setProperty("--pw", `${r.width}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    const m = motion.current;
    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(m.raf);
    };
  }, []);

  const show = (y: number, snap: boolean) => {
    const peek = peekRef.current;
    const col = colRef.current;
    if (!peek || !col) return;
    const m = motion.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    m.ty = Math.min(Math.max(80, y), window.innerHeight - peek.offsetHeight - 20);
    if (snap || reduced) {
      const r = col.getBoundingClientRect();
      peek.style.setProperty("--px", `${r.left}px`);
      peek.style.setProperty("--pw", `${r.width}px`);
      m.py = m.ty;
      peek.style.setProperty("--py", `${m.py}px`);
      void peek.offsetWidth;
      return;
    }
    const step = () => {
      m.py += (m.ty - m.py) * 0.16;
      peek.style.setProperty("--py", `${m.py.toFixed(1)}px`);
      m.raf = Math.abs(m.ty - m.py) > 0.4 ? requestAnimationFrame(step) : 0;
    };
    if (!m.raf) m.raf = requestAnimationFrame(step);
  };

  const fine = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <div className="grid12">
      <ol
        className="index-list fx"
        onMouseMove={(e) => {
          if (!fine()) return;
          const row = (e.target as Element).closest<HTMLElement>("[data-key]");
          if (!row) return setOn(false);
          select(row.dataset.key!);
          const h = peekRef.current?.offsetHeight ?? 0;
          show(e.clientY - h / 2, !on);
          setOn(true);
        }}
        onMouseLeave={() => setOn(false)}
        onFocus={(e) => {
          const row = (e.target as Element).closest<HTMLElement>("[data-key]");
          if (!row) return;
          select(row.dataset.key!);
          const r = row.getBoundingClientRect();
          const h = peekRef.current?.offsetHeight ?? 0;
          show(r.top + r.height / 2 - h / 2, !on);
          setOn(true);
        }}
        onBlur={() => setOn(false)}
      >
        {items.map((it) => {
          const inner = (
            <>
              <span className="no">{it.no}</span>
              <div className="thumb" aria-hidden="true">
                <CoverPlate project={it.plate} sizes="64px" className="ph-fill" />
              </div>
              <span className="ttl">
                {it.title}
                <small>{it.summary}</small>
              </span>
              <span className="med">{it.kind}</span>
              <span className="yr">{it.year}</span>
            </>
          );
          return (
            <li key={it.key}>
              {it.external ? (
                <a className="index-row" href={it.href} target="_blank" rel="noreferrer" data-key={it.key}>
                  {inner}
                </a>
              ) : (
                <Link className="index-row" href={it.href} data-key={it.key}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <div className="peek-col" ref={colRef}>
        <div className={`peek ${on ? "on" : ""}`} ref={peekRef} aria-hidden="true">
          {items.map((it) => {
            const isCur = it.key === current;
            const isPrev = it.key === prev;
            return (
              <div
                key={it.key}
                className="absolute inset-0"
                style={{
                  zIndex: isCur ? 2 : isPrev ? 1 : 0,
                  clipPath: isCur || isPrev ? "inset(0 0 0 0)" : "inset(0 0 101% 0)",
                  transition: isCur && prev ? "clip-path .5s cubic-bezier(.22,.9,.24,1)" : "none",
                }}
              >
                <CoverPlate project={it.plate} sizes="(min-width: 960px) 30vw, 1px" className="ph-fill" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
