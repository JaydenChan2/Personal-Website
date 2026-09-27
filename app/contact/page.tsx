import type { Metadata } from "next";
import { container, PageFooter } from "@/components/container";
import { CopyEmail } from "@/components/copy-email";
import { ArrowOut, T } from "@/components/text";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jayden Chan.",
};

export default function ContactPage() {
  const links = [
    { label: "LinkedIn", href: site.linkedin, note: "linkedin.com/in/jayden-d-chan" },
    { label: "GitHub", href: site.github, note: "github.com/JaydenChan2" },
  ];

  return (
    <>
      <div className={`${container} flex flex-1 flex-col justify-center py-12`}>
        <div className="max-w-[46rem]">
          <p className="intro-item label">Contact</p>
          <h1 className="intro-item mt-3 text-display" style={{ "--d": "40ms" } as React.CSSProperties}>
            Say hello.
          </h1>
          <p className="intro-item mt-8 max-w-[34ch] text-lede text-muted" style={{ "--d": "80ms" } as React.CSSProperties}>
            Hiring for an internship, or building something interesting? Email is the fastest way to reach me.
          </p>
          <div className="intro-item mt-8 text-xl sm:text-2xl" style={{ "--d": "120ms" } as React.CSSProperties}>
            <CopyEmail email={site.email} />
          </div>
          <ul className="intro-item mt-14 border-t border-line" style={{ "--d": "160ms" } as React.CSSProperties}>
            {links.map((l) => (
              <li key={l.label} className="border-b border-line">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-6 py-4"
                >
                  <span className="font-medium">
                    {l.label}
                    <ArrowOut />
                  </span>
                  <span className="label transition-colors group-hover:text-ink">{l.note}</span>
                </a>
              </li>
            ))}
          </ul>
          {site.availability && (
            <p className="label mt-6">
              <T value={site.availability} />
            </p>
          )}
        </div>
      </div>
    </>
  );
}
