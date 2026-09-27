import type { Text } from "./types";

export const site = {
  name: "Jayden Chan",
  url: "https://www.jaydenchan.xyz",
  title: "Jayden Chan",
  description:
    "Jayden Chan is a Computer Science + Business student at Waterloo & Laurier who builds real-time vision systems, data pipelines, and products people actually use.",

  intro:
    "CS + Business at Waterloo & Laurier. I build real-time vision systems, data pipelines, and products people actually use.",
  /** Shown next to the live dot on the home page. Each links to /experience#id. */
  current: [
    { label: "Autonomy at WARG", id: "warg" },
    { label: "SWE intern at World Health Network", id: "whn" },
  ],
  // Carried over from the previous site ("Open Any Term"). Update, or set to "" to hide.
  availability: "Open to software and ML internships, any term." as Text,

  email: "chanjayden31@gmail.com",
  github: "https://github.com/JaydenChan2",
  linkedin: "https://www.linkedin.com/in/jayden-d-chan/",
  /**
   * Resume link, off for now. To bring it back, drop the PDF in /public and set this
   * to e.g. "/Jayden_Chan_Resume.pdf". It then appears in the nav and on the home page.
   */
  resume: null as string | null,

  education: {
    school: "University of Waterloo & Wilfrid Laurier University",
    degree: "Bachelor of Computer Science + Bachelor of Business Administration, Double Degree with Co-op",
    end: "June 2030",
    coursework: [
      "Algorithm Design & Data Abstraction",
      "Object-Oriented Design",
      "Logic & Computation",
      "Probability",
    ],
  },
};
