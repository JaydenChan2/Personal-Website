import Image from "next/image";
import type { Project } from "@/content/types";

type CoverProject = Pick<Project, "title" | "stack" | "cover">;

/**
 * A project's visual: its screenshot if it has one, otherwise a typeset card
 * (title + stack) so projects without screenshots still look deliberate.
 */
export function Cover({
  project,
  sizes,
  priority = false,
  className = "",
}: {
  project: CoverProject;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (project.cover) {
    return (
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        width={project.cover.width}
        height={project.cover.height}
        sizes={sizes}
        priority={priority}
        className={`size-full object-cover object-top ${className}`}
      />
    );
  }
  return (
    <div className={`flex size-full flex-col justify-between bg-ink p-[6%] text-bg ${className}`}>
      <p className="text-sm opacity-70">{project.stack.slice(0, 4).join(" / ")}</p>
      <p className="text-[clamp(1.75rem,1rem+2.6vw,3rem)] font-medium leading-[0.95] tracking-[-0.035em]">
        {project.title}
      </p>
    </div>
  );
}
