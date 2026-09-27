import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { container, grid, SectionHeading } from "./layout";
import { ArrowOut } from "./text";

export function Experience() {
  return (
    <section aria-labelledby="experience" className={`${container} py-16 md:py-24`}>
      <SectionHeading index="02" title="Experience" id="experience" />

      <ol className="mt-10 md:mt-14">
        {experience.map((r) => (
          <li key={r.id} id={r.id} className={`${grid} scroll-mt-24 gap-y-2 border-t border-rule py-6 first:border-t-0 first:pt-0`}>
            <p className="meta col-span-12 md:col-span-3 md:pt-1">
              <time>{r.start}</time> – <time>{r.end}</time>
            </p>
            <div className="col-span-12 md:col-span-9">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-sans text-lg font-medium tracking-normal">
                  {r.role}
                  <span className="text-muted max-sm:hidden"> · </span>
                  <br className="sm:hidden" />
                  {r.href ? (
                    <a href={r.href} target="_blank" rel="noreferrer" className="link font-normal">
                      {r.org}
                      <ArrowOut />
                    </a>
                  ) : (
                    <span className="font-normal">{r.org}</span>
                  )}
                </h3>
                <p className="meta">{r.location}</p>
              </div>
              <p className="mt-2 max-w-[68ch] text-muted">
                {r.summary}
                {r.seeAlso && (
                  <>
                    {" "}
                    <a href={`#${r.seeAlso}`} className="link whitespace-nowrap text-ink">
                      Write-up ↑
                    </a>
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className={`${grid} mt-4 gap-y-2 border-t border-rule pt-8`}>
        <h3 className="meta col-span-12 md:col-span-3 md:pt-1">Education</h3>
        <div className="col-span-12 md:col-span-9">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <p className="text-lg font-medium">{site.education.school}</p>
            <p className="meta">Grad. {site.education.end}</p>
          </div>
          <p className="mt-1 text-muted">{site.education.degree}</p>
          <p className="mt-2 text-sm text-muted">
            <span className="text-ink">Coursework:</span> {site.education.coursework.join(", ")}
          </p>
        </div>
      </div>
    </section>
  );
}
