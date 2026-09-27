import Link from "next/link";
import { container } from "@/components/container";
import { CopyEmail } from "@/components/copy-email";
import { ArrowOut } from "@/components/text";
import { WorkPreview } from "@/components/work-preview";
import { featuredProjects } from "@/content/projects";
import { site } from "@/content/site";

/** Entrance stagger for the hero: delay per item, in ms (total stays under 600ms). */
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Home() {
  const preview = featuredProjects.map(({ slug, title, summary, kind, stack, cover }) => ({
    slug,
    title,
    summary,
    kind,
    stack,
    cover,
  }));

  return (
    <div className={`${container} flex flex-1 items-center py-8 md:py-16`}>
      <div className="grid w-full grid-cols-12 gap-x-6 gap-y-12 md:gap-y-16">
        <div className="col-span-12 md:col-span-6">
          <p className="intro-item flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem] text-muted" style={d(0)}>
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

          <h1 className="intro-item mt-8 text-display" style={d(40)}>
            {site.name}
          </h1>

          <p className="intro-item mt-8 max-w-[28ch] text-lede text-muted" style={d(80)}>
            {site.intro}
          </p>

          <ul className="intro-item mt-10 flex flex-wrap items-center gap-x-7 gap-y-3" style={d(120)}>
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
        </div>

        <div className="intro-item col-span-12 md:col-span-5 md:col-start-8 md:self-center" style={d(160)}>
          <WorkPreview items={preview} />
        </div>
      </div>
    </div>
  );
}
