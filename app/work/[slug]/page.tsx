import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverPlate, StackPlate, StatPlate } from "@/components/plate";
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
  const no = `P-${String(index + 1).padStart(2, "0")}`;

  return (
    <article className="wrap page-top pb-[clamp(72px,11vh,130px)]">
      <Link href="/work" className="ghost fx">
        ← All work
      </Link>

      <header className="sec-head mt-12">
        <span className="mono fx">
          {no} — {p.kind.split(" · ")[0]}
        </span>
        <div className="sec-title fx">
          <h1>{p.title}</h1>
          <p className="mt-5 max-w-[34ch] text-[clamp(1.1rem,1.6vw,1.4rem)] font-light leading-snug text-ink-2">{p.summary}</p>
        </div>
        <dl className="side fx grid gap-4">
          <div>
            <dt className="mono">Year</dt>
            <dd className="text-ink">
              <T value={p.year} />
            </dd>
          </div>
          {p.role && (
            <div>
              <dt className="mono">Role</dt>
              <dd className="text-ink">{p.role}</dd>
            </div>
          )}
          <div>
            <dt className="mono">Stack</dt>
            <dd className="text-ink">{p.stack.join(", ")}</dd>
          </div>
          {(p.live || p.source) && (
            <div className="flex flex-wrap gap-x-5">
              <dt className="sr-only">Links</dt>
              {p.live && (
                <dd>
                  <MaybeLink href={p.live} className="ghost">
                    Visit site
                  </MaybeLink>
                </dd>
              )}
              {p.source && (
                <dd>
                  <a href={p.source} target="_blank" rel="noreferrer" className="ghost">
                    Source
                    <ArrowOut />
                  </a>
                </dd>
              )}
            </div>
          )}
        </dl>
      </header>

      {p.cover ? (
        <div className="reveal">
          <CoverPlate project={p} sizes="(min-width: 1360px) 1250px, 100vw" priority className="aspect-[16/10] w-full" />
        </div>
      ) : (
        <div className="reveal grid12">
          <CoverPlate project={p} sizes="1px" className="col-span-12 h-[260px] md:col-span-6 md:h-[320px]" />
          {p.stat && <StatPlate stat={p.stat} className="col-span-6 h-[240px] md:col-span-3 md:h-[320px]" />}
          <StackPlate stack={p.stack} className="col-span-6 h-[240px] md:col-span-3 md:h-[320px]" />
        </div>
      )}

      <div className="mt-[clamp(56px,9vh,110px)]">
        <Section label="01 — The problem">
          <p className="prose">
            <T value={p.problem} />
          </p>
        </Section>
        <Section label="02 — What I built">
          <p className="prose">
            <T value={p.built} />
          </p>
        </Section>
        <Section label="03 — A decision" wide>
          <div className="callout">
            <p className="text-[clamp(1.35rem,2vw,1.8rem)] font-light leading-snug tracking-[-0.005em]">{p.decision.title}</p>
            <p className="mt-4 max-w-[62ch] text-ink-2">
              <T value={p.decision.body} />
            </p>
          </div>
        </Section>

        {p.outcomes && p.outcomes.length > 0 && (
          <Section label="04 — Outcomes">
            <ol className="num-list">
              {p.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ol>
          </Section>
        )}

        {p.video && (
          <Section label="Demo" wide>
            <div className="ph">
              <VideoPoster id={p.video.id} title={p.video.title} designed={!p.cover} />
            </div>
          </Section>
        )}

        {p.gallery?.map((g) => (
          <Section label="Plate" wide key={g.src}>
            <figure>
              <div className="reveal">
                <div className="ph ph--auto">
                  <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(min-width: 1360px) 940px, 100vw" />
                </div>
              </div>
              <figcaption className="note mt-3">{g.caption}</figcaption>
            </figure>
          </Section>
        ))}
      </div>

      <nav aria-label="Next project" className="border-t border-line pt-[clamp(40px,7vh,80px)]">
        <span className="mono mb-6 block">Next project</span>
        <Link href={`/work/${next.slug}`} className="mail">
          {next.title} <span className="arr" aria-hidden="true">→</span>
        </Link>
      </nav>
    </article>
  );
}

function Section({ label, wide = false, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <section className="row fx">
      <h2 className="row-label mono">{label}</h2>
      <div className={wide ? "row-wide" : "row-body"}>{children}</div>
    </section>
  );
}
