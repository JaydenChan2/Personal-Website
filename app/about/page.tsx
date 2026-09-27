import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { container, PageFooter, PageTitle } from "@/components/container";
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
    <>
      <div className={`${container} pt-10 md:pt-16`}>
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <PageTitle title="About" />
            {/* Draft written from facts on the old site and resume. Rewrite it in your own voice. */}
            <div className="mt-8 space-y-5 text-lede">
              <p>
                I&rsquo;m studying Computer Science at Waterloo and Business at Laurier. Most of what I build sits where
                software meets the real world: a drone that has to correct itself within 200&nbsp;ms, a data pipeline
                feeding a disease forecast, a payment form a parent has to trust.
              </p>
              <p className="text-muted">
                Before university I started an AI and game development club at my high school and taught it for a
                year: 40+ members, neural networks built from scratch, and two teams in the board&rsquo;s top five.
              </p>
              <p className="text-muted">
                If you&rsquo;re hiring for software or ML internships,{" "}
                <Link href="/contact" className="link-u text-ink">
                  say hello
                </Link>
                .
              </p>
            </div>
          </div>
          <figure className="md:col-span-4 md:col-start-9 md:pt-3">
            <div className="detect relative max-w-[20rem]">
              <Image
                src={portrait}
                alt="Portrait of Jayden Chan"
                sizes="(min-width: 768px) 320px, 80vw"
                placeholder="blur"
                priority
                className="h-auto w-full rounded-md"
              />
              <span className="detect-box" data-label="person · Jayden" />
            </div>
          </figure>
        </div>

        <section aria-labelledby="offline" className="mt-20 md:mt-28">
          <h2 id="offline" className="text-2xl tracking-tight">
            Away from the keyboard
          </h2>
          <ul className="mt-6 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
            {offline.map((o) => (
              <li key={o.title} >
                <p className="font-medium">{o.title}</p>
                <p className="mt-1 text-muted">{o.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <PageFooter />
    </>
  );
}
