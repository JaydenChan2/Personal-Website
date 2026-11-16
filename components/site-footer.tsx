"use client";

import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { CopyEmail } from "./copy-email";
import { ArrowOut } from "./text";

/** Site-wide footer: the email at display size, then links and the colophon. */
export function SiteFooter() {
  const pathname = usePathname();
  // The contact page already leads with the address; don't repeat it.
  const showMail = pathname !== "/contact";

  return (
    <footer className="wrap foot" aria-label="Contact and links">
      <hr className="border-line" />
      {showMail && (
        <div className="pt-[clamp(48px,8vh,90px)]">
          <h2 className="mono fx mb-6">Contact</h2>
          <div className="fx">
            <CopyEmail email={site.email} big />
          </div>
        </div>
      )}
      <div className="foot-cols">
        <div className="col">
          <span className="mono">Elsewhere</span>
          <a href={site.github} target="_blank" rel="noreferrer" className="link justify-self-start">
            GitHub
            <ArrowOut />
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" className="link justify-self-start">
            LinkedIn
            <ArrowOut />
          </a>
          {site.resume && (
            <a href={site.resume} target="_blank" rel="noreferrer" className="link justify-self-start">
              Resume
              <ArrowOut />
            </a>
          )}
        </div>
        <div className="col">
          <span className="mono">Colophon</span>
          <span>Set in Helvetica.</span>
          <span>© {new Date().getFullYear()} {site.name}</span>
        </div>
      </div>
    </footer>
  );
}
