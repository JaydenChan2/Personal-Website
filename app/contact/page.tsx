import type { Metadata } from "next";
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
    <div className="wrap page-top flex flex-1 flex-col justify-center">
      <div className="grid12">
        <div className="col-span-12 lg:col-span-10">
          <p className="mono fx">Contact</p>
          <h1 className="h-display fx mt-6">
            Say <b>hello.</b>
          </h1>
          <p className="fx mt-6 max-w-[40ch] text-ink-2">
            Hiring for an internship, or building something interesting? Email is the fastest way to reach me.
          </p>
          <div className="fx mt-12">
            <CopyEmail email={site.email} big />
          </div>
          <ul className="fx mt-16 max-w-[44rem] border-t border-line-2">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" className="index-row !grid-cols-[1fr_auto]">
                  <span className="ttl">
                    {l.label}
                    <ArrowOut />
                  </span>
                  <span className="med normal-case tracking-normal">{l.note}</span>
                </a>
              </li>
            ))}
          </ul>
          {site.availability && (
            <p className="mono mt-6">
              <T value={site.availability} />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
