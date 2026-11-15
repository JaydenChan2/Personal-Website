import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SecHead } from "@/components/container";
import portrait from "@/public/me.png";

export const metadata: Metadata = {
  title: "About",
  description: "A little about Jayden Chan, outside the resume.",
};

const offline = [
  { title: "Guitar", body: "Can play Isn't She Lovely, Until I Found You and Blue. Currently learning Out Getting Ribs." },
  { title: "Badminton", body: "ROPSSAA finalist in high school, then three years coaching at a local club." },
  { title: "Anime films", body: "A long list, ranked. I Want to Eat Your Pancreas is the only 10/10." },
];

export default function AboutPage() {
  return (
    <div className="wrap page-top pb-[clamp(72px,11vh,130px)]">
      <SecHead as="h1" label="About">
        A little about me, <b>outside the resume.</b>
      </SecHead>

      <div className="grid12 items-start">
        <div className="about-plate montage reveal" role="group" aria-label="Portrait of Jayden Chan">
          <figure className="ph" data-depth="0.1">
            <Image src={portrait} alt="Portrait of Jayden Chan" sizes="(min-width: 960px) 30vw, 90vw" placeholder="blur" priority />
          </figure>
        </div>
        {/* Draft written from facts on the old site and resume. Rewrite it in your own voice. */}
        <div className="about-copy">
          <p className="lede fx">
            I&rsquo;m studying Computer Science at Waterloo and Business at Laurier.{" "}
            <b>Most of what I build sits where software meets the real world:</b> a drone that has to correct itself
            within 200&nbsp;ms, a data pipeline feeding a disease forecast, a payment form a parent has to trust.
          </p>
          <div className="body-copy fx">
            <p>
              Before university I started an AI and game development club at my high school and taught it for a year:
              40+ members, neural networks built from scratch, and two teams in the board&rsquo;s top five.
            </p>
            <p>
              If you&rsquo;re hiring for software or ML internships,{" "}
              <Link href="/contact" className="link-u text-ink">
                say hello
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <section aria-labelledby="offline" className="mt-[clamp(72px,11vh,130px)]">
        <h2 id="offline" className="mono fx mb-6">
          Away from the keyboard
        </h2>
        <ul className="grid12 border-t border-line pt-6">
          {offline.map((o, i) => (
            <li key={o.title} className="fx col-span-12 md:col-span-4">
              <p className="sub">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 text-[19px] font-semibold">{o.title}</p>
              <p className="mt-1 max-w-[34ch] text-ink-2">{o.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
