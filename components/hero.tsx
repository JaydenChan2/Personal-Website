import { site } from "@/content/site";
import { CopyEmail } from "./copy-email";
import { FaceMesh } from "./face-mesh";
import { container, grid } from "./layout";
import { ArrowOut, T } from "./text";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-name" className={`${container} pb-12 pt-10 sm:pt-16 md:pb-16`}>
      <div className={`${grid} gap-y-10 md:items-center`}>
        <div className="col-span-12 md:col-span-7">
          <p className="meta mb-6">{site.kicker}</p>
          <h1 id="hero-name" className="text-display -ml-[0.04em]">
            Jayden
            <br />
            Chan
          </h1>
          <p className="mt-8 max-w-[26ch] font-serif text-lede sm:text-[1.875rem] sm:leading-[1.2]">
            {site.headline}
          </p>
          <p className="mt-5 max-w-[46ch] text-muted">
            {site.now.map((part) =>
              part.href ? (
                <a key={part.text} href={part.href} className="link text-ink">
                  {part.text}
                </a>
              ) : (
                part.text
              ),
            )}{" "}
            {site.availability && <T value={site.availability} />}
          </p>

          <ul className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-3">
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
                  Resume (PDF)
                  <ArrowOut />
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Phones: a small figure with its caption alongside, like a margin figure. */}
        <figure className="col-span-12 flex items-end gap-5 md:col-span-5 md:block">
          <div className="w-[34%] shrink-0 overflow-hidden sm:w-[28%] md:ml-auto md:w-full md:max-w-[34rem] md:overflow-visible">
            <FaceMesh />
          </div>
          <figcaption className="meta md:mt-4 md:text-right">
            <span className="text-ink">Fig. 0</span> · 468 facial landmarks, MediaPipe canonical mesh
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
