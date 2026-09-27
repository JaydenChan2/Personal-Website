/**
 * Content types. Everything on the site is rendered from the files in /content,
 * so adding a project or a job never means touching layout code.
 */

/** A clearly marked gap. Renders as a dashed "TODO" chip so it can't ship unnoticed. */
export type Todo = { todo: string };

/** Plain text, or a placeholder that still needs real content. */
export type Text = string | Todo;

export const todo = (note: string): Todo => ({ todo: note });
export const isTodo = (t: unknown): t is Todo =>
  typeof t === "object" && t !== null && "todo" in t;

export type Image = { src: string; alt: string; width: number; height: number };

export type Project = {
  /** URL: /work/<slug> */
  slug: string;
  title: string;
  /** One line, shown in lists and cards. */
  summary: string;
  /** false = listed under "More projects" instead of the card grid and the home page. */
  featured?: boolean;
  /** Short category, shown on the hover tag, e.g. "Web · Nonprofit". */
  kind: string;
  year: Text;
  role?: string;
  stack: string[];
  live?: Text;
  source?: string;
  /** Screenshot used for the card, the home preview and the top of the project page. */
  cover?: Image;
  /** Extra screenshots shown on the project page. */
  gallery?: (Image & { caption: string })[];
  /** Click-to-load YouTube demo on the project page. */
  video?: { id: string; title: string };

  problem: Text;
  built: Text;
  decision: { title: string; body: Text };
  /** Plain-language outcomes. Real numbers only. */
  outcomes?: string[];
};

/** Smaller projects, listed one line each at the bottom of /work. */
export type MinorProject = {
  title: string;
  summary: string;
  stack: string[];
  href?: Text;
};

export type Role = {
  /** Anchor id, e.g. /experience#warg */
  id: string;
  role: string;
  org: string;
  href?: string;
  start: string;
  end: string;
  location: string;
  current?: boolean;
  /** Scannable bullets. Lead with the result. */
  points: string[];
  /** Slug of a related project page. */
  project?: string;
};
