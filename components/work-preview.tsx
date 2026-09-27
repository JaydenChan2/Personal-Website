"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/content/types";
import { Cover } from "./cover";

export type PreviewItem = Pick<Project, "slug" | "title" | "summary" | "kind" | "stack" | "cover">;

/**
 * Home page project list. Hovering or focusing a row swaps the preview above it,
 * and the detection box snaps onto the new project.
 */
export function WorkPreview({ items }: { items: PreviewItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-baseline justify-between md:mb-9">
        <h2 className="label">Selected work</h2>
        <Link href="/work" className="label link hover:text-ink">
          All work →
        </Link>
      </div>

      {/* Preview: every cover is stacked and cross-faded, so swapping never waits on a load. */}
      <div className="detect relative mb-5 hidden md:block" data-active="true" aria-hidden="true">
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-sunken ring-1 ring-line">
          {items.map((item, i) => (
            <div
              key={item.slug}
              className={`absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                i === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
              }`}
            >
              <Cover project={item} sizes="(min-width: 1152px) 440px, 40vw" priority={i === 0} />
            </div>
          ))}
        </div>
        <span key={current.slug} className="detect-box snap" data-label={current.kind} />
      </div>

      <ul className="border-t border-line">
        {items.map((item, i) => (
          <li key={item.slug} className="border-b border-line">
            <Link
              href={`/work/${item.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex items-baseline gap-4 py-4"
            >
              <span
                className={`font-medium transition-[color,transform] duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none ${
                  i === active ? "text-ink" : "text-ink md:text-muted"
                }`}
              >
                {item.title}
              </span>
              <span
                aria-hidden="true"
                className="ml-auto text-muted transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-accent motion-reduce:transform-none"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
