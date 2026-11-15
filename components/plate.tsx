import Image from "next/image";
import type { Image as Img, Project } from "@/content/types";

/**
 * A "plate": one print in a montage. Either a screenshot, or a typeset card
 * (a cover for projects without a screenshot, a headline outcome, the stack).
 * Typeset plates keep fixed colours in both themes, like prints on a wall.
 */

type Common = {
  /** Position class inside a montage: "m-a" | "m-b" | "m-c". */
  className?: string;
  /** Parallax depth; plates further "forward" move more. */
  depth?: number;
  /** Mirrored into the montage's caption line on hover. */
  caption?: string;
};

export function ImagePlate({
  image,
  sizes,
  priority = false,
  className = "",
  depth,
  caption,
}: Common & { image: Img; sizes: string; priority?: boolean }) {
  return (
    <figure className={`ph ${className}`} data-depth={depth}>
      <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} />
      {caption && <figcaption className="cap">{caption}</figcaption>}
    </figure>
  );
}

type CoverProject = Pick<Project, "title" | "stack" | "cover">;

/** The project's screenshot, or a typeset card with its title and stack. */
export function CoverPlate({
  project,
  sizes,
  priority,
  className = "",
  depth,
  caption,
}: Common & { project: CoverProject; sizes: string; priority?: boolean }) {
  if (project.cover) {
    return <ImagePlate image={project.cover} sizes={sizes} priority={priority} className={className} depth={depth} caption={caption} />;
  }
  return (
    <figure className={`ph ph--type ph--ink ${className}`} data-depth={depth}>
      <span className="t-label">{project.stack.slice(0, 3).join(" / ")}</span>
      <span className="t-title">{project.title}</span>
      {caption && <figcaption className="cap">{caption}</figcaption>}
    </figure>
  );
}

export function StatPlate({ stat, className = "", depth, caption }: Common & { stat: NonNullable<Project["stat"]> }) {
  return (
    <figure className={`ph ph--type ph--paper ${className}`} data-depth={depth}>
      <span className="t-label">Outcome</span>
      <span>
        <span className="t-stat block">{stat.value}</span>
        <span className="t-body mt-2 block">{stat.label}</span>
      </span>
      {caption && <figcaption className="cap">{caption}</figcaption>}
    </figure>
  );
}

export function StackPlate({ stack, className = "", depth, caption }: Common & { stack: string[] }) {
  return (
    <figure className={`ph ph--type ph--ink ${className}`} data-depth={depth}>
      <span className="t-label">Stack</span>
      <span className="t-list">
        {stack.slice(0, 6).map((s) => (
          <span key={s} className="block">
            {s}
          </span>
        ))}
      </span>
      {caption && <figcaption className="cap">{caption}</figcaption>}
    </figure>
  );
}

/** The three plates hung for a project: cover, headline outcome, and a second screenshot or the stack. */
export function ProjectPlates({ project: p, sizes }: { project: Project; sizes: { a: string; c: string } }) {
  const second = p.gallery?.[0];
  return (
    <>
      <CoverPlate project={p} sizes={sizes.a} className="m-a" depth={0.06} caption={`${p.title} — ${p.kind}`} />
      {p.stat ? (
        <StatPlate stat={p.stat} className="m-b" depth={0.2} caption={`${p.stat.value} — ${p.stat.label}`} />
      ) : (
        <StackPlate stack={p.stack} className="m-b" depth={0.2} caption={`Stack — ${p.stack.join(", ")}`} />
      )}
      {second ? (
        <ImagePlate image={second} sizes={sizes.c} className="m-c" depth={0.34} caption={second.caption} />
      ) : (
        <StackPlate stack={p.stack} className="m-c" depth={0.34} caption={`Stack — ${p.stack.join(", ")}`} />
      )}
    </>
  );
}
