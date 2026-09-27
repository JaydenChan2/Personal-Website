import type { Metadata } from "next";
import Link from "next/link";
import { container, PageFooter, PageTitle } from "@/components/container";
import { Cover } from "@/components/cover";
import { MaybeLink, T } from "@/components/text";
import { featuredProjects, minorProjects, projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Jayden Chan: client work, AI, full-stack and computer vision.",
};

export default function WorkPage() {
  const [first, ...rest] = featuredProjects;
  const more = [
    ...projects
      .filter((p) => p.featured === false)
      .map((p) => ({ title: p.title, summary: p.summary, stack: p.stack, href: `/work/${p.slug}`, internal: true })),
    ...minorProjects.map((p) => ({ ...p, internal: false })),
  ];

  return (
    <>
      <div className={`${container} pt-10 md:pt-16`}>
        <PageTitle title="Work">
          <p>Things I&rsquo;ve built for clients, at hackathons and for myself. Click into any project for the full story.</p>
        </PageTitle>

        <ul className="mt-14 grid gap-x-10 gap-y-20 md:mt-20 md:grid-cols-2">
          <li className="md:col-span-2">
            <ProjectCard project={first} wide />
          </li>
          {rest.map((p) => (
            <li key={p.slug}>
              <ProjectCard project={p} />
            </li>
          ))}
        </ul>

        <section aria-labelledby="also" className="mt-28">
          <h2 id="also" className="text-2xl tracking-tight">
            More projects
          </h2>
          <ul className="mt-6 border-t border-line">
            {more.map((p) => (
              <li key={p.title} className="grid gap-x-8 gap-y-1 border-b border-line py-6 md:grid-cols-[16rem_1fr_auto]">
                <p className="font-medium">
                  {p.internal ? (
                    <Link href={p.href as string} className="link-u">
                      {p.title} →
                    </Link>
                  ) : p.href ? (
                    <MaybeLink href={p.href}>{p.title}</MaybeLink>
                  ) : (
                    p.title
                  )}
                </p>
                <p className="text-muted">{p.summary}</p>
                <p className="label md:text-right">{p.stack.join(", ")}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <PageFooter />
    </>
  );
}

function ProjectCard({ project: p, wide = false }: { project: (typeof projects)[number]; wide?: boolean }) {
  return (
    <Link href={`/work/${p.slug}`} className="detect group relative block rounded-md">
      <div
        className={`relative overflow-hidden rounded-md bg-sunken ring-1 ring-line ${wide ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10]"}`}
      >
        <div className="size-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] motion-reduce:transition-none">
          <Cover project={p} sizes={wide ? "(min-width: 1152px) 1088px, 100vw" : "(min-width: 1152px) 540px, (min-width: 768px) 50vw, 100vw"} priority={wide} />
        </div>
        <span className="detect-box inside" data-label={p.kind} />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-6">
        <h2 className={`font-medium tracking-tight ${wide ? "text-3xl" : "text-2xl"}`}>{p.title}</h2>
        <span className="label shrink-0">
          <T value={p.year} />
        </span>
      </div>
      <p className="mt-1 max-w-[52ch] text-muted">{p.summary}</p>
    </Link>
  );
}
