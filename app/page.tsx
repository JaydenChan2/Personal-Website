import Link from "next/link";
import { Fragment } from "react";
import { container } from "@/components/container";
import { CopyEmail } from "@/components/copy-email";
import { ArrowOut, T } from "@/components/text";
import { WorkPreview } from "@/components/work-preview";
import { featuredProjects } from "@/content/projects";
import { site } from "@/content/site";

export default function Home() {
  const words = site.name.split(" ");
  const preview = featuredProjects.map(({ slug, title, summary, kind, stack, cover }) => ({
    slug,
    title,
    summary,
    kind,
    stack,
    cover,
  }));

  return (
    <div className={`${container} flex flex-1 items-center py-10 md:py-12`}>
      <div className="grid w-full grid-cols-12 gap-x-6 gap-y-14">
        <div className="stagger col-span-12 md:col-span-7 md:pr-6">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem] text-muted">
            <span className="live-dot relative inline-block size-2 rounded-full bg-live" aria-hidden="true" />
            <span className="sr-only">Currently:</span>
            {site.current.map((c, i) => (
              <span key={c.id}>
                <Link href={`/experience#${c.id}`} className="link hover:text-ink">
                  {c.label}
                </Link>
                {i < site.current.length - 1 && <span aria-hidden="true"> · </span>}
              </span>
            ))}
          </p>

          <h1 className="mt-6 text-display" aria-label={site.name}>
            {words.map((w, i) => (
              <Fragment key={w}>
                <span className="word-mask" aria-hidden="true">
                  <span style={{ "--w": i } as React.CSSProperties}>{w}</span>
                </span>
                {i < words.length - 1 && " "}
              </Fragment>
            ))}
          </h1>

          <p className="mt-7 max-w-[30ch] text-lede">{site.intro}</p>

          <ul className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
            <li>
              <CopyEmail email={site.email} />
            </li>
            <li>
              <a href={site.github} target="_blank" rel="noreferrer" className="link">
                GitHub
                <ArrowOut />
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className="link">
                LinkedIn
                <ArrowOut />
              </a>
            </li>
            {site.resume && (
              <li>
                <a href={site.resume} target="_blank" rel="noreferrer" className="link">
                  Resume
                  <ArrowOut />
                </a>
              </li>
            )}
          </ul>

          {site.availability && (
            <p className="label mt-6">
              <T value={site.availability} />
            </p>
          )}
        </div>

        <div className="stagger col-span-12 md:col-span-5 md:self-center">
          <WorkPreview items={preview} />
        </div>
      </div>
    </div>
  );
}
