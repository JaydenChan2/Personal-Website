import Image from "next/image";
import Link from "next/link";
import { SecHead } from "@/components/container";
import { ListeningSection } from "@/components/listening";
import { ImagePlate, ProjectPlates } from "@/components/plate";
import { T } from "@/components/text";
import { experience } from "@/content/experience";
import { featuredProjects, getProject } from "@/content/projects";
import { site } from "@/content/site";
import { getListening, type Listening } from "@/lib/listening";
import portrait from "@/public/me.png";

const ARRANGEMENTS = ["arr-1", "arr-2", "arr-3"];
const two = (n: number) => String(n).padStart(2, "0");
/** "May 2026" → "2026" */
const yearOf = (s: string) => s.match(/\d{4}/)?.[0] ?? s;

// Re-render at most hourly so "On repeat" stays current (keep in sync with listening.revalidateSeconds).
export const revalidate = 3600;

export default async function Home() {
  let listening: Listening | null = null;
  try {
    listening = await getListening();
  } catch (err) {
    console.error("[listening]", err);
  }

  const guitar = getProject("guitar-tab-ai")!;
  const geniboo = getProject("geniboo")!;
  const lynx = getProject("lynx")!;

  return (
    <>
      {/* ============ Hero ============ */}
      <section className="hero wrap" aria-label="Introduction">
        <div className="grid12 hero-grid">
          <div className="hero-copy fx">
            <span className="mono">
              <b>{site.name}</b> — Software &amp; ML, <span className="nb">Waterloo, ON</span>
            </span>
            <h1 className="h-display">
              Software,
              <br />
              <b>and the world</b>
              <br />
              it runs in.
            </h1>
            <p>{site.intro}</p>
            <div className="hero-cta">
              <Link className="btn" href="#work">
                Selected work <span className="arr" aria-hidden="true">→</span>
              </Link>
              <Link className="ghost" href="/experience">
                Experience
              </Link>
            </div>
          </div>
          <div className="hero-montage montage reveal" role="group" aria-label="Three project screenshots">
            {[guitar, geniboo, lynx].map((p, i) => (
              <ImagePlate
                key={p.slug}
                image={p.cover!}
                sizes="(min-width: 960px) 46vw, 90vw"
                priority
                className={["m-a", "m-b", "m-c"][i]}
                depth={[0.06, 0.2, 0.34][i]}
                caption={`${p.title} — ${p.year}`}
              />
            ))}
            <span className="montage-cap mono" aria-hidden="true" />
          </div>
        </div>
        <div className="hero-foot">
          <span className="mono now">
            <span className="live-dot" aria-hidden="true" />
            <span>
              <span className="sr-only">Currently: </span>
              {site.current.map((c, i) => (
                <span key={c.id}>
                  <Link href={`/experience#${c.id}`} className="link">
                    {c.label}
                  </Link>
                  {i < site.current.length - 1 && " · "}
                </span>
              ))}
            </span>
          </span>
          <span className="mono">
            <T value={site.availability} />
          </span>
          <span className="mono" aria-hidden="true">
            ↓
          </span>
        </div>
      </section>

      {/* ============ Work, hung as montage ============ */}
      <section id="work" className="wrap section" aria-labelledby="work-h">
        <SecHead
          label="01 — Work"
          id="work-h"
          side={
            <>
              Client work, hackathons and my own tools.{" "}
              <Link href="/work" className="link-u">
                The full index
              </Link>{" "}
              has everything.
            </>
          }
        >
          {featuredProjects.length} projects, <b>built to be used.</b>
        </SecHead>

        {featuredProjects.map((p, i) => (
          <article className="series" id={p.slug} key={p.slug}>
            <div className="grid12 series-grid">
              <div className="series-meta fx">
                <span className="no" aria-hidden="true">
                  {two(i + 1)}
                </span>
                <h3>
                  <Link href={`/work/${p.slug}`} className="link">
                    {p.title}
                  </Link>
                </h3>
                <p>{p.summary}</p>
                <Link href={`/work/${p.slug}`} className="ghost self-start">
                  Read the write-up <span className="arr">→</span>
                </Link>
                <ul className="specs">
                  <li className="mono">
                    Year — <b>{typeof p.year === "string" ? p.year : ""}</b>
                  </li>
                  <li className="mono">
                    Type — <b>{p.kind.split(" · ")[0]}</b>
                  </li>
                  <li className="mono">
                    Stack — <b>{p.stack.slice(0, 3).join(", ")}</b>
                  </li>
                </ul>
              </div>
              <Link
                href={`/work/${p.slug}`}
                className={`${ARRANGEMENTS[i % 3]} montage reveal`}
                aria-label={`${p.title}: read the write-up`}
              >
                <ProjectPlates project={p} sizes={{ a: "(min-width: 960px) 52vw, 90vw", c: "(min-width: 960px) 30vw, 50vw" }} />
                <span className="montage-cap mono" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* ============ Full-bleed plate ============ */}
      <section className="plate-bleed reveal" aria-label="Plate">
        <figure className="ph">
          <Image src={lynx.cover!.src} alt={lynx.cover!.alt} width={lynx.cover!.width} height={lynx.cover!.height} sizes="100vw" />
        </figure>
        <div className="wrap">
          <span className="sub block pt-3.5">
            Plate {two(featuredProjects.indexOf(lynx) + 1)} · {lynx.title} · {lynx.kind} · {typeof lynx.year === "string" ? lynx.year : ""}
          </span>
        </div>
      </section>

      {/* ============ About ============ */}
      <section id="about" className="wrap section" aria-labelledby="about-h">
        <SecHead label="02 — About" id="about-h">
          Where software <b>meets the real world.</b>
        </SecHead>
        <div className="grid12 items-start">
          <div className="about-plate montage reveal" role="group" aria-label={`Portrait of ${site.name}`}>
            <figure className="ph" data-depth="0.1">
              <Image src={portrait} alt={`Portrait of ${site.name}`} sizes="(min-width: 960px) 30vw, 90vw" placeholder="blur" />
            </figure>
          </div>
          <div className="about-copy">
            <p className="lede fx">
              I study Computer Science at Waterloo and Business at Laurier,{" "}
              <b>and build where software has to hold up in the real world.</b>
            </p>
            <div className="body-copy fx">
              <p>
                A drone that has to correct itself within 200&nbsp;ms, a data pipeline feeding a disease forecast, a
                payment form a parent has to trust.{" "}
                <Link href="/about" className="link-u text-ink">
                  More about me
                </Link>
                .
              </p>
            </div>
            <ul className="cred fx">
              {experience.map((r) => (
                <li key={r.id}>
                  <Link href={`/experience#${r.id}`} className="link">
                    {r.role}, {r.org}
                  </Link>
                  <em>
                    {yearOf(r.start)}
                    {r.end === "Present" ? "–" : yearOf(r.end) !== yearOf(r.start) ? `–${yearOf(r.end).slice(2)}` : ""}
                  </em>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ On repeat (hidden until Last.fm is configured) ============ */}
      {listening && <ListeningSection data={listening} label="03 — Listening" />}
    </>
  );
}
