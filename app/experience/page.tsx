import type { Metadata } from "next";
import Link from "next/link";
import { container, PageFooter, PageTitle } from "@/components/container";
import { ArrowOut } from "@/components/text";
import { experience } from "@/content/experience";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Experience",
  description: "Jayden Chan's internships, engineering team work and teaching.",
};

export default function ExperiencePage() {
  return (
    <>
      <div className={`${container} pt-10 md:pt-16`}>
        <div>
          <PageTitle title="Experience">
            <p>Internships, a student design team, client work, and the club I started in high school.</p>
          </PageTitle>
        </div>

        <ol className="relative mt-16 md:mt-24">
          {experience.map((r) => (
            <li
              key={r.id}
              id={r.id}
              className="group relative grid scroll-mt-24 gap-x-8 gap-y-3 border-t border-line py-10 md:grid-cols-12"
            >
              <div className="md:col-span-3">
                <p className="flex items-center gap-2 text-[0.9375rem] text-muted">
                  {r.current && (
                    <span className="live-dot relative inline-block size-2 rounded-full bg-live" aria-hidden="true" />
                  )}
                  <span>
                    {r.start} – {r.end}
                  </span>
                  {r.current && <span className="sr-only">(current)</span>}
                </p>
                <p className="label mt-1">{r.location}</p>
              </div>
              <div className="md:col-span-9">
                <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
                  {r.role}{" "}
                  <span className="text-muted">
                    at{" "}
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noreferrer" className="link text-ink">
                        {r.org}
                        <ArrowOut />
                      </a>
                    ) : (
                      <span className="text-ink">{r.org}</span>
                    )}
                  </span>
                </h2>
                <ul className="mt-5 max-w-[66ch] space-y-3 text-muted">
                  {r.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.72em] h-px w-3 shrink-0 bg-line-strong" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                {r.project && (
                  <Link href={`/work/${r.project}`} className="link-u mt-4 inline-block text-[0.9375rem]">
                    Read the project write-up →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>

        <section aria-labelledby="edu" className="grid gap-x-8 gap-y-3 border-t border-line py-8 md:grid-cols-12">
          <h2 id="edu" className="label md:col-span-3 md:pt-1.5">
            Education
          </h2>
          <div className="md:col-span-9">
            <p className="text-xl font-medium tracking-tight sm:text-2xl">{site.education.school}</p>
            <p className="mt-1 text-muted">
              {site.education.degree}, graduating {site.education.end}
            </p>
            <p className="label mt-3">Coursework: {site.education.coursework.join(", ")}</p>
          </div>
        </section>
      </div>
      <PageFooter />
    </>
  );
}
