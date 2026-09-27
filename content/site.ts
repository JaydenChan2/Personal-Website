import { type Text } from "./types";

export const site = {
  name: "Jayden Chan",
  url: "https://www.jaydenchan.xyz",
  title: "Jayden Chan · Software & ML",
  description:
    "Jayden Chan: Computer Science + Business student at Waterloo & Laurier building real-time vision systems, data pipelines, and products people actually use.",

  kicker: "CS + Business · Waterloo & Laurier · 2030",
  headline: "I build real-time vision systems, data pipelines, and products people actually use.",
  // Rendered with links to the matching experience entries (see components/hero.tsx).
  now: [
    { text: "Currently engineering autonomy at " },
    { text: "WARG", href: "#exp-warg" },
    { text: " and data pipelines at " },
    { text: "World Health Network", href: "#exp-whn" },
    { text: "." },
  ] as { text: string; href?: string }[],
  // Carried over from the previous site ("Open Any Term"). Update or set to "" to hide.
  availability: "Open to software and ML internships, any term." as Text,

  email: "chanjayden31@gmail.com",
  github: "https://github.com/JaydenChan2",
  linkedin: "https://www.linkedin.com/in/jayden-d-chan/",
  /**
   * Resume link. Deliberately off for now. To bring it back, drop the PDF in /public
   * and set this to e.g. "/Jayden_Chan_Resume.pdf"; the header and hero pick it up.
   */
  resume: null as string | null,

  education: {
    school: "University of Waterloo & Wilfrid Laurier University",
    degree: "BCS + BBA, Double Degree with Co-op",
    end: "June 2030",
    coursework: [
      "Algorithm Design & Data Abstraction",
      "Object-Oriented Design",
      "Logic & Computation",
      "Probability",
    ],
  },
};
