import Image from "next/image";
import portrait from "@/public/me.png";
import { container, grid, SectionHeading } from "./layout";

export function About() {
  return (
    <section aria-labelledby="about" className={`${container} py-16 md:py-24`}>
      <SectionHeading index="03" title="About" id="about" />

      <div className={`${grid} mt-10 gap-y-8 md:mt-14`}>
        <figure className="col-span-5 sm:col-span-4 md:col-span-3">
          <Image
            src={portrait}
            alt="Portrait of Jayden Chan"
            sizes="(min-width: 768px) 220px, 40vw"
            placeholder="blur"
            className="h-auto w-full max-w-[13.75rem] grayscale-[35%]"
          />
        </figure>

        {/* Draft written from facts on the old site and resume. Rewrite it in your own voice. */}
        <div className="col-span-12 space-y-5 font-serif text-lede md:col-span-7">
          <p>
            I study Computer Science at Waterloo and Business at Laurier. Most of what I build sits where
            software meets the physical world: a drone that has to correct itself within 200&nbsp;ms, a data
            pipeline feeding a disease forecast, a payment form a parent has to trust.
          </p>
          <p>
            Before university I started an AI and game development club at my high school and taught it
            for a year: forty-odd members, neural networks built from scratch, and two teams in the
            board&rsquo;s top five.
          </p>
          <p className="text-muted">
            Away from the keyboard: guitar, badminton (ROPSSAA finalist, then three years coaching at a local
            club), and a long list of anime films. <i>I Want to Eat Your Pancreas</i> is the only 10/10.
          </p>
        </div>
      </div>
    </section>
  );
}
