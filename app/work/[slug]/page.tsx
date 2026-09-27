import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { container, PageFooter } from "@/components/container";
import { Cover } from "@/components/cover";
import { ArrowOut, MaybeLink, T } from "@/components/text";
import { VideoPoster } from "@/components/video-poster";
import { getProject, projects } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projects.indexOf(p);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <article className={`${container} pt-8 md:pt-12`}>
        <div>
          <Link href="/work" className="label link inline-block hover:text-ink">
            ← All work
          </Link>

          <header className="intro-item mt-10 grid gap-x-8 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="label">{p.kind}</p>
              <h1 className="mt-2 text-title">{p.title}</h1>
              <p className="mt-5 max-w-[34ch] text-lede text-muted">{p.summary}</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-end text-[0.9375rem] md:col-span-4 md:grid-cols-1">
              <div>
                <dt className="label">Year</dt>
                <dd>
                  <T value={p.year} />
                </dd>
              </div>
              {p.role && (
                <div>
                  <dt className="label">Role</dt>
                  <dd>{p.role}</dd>
                </div>
              )}
              <div className="col-span-2 md:col-span-1">
                <dt className="label">Stack</dt>
                <dd>{p.stack.join(", ")}</dd>
              </div>
              {(p.live || p.source) && (
                <div className="col-span-2 flex flex-wrap gap-x-5 md:col-span-1">
                  <dt className="sr-only">Links</dt>
                  {p.live && (
                    <dd>
                      <MaybeLink href={p.live} className="link-u">
                        Visit site
                      </MaybeLink>
                    </dd>
                  )}
                  {p.source && (
                    <dd>
                      <a href={p.source} target="_blank" rel="noreferrer" className="link-u">
                        Source
                        <ArrowOut />
                      </a>
                    </dd>
                  )}
                </div>
              )}
            </dl>
          </header>

          {p.cover && (
            <div className="intro-item mt-14 overflow-hidden rounded-md ring-1 ring-line" style={{ "--d": "80ms" } as React.CSSProperties}>
              <Cover project={p} sizes="(min-width: 1152px) 1088px, 100vw" priority className="aspect-[16/10]" />
            </div>
          )}
        </div>

        <div className="mt-20 grid gap-x-8 gap-y-16 md:grid-cols-12">
          <Section title="The problem">
            <T value={p.problem} />
          </Section>
          <Section title="What I built">
            <T value={p.built} />
          </Section>

          <section className="md:col-span-10 md:col-start-3">
            <div className="rounded-md bg-sunken p-6 sm:p-8">
              <h2 className="label">A decision worth explaining</h2>
              <p className="mt-2 text-2xl font-medium leading-tight tracking-tight">{p.decision.title}</p>
              <p className="mt-3 max-w-[62ch] text-muted">
                <T value={p.decision.body} />
              </p>
            </div>
          </section>

          {p.outcomes && p.outcomes.length > 0 && (
            <Section title="Outcomes">
              <ul className="space-y-3">
                {p.outcomes.map((o) => (
                  <li key={o} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {p.video && (
            <section className="md:col-span-10 md:col-start-3">
              <h2 className="label mb-3">Demo</h2>
              <div className="overflow-hidden rounded-md ring-1 ring-line">
                <VideoPoster id={p.video.id} title={p.video.title} designed={!p.cover} />
              </div>
            </section>
          )}

          {p.gallery?.map((g) => (
            <figure key={g.src} className="md:col-span-10 md:col-start-3">
              <div className="overflow-hidden rounded-md ring-1 ring-line">
                <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(min-width: 1152px) 900px, 100vw" className="h-auto w-full" />
              </div>
              <figcaption className="label mt-3">{g.caption}</figcaption>
            </figure>
          ))}
        </div>

        <nav aria-label="Next project" className="mt-24">
          <Link href={`/work/${next.slug}`} className="group block border-t border-line pt-6">
            <span className="label">Next project</span>
            <span className="mt-1 flex items-baseline justify-between gap-6">
              <span className="text-title transition-colors group-hover:text-accent">{next.title}</span>
              <span aria-hidden="true" className="text-3xl text-muted transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:text-accent motion-reduce:transform-none">
                →
              </span>
            </span>
          </Link>
        </nav>
      </article>
      <PageFooter />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-x-8 gap-y-3 md:col-span-10 md:col-start-3 md:grid-cols-10">
      <h2 className="label md:col-span-3 md:pt-1">{title}</h2>
      <div className="max-w-[62ch] text-lg leading-relaxed md:col-span-7">{children}</div>
    </section>
  );
}
