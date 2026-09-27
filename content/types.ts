/**
 * Content types. Everything on the page is rendered from the files in /content,
 * so adding a project or a job never means touching layout code.
 */

/** A clearly marked gap. Renders as a dashed "TODO" chip so it can't ship unnoticed. */
export type Todo = { todo: string };

/** Plain text, or a placeholder that still needs real content. */
export type Text = string | Todo;

export const todo = (note: string): Todo => ({ todo: note });
export const isTodo = (t: unknown): t is Todo =>
  typeof t === "object" && t !== null && "todo" in t;

export type Link = { label: string; href: Text };

export type Media =
  | {
      kind: "youtube";
      id: string;
      title: string;
      caption: string;
      /** Which YouTube thumbnail to use. maxresdefault only exists for HD uploads. */
      thumb?: "maxresdefault" | "sddefault" | "hqdefault";
      /** "designed" swaps the YouTube frame for a typeset card (use when the thumbnail is low-res or off-brand). */
      poster?: "youtube" | "designed";
    }
  | { kind: "image"; src: string; alt: string; width: number; height: number; caption: string }
  | { kind: "placeholder"; note: string; caption: string };

export type Result = {
  /** The headline figure, e.g. "< 50 ms". Only use numbers you can defend in an interview. */
  value: string;
  label: string;
};

export type Project = {
  slug: string;
  title: string;
  /** One sentence: what it is. */
  summary: string;
  /** "lead" gets the large, full-width treatment. Use it for one project only. */
  prominence: "lead" | "standard";
  year?: Text;
  role?: string;
  problem: Text;
  built: Text;
  decision: { title: string; body: Text };
  results?: Result[];
  stack: string[];
  links: Link[];
  media?: Media;
};

/** Smaller projects listed in a single line each under "Also built". */
export type MinorProject = {
  title: string;
  summary: string;
  stack: string[];
  href?: Text;
};

export type Role = {
  /** Anchor id, e.g. #exp-warg. */
  id: string;
  role: string;
  org: string;
  href?: string;
  start: string;
  end: string;
  location: string;
  /** One or two scannable lines. Lead with the result. */
  summary: string;
  /** Anchor to a project write-up on this page, if there is one. */
  seeAlso?: string;
};
