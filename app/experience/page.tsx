import type { Metadata } from "next";
import Link from "next/link";
import { SecHead } from "@/components/container";
import { OrgLogo } from "@/components/org-logo";
import { ArrowOut } from "@/components/text";
import { experience } from "@/content/experience";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Experience",
  description: "Jayden Chan's internships, engineering team work and teaching.",
};

export default function ExperiencePage() {
  return (
    <div className="wrap page-top pb-[clamp(72px,11vh,130px)]">
      <SecHead as="h1" label="Experience" side="Internships, a student design team, client work, and the club I started in high school.">
        Where I&rsquo;ve worked, <b>and what shipped.</b>
      </SecHead>

      <ol>
        {experience.map((r, i) => (
          <li key={r.id} id={r.id} className="row fx">
            <div className="row-label">
              <OrgLogo role={r} />
              <p className="mono mt-5 flex items-center gap-2.5">
                {r.current && <span className="live-dot" aria-hidden="true" />}
                <span>
                  {r.start} – {r.end}
                </span>
                {r.current && <span className="sr-only">(current)</span>}
              </p>
              <p className="sub mt-1">
                {String(i + 1).padStart(2, "0")} · {r.location}
              </p>
            </div>
            <div className="row-body">
              <h2 className="text-[clamp(1.25rem,1.9vw,1.6rem)] font-light leading-tight tracking-[-0.01em]">
                {r.role},{" "}
                <b className="font-semibold">
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noreferrer" className="link">
                      {r.org}
                      <ArrowOut />
                    </a>
                  ) : (
                    r.org
                  )}
                </b>
              </h2>
              <ul className="ticks mt-5 max-w-[66ch]">
                {r.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
              {r.project && (
                <Link href={`/work/${r.project}`} className="ghost mt-6 inline-block">
                  Read the project write-up <span className="arr">→</span>
                </Link>
              )}
            </div>
          </li>
        ))}
        <li id="education" className="row fx">
          <div className="row-label">
            <p className="mono">Graduating {site.education.end}</p>
            <p className="sub mt-1">Education</p>
          </div>
          <div className="row-body">
            <h2 className="text-[clamp(1.25rem,1.9vw,1.6rem)] font-light leading-tight tracking-[-0.01em]">
              <b className="font-semibold">{site.education.school}</b>
            </h2>
            <p className="mt-3 text-ink-2">{site.education.degree}</p>
            <ul className="cred mt-6">
              {site.education.coursework.map((c) => (
                <li key={c}>
                  {c}
                  <em>Coursework</em>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ol>
    </div>
  );
}
