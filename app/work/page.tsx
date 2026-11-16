import type { Metadata } from "next";
import { SecHead } from "@/components/container";
import { CoverPlate } from "@/components/plate";
import { ProjectIndex, type IndexItem } from "@/components/project-index";
import { isTodo } from "@/content/types";
import { minorProjects, projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by Jayden Chan: client work, AI, full-stack and computer vision.",
};

export default function WorkPage() {
  const items: IndexItem[] = [
    ...projects.map((p, i) => ({
      key: p.slug,
      no: `P-${String(i + 1).padStart(2, "0")}`,
      title: p.title,
      summary: p.summary,
      kind: p.kind.split(" · ").pop() ?? p.kind,
      year: isTodo(p.year) ? "" : p.year,
      href: `/work/${p.slug}`,
      art: <CoverPlate project={p} sizes="(min-width: 960px) 30vw, 64px" className="ph-fill" />,
    })),
    ...minorProjects.map((p, i) => ({
      key: p.title,
      no: `P-${String(projects.length + i + 1).padStart(2, "0")}`,
      title: p.title,
      summary: p.summary,
      kind: "Side project",
      year: "↗",
      href: p.href && !isTodo(p.href) ? p.href : "#",
      external: true,
      art: <CoverPlate project={p} sizes="1px" className="ph-fill" />,
    })),
  ];

  return (
    <section className="index-sec page-top pb-[clamp(72px,11vh,130px)]">
      <div className="wrap">
        <SecHead as="h1" label="Work — Index" side="Move along the list: each entry carries its cover with it. Click through for the full story.">
          Everything I&rsquo;ve built, <b>catalogued.</b>
        </SecHead>
        <ProjectIndex items={items} />
      </div>
    </section>
  );
}
