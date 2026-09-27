import { site } from "@/content/site";
import { CopyEmail } from "./copy-email";
import { container, grid, SectionHeading } from "./layout";
import { ArrowOut } from "./text";

export function Contact() {
  return (
    <section aria-labelledby="contact" className={`${container} py-16 md:py-24`}>
      <SectionHeading index="04" title="Contact" id="contact" />
      <div className={`${grid} mt-10 md:mt-14`}>
        <div className="col-span-12 md:col-span-9 md:col-start-4">
          <p className="max-w-[28ch] font-serif text-lede sm:text-[1.875rem] sm:leading-[1.2]">
            Hiring for an internship, or building something interesting? Email is the fastest way to reach me.
          </p>
          <div className="mt-8 flex flex-col gap-4 text-lg sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-8">
            <CopyEmail email={site.email} />
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="link">
              LinkedIn
              <ArrowOut />
            </a>
            <a href={site.github} target="_blank" rel="noreferrer" className="link">
              GitHub
              <ArrowOut />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
