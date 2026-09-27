import { minorProjects, projects } from "@/content/projects";
import type { Media, Project } from "@/content/types";
import Image from "next/image";
import { container, grid, SectionHeading } from "./layout";
import { MaybeLink, T } from "./text";
import { VideoPoster } from "./video-poster";

export function Work() {
  return (
    <section aria-labelledby="work" className={`${container} py-16 md:py-24`}>
      <SectionHeading index="01" title="Selected work" id="work" />
      <div className="mt-10 md:mt-16">
        {projects.map((p, i) => (
          <ProjectArticle key={p.slug} project={p} index={i + 1} />
        ))}
      </div>
      <AlsoBuilt />
    </section>
  );
}

function ProjectArticle({ project: p, index }: { project: Project; index: number }) {
  const lead = p.prominence === "lead";
  const n = String(index).padStart(2, "0");

  return (
    <article
      id={p.slug}
      aria-labelledby={`${p.slug}-title`}
      className={`${grid} gap-y-8 md:gap-y-10 border-t border-rule py-12 first:border-t-0 first:pt-0 md:py-20`}
    >
      {/* Title first in the DOM so phones read name → details → write-up. */}
      <header className="col-span-12 md:col-span-9 md:col-start-4 md:row-start-1">
        <h3 id={`${p.slug}-title`} className={lead ? "text-h2" : "text-h3"}>
          {p.title}
        </h3>
        <p className="mt-4 max-w-[36ch] font-serif text-lede italic text-muted">{p.summary}</p>
      </header>

      {/* Margin column: the paper's metadata. Sticky on desktop so it tracks the write-up. */}
      <aside
        className="col-span-12 md:col-span-3 md:col-start-1 md:row-span-2 md:row-start-1"
        aria-label={`${p.title} details`}
      >
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:sticky md:top-24 md:grid-cols-1">
          <div>
            <dt className="meta">No.</dt>
            <dd className="font-serif text-2xl leading-tight">{n}</dd>
          </div>
          {p.year && (
            <div>
              <dt className="meta">Year</dt>
              <dd className="text-[0.9375rem]">
                <T value={p.year} />
              </dd>
            </div>
          )}
          {p.role && (
            <div className="col-span-2 md:col-span-1">
              <dt className="meta">Role</dt>
              <dd className="text-[0.9375rem]">{p.role}</dd>
            </div>
          )}
          <div className="col-span-2 md:col-span-1">
            <dt className="meta">Stack</dt>
            <dd className="text-[0.9375rem]">
              <ul className="flex flex-wrap gap-x-3 md:block">
                {p.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="col-span-2 md:col-span-1">
            <dt className="meta">Links</dt>
            <dd className="text-[0.9375rem]">
              <ul className="flex flex-wrap gap-x-4 md:block md:space-y-1">
                {p.links.map((l) => (
                  <li key={l.label}>
                    <MaybeLink href={l.href}>{l.label}</MaybeLink>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </aside>

      <div className="col-span-12 md:col-span-9 md:col-start-4 md:row-start-2">
        {p.media && lead && <Figure media={p.media} label={`Fig. ${index}`} priority />}

        <div className={`${p.media && lead ? "mt-10" : ""} grid gap-x-10 gap-y-8 ${p.media && !lead ? "lg:grid-cols-2" : "md:grid-cols-2"}`}>
          {p.media && !lead ? (
            <>
              <div className="space-y-8">
                <Note label="Problem" body={p.problem} />
                <Note label="What I built" body={p.built} />
              </div>
              <Figure media={p.media} label={`Fig. ${index}`} className="lg:pt-1" />
            </>
          ) : (
            <>
              <Note label="Problem" body={p.problem} />
              <Note label="What I built" body={p.built} />
            </>
          )}
        </div>

        <Decision title={p.decision.title} body={<T value={p.decision.body} />} />

        {p.results && p.results.length > 0 && (
          <dl className="mt-10 grid gap-y-4 border-t border-rule pt-6 sm:grid-cols-3 sm:gap-x-6">
            {p.results.map((r) => (
              <div key={r.label} className="flex items-baseline gap-4 sm:block">
                <dt className="sr-only">{r.label}</dt>
                <dd className="w-28 shrink-0 font-serif text-[2rem] leading-none tracking-tight sm:w-auto sm:text-[2.25rem]">
                  {r.value}
                </dd>
                <dd className="text-sm text-muted sm:mt-2 sm:max-w-[20ch]">{r.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </article>
  );
}

function Note({ label, body }: { label: string; body: Project["problem"] }) {
  return (
    <div>
      <h4 className="meta mb-2">{label}</h4>
      <p className="max-w-[60ch]">
        <T value={body} />
      </p>
    </div>
  );
}

/** The one technical decision per project, set as a pull-quote with an accent rule. */
function Decision({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="mt-10 border-l-2 border-accent pl-5 sm:pl-6">
      <h4 className="meta mb-2 text-accent">Technical decision</h4>
      <p className="max-w-[34ch] font-serif text-[1.625rem] leading-[1.15]">{title}</p>
      <p className="mt-3 max-w-[60ch] text-muted">{body}</p>
    </div>
  );
}

function Figure({
  media,
  label,
  className = "",
  priority = false,
}: {
  media: Media;
  label: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div className="ring-1 ring-rule">
        {media.kind === "youtube" && <VideoPoster
            id={media.id}
            title={media.title}
            thumb={media.thumb}
            designed={media.poster === "designed"}
            priority={priority}
          />}
        {media.kind === "image" && (
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            sizes="(min-width: 1216px) 860px, (min-width: 768px) 72vw, 100vw"
            className="h-auto w-full"
            priority={priority}
          />
        )}
        {media.kind === "placeholder" && (
          <div className="grid aspect-[16/10] place-items-center bg-surface p-6">
            <p className="todo max-w-[40ch] text-center">TODO: {media.note}</p>
          </div>
        )}
      </div>
      <figcaption className="meta mt-3 normal-case tracking-normal">
        <span className="uppercase tracking-[0.06em] text-ink">{label}</span> · {media.caption}
      </figcaption>
    </figure>
  );
}

function AlsoBuilt() {
  return (
    <div className={`${grid} mt-4 gap-y-6 border-t border-rule pt-10`}>
      <h3 className="meta col-span-12 md:col-span-3">Also built</h3>
      <ul className="col-span-12 divide-y divide-rule md:col-span-9">
        {minorProjects.map((p) => (
          <li key={p.title} className="grid gap-x-6 gap-y-1 py-4 first:pt-0 sm:grid-cols-[13rem_1fr]">
            <p className="font-medium">
              {p.href ? <MaybeLink href={p.href}>{p.title}</MaybeLink> : p.title}
            </p>
            <div>
              <p className="text-muted">{p.summary}</p>
              <p className="meta mt-1 normal-case tracking-normal">{p.stack.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
