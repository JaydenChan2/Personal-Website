"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * YouTube embed that loads nothing but a poster image until clicked, so no
 * third-party player (or autoplay) until the visitor asks for it.
 */
export function VideoPoster({
  id,
  title,
  thumb = "sddefault",
  designed = false,
  priority = false,
}: {
  id: string;
  title: string;
  thumb?: string;
  designed?: boolean;
  priority?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden bg-surface">
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 size-full cursor-pointer focus-visible:outline-offset-[-2px]"
          aria-label={`Play demo: ${title}`}
        >
          {designed ? (
            <span className="absolute inset-0 flex flex-col justify-between bg-ink p-5 text-left text-bg sm:p-8">
              <span className="meta text-bg/70">Demo video · YouTube</span>
              <span className="max-w-[18ch] pb-12 font-serif text-[clamp(1.75rem,1rem+3vw,3.25rem)] leading-[1.02] sm:pb-14">
                {title.replace(/ demo video$/i, "")}, tracking a face in real time.
              </span>
            </span>
          ) : (
            <Image
              src={`https://i.ytimg.com/vi/${id}/${thumb}.jpg`}
              alt=""
              fill
              sizes="(min-width: 1216px) 860px, (min-width: 768px) 72vw, 100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.015] motion-reduce:transition-none"
              priority={priority}
            />
          )}
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-bg/90 px-4 py-2 text-sm text-ink backdrop-blur-sm transition-colors group-hover:bg-bg">
            <svg viewBox="0 0 12 12" className="size-3 fill-accent" aria-hidden="true">
              <path d="M3 1.5v9l7.5-4.5z" />
            </svg>
            Play demo
          </span>
        </button>
      )}
    </div>
  );
}
