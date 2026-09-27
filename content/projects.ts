import { todo, type MinorProject, type Project } from "./types";

/**
 * Projects, in display order. The first one gets the wide card on /work and is the
 * default preview on the home page. Every number comes from Jayden's resume; don't
 * add one you can't back up in an interview.
 */
export const projects: Project[] = [
  {
    slug: "geniboo",
    title: "GENIBOO",
    summary: "Bilingual registration and payments for a children's nonprofit.",
    kind: "Client work · Web",
    year: "2026",
    role: "Full-stack developer (part-time), with HRSPRO",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Stripe"],
    live: "https://www.geniboo.ca/",
    cover: {
      src: "/work/geniboo.jpg",
      alt: "GENIBOO home page: 'Enriching Families, Empowering Youth' on a dark navy background.",
      width: 1920,
      height: 1200,
    },
    gallery: [
      {
        src: "/work/geniboo-fr.jpg",
        alt: "The same GENIBOO page switched to French.",
        width: 1920,
        height: 1200,
        caption: "The same page in French. The switch happens in place, on the same URL.",
      },
    ],
    problem:
      "GENIBOO runs before- and after-school programs, camps, STEM and arts for kids in Rockland, Ontario. Families needed one place to register for nine program categories, apply for financial assistance and donate, in English or French.",
    built:
      "A Next.js App Router site with Stripe-backed flows for program fees, financial-assistance applications and donations. I worked directly with the Executive Director through regular check-ins, turning program needs into scoped features against a fixed brief.",
    decision: {
      title: "Hand-rolled i18n and theming, no libraries",
      body: todo(
        "The site already switches EN/FR in place on the same URL. Add a sentence or two on how it works (how translations are stored and typed) and why you skipped an i18n library.",
      ),
    },
    outcomes: [
      "Live at geniboo.ca, serving nine program categories.",
      "Program fees, financial-assistance applications and donations all run through Stripe.",
      "English and French throughout, plus light and dark themes, with no i18n or theming dependencies.",
    ],
  },
  {
    slug: "lynx",
    title: "Lynx",
    summary: "A RAG co-pilot that turns technical IP into an investor thesis, then pitches it to a simulated VC.",
    kind: "Team project · AI",
    year: "2026",
    role: "Team project",
    stack: ["Python", "FastAPI", "RAG", "Gemini", "ElevenLabs", "React"],
    live: "https://hack-canada-seven.vercel.app",
    source: "https://github.com/JaydenChan2/Lynx",
    cover: {
      src: "/work/lynx.jpg",
      alt: "Lynx landing page: the word LYNX in glowing green outline letters on black.",
      width: 1920,
      height: 1200,
    },
    video: { id: "FsvDk2D9g6U", title: "Lynx demo" },
    problem:
      "Technical founders sit on pages of IP documentation that investors won't read. Turning it into a thesis, and working out which investors are actually a fit, takes hours.",
    built:
      "A FastAPI RAG pipeline parses the documents into a structured knowledge graph. A REST layer connects that to an investor-matching engine, and a real-time pitch simulator uses Gemini for investor personas and ElevenLabs for their voices.",
    decision: {
      title: "Async end to end, so the simulated VC can keep up",
      body: "Every turn of the pitch simulator calls both Gemini and ElevenLabs. Handling those requests asynchronously kept responses under 800 ms, fast enough for the exchange to feel like a conversation rather than a queue.",
    },
    outcomes: [
      "Parses 50+ pages of technical documentation in under 2 minutes, down from several hours by hand.",
      "85% mandate-alignment accuracy across 40+ investor profiles.",
      "Sub-800 ms responses in the live pitch simulator.",
    ],
  },
  {
    slug: "job-tracker",
    title: "Job Application Tracker",
    summary: "A full-stack tracker for co-op applications, with a full history of every status change.",
    kind: "Personal project · Full-stack",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Express", "PostgreSQL", "Prisma", "Docker"],
    live: "https://job-application-tracker-nine-jade.vercel.app",
    source: "https://github.com/JaydenChan2/Job-Application-Tracker",
    problem:
      "Co-op season means dozens of applications at once, each moving through its own stages. A spreadsheet only tells you where things stand today, not how they got there.",
    built:
      "A Next.js front end over an Express and TypeScript REST API with 11 endpoints. Every user route is behind JWT authentication with bcrypt-hashed passwords, and the data lives in PostgreSQL, modelled with Prisma across 5 related entities.",
    decision: {
      title: "Log every status change, not just the current one",
      body: "Status transitions are written to a history table automatically, so the full path of an application (applied, interview, offer) is kept instead of being overwritten by its latest state.",
    },
    outcomes: [
      "Front end, API and database deployed separately on Vercel, Render and Neon.",
      "Prisma migrations run automatically on every deploy.",
      "Cross-origin auth configured between the separately hosted services.",
    ],
  },
  {
    slug: "facet",
    // Formerly "Chud.ai". The repo is still named chud-ai.
    title: "Facet",
    summary: "Real-time facial geometry analysis from a webcam feed.",
    featured: false,
    kind: "Personal project · Computer vision",
    year: todo("Year built"),
    stack: ["Python", "Flask", "MediaPipe", "OpenCV", "NumPy"],
    source: "https://github.com/JaydenChan2/chud-ai",
    video: { id: "Jv91GEhY3nk", title: "Facet demo" },
    problem:
      "Facial proportions are usually judged by eye, which makes them subjective and hard to reproduce. I wanted objective measurements, computed live from an ordinary webcam.",
    built:
      "A Python and Flask service that tracks 468 facial landmarks per frame with MediaPipe and OpenCV. A NumPy geometry engine turns those points into five proportion metrics and streams them to a browser dashboard.",
    decision: {
      title: "Score a ten-second window, not a single frame",
      body: "Per-frame measurements shift with head pose and lighting, so the app averages every metric across a ten-second scan before locking a final score. It trades instant feedback for results that repeat from one run to the next.",
    },
    outcomes: ["468 landmarks per frame at under 50 ms per frame (24 fps)."],
  },
];

export const minorProjects: MinorProject[] = [
  {
    title: "Music to Sheet Converter",
    summary: "Turns MP3 and MP4 guitar recordings into tabs and sheet music with Librosa signal analysis.",
    stack: ["React", "Flask", "Librosa", "NumPy"],
    href: "https://github.com/JaydenChan2/Music-to-Sheet-Converter",
  },
  {
    title: "Stock Analyzer",
    summary: "RSI and Bollinger Band signals from live market data, plus budget allocation across the strongest picks.",
    stack: ["Python", "Flask", "Pandas"],
    href: "https://github.com/JaydenChan2/Stock-Prediction",
  },
  {
    title: "Roomies",
    summary: "Roommate matching based on personality, habits and schedules. In development.",
    stack: ["In progress"],
    href: "https://github.com/JaydenChan2/Roomies",
  },
];

export const featuredProjects = projects.filter((p) => p.featured !== false);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
