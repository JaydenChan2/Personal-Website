import { todo, type MinorProject, type Project } from "./types";

/**
 * Selected work, in display order. The first "lead" project gets the large treatment.
 * Every number here comes from Jayden's resume or the previous site. Don't add one you
 * can't back up.
 */
export const projects: Project[] = [
  {
    slug: "facet",
    // Formerly "Chud.ai" / "FacePhi". The GitHub repo is still named chud-ai.
    title: "Facet",
    summary: "Real-time facial geometry analysis from a live webcam feed.",
    prominence: "lead",
    year: todo("Year built"),
    problem:
      "Facial proportions are usually judged by eye, which makes them subjective and hard to reproduce. I wanted objective measurements computed live, every frame, from an ordinary webcam.",
    built:
      "A Python and Flask service that tracks 468 facial landmarks per frame with MediaPipe Face Mesh and OpenCV. A NumPy geometry engine turns those points into five proportion metrics (symmetry deviation, canthal tilt, facial thirds, jaw angle and golden-ratio alignment) and streams them to a browser dashboard.",
    decision: {
      title: "Score a ten-second window, not a single frame.",
      body: "Per-frame measurements shift with head pose and lighting, so the app averages every metric across a ten-second scan and only then locks a final score. It gives up instant feedback in exchange for a result that repeats from one run to the next.",
    },
    results: [
      { value: "468", label: "landmarks tracked per frame" },
      { value: "< 50 ms", label: "per frame at 24 fps" },
      { value: "5", label: "proportion metrics" },
    ],
    stack: ["Python", "Flask", "MediaPipe", "OpenCV", "NumPy", "JavaScript"],
    links: [{ label: "Source", href: "https://github.com/JaydenChan2/chud-ai" }],
    media: {
      kind: "youtube",
      id: "Jv91GEhY3nk",
      // The video's own thumbnail is low-res and still says "CHUD.AI", so use a typeset card.
      poster: "designed",
      title: "Facet demo video",
      caption: "Demo: live landmark tracking and the ten-second scan.",
    },
  },
  {
    slug: "geniboo",
    title: "GENIBOO",
    summary: "Bilingual registration and payments for a youth nonprofit.",
    prominence: "standard",
    year: "2026",
    role: "Full-stack developer (part-time), with HRSPRO",
    problem:
      "A youth nonprofit running nine program categories needed one site where English- and French-speaking families could register, apply for financial assistance and donate.",
    built:
      "A Next.js App Router site with Stripe-backed flows for program fees, financial-assistance applications and donations. I scoped each feature directly with the Executive Director through regular check-ins against a fixed project brief.",
    decision: {
      title: "Hand-rolled i18n, no libraries.",
      body: todo(
        "One or two sentences on how the EN/FR system works (routing, how dictionaries are typed and loaded) and why you skipped a library. The light/dark theme system is also library-free if you want to mention it.",
      ),
    },
    results: [
      { value: "9", label: "program categories" },
      { value: "EN / FR", label: "with zero i18n dependencies" },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "Stripe"],
    links: [{ label: "Live site", href: todo("GENIBOO live URL") }],
    media: {
      kind: "placeholder",
      note: "Screenshot of the registration or payment flow (EN and FR side by side works well). 1600×1000, save to /public/work/geniboo.png.",
      caption: "Registration flow, English and French.",
    },
  },
  {
    slug: "lynx",
    title: "Lynx",
    summary:
      "A RAG co-pilot that turns dense technical IP into an investor thesis, then pitches it to a simulated VC.",
    prominence: "standard",
    year: "2026",
    problem:
      "Technical founders sit on pages of IP documentation that investors won't read. Turning it into a thesis and working out which investors are a fit takes hours.",
    built:
      "A FastAPI RAG pipeline parses the documents into a structured knowledge graph. A REST layer feeds that into an investor-matching engine, and a real-time adversarial pitch simulator uses Gemini for investor personas and ElevenLabs for their voices. React on the front end.",
    decision: {
      title: "Async end to end, so the simulated VC can keep up.",
      body: "Each turn of the pitch simulator calls both Gemini and ElevenLabs. Handling those requests asynchronously keeps responses under 800 ms, fast enough for the exchange to feel like a conversation instead of a queue.",
    },
    results: [
      { value: "< 2 min", label: "to analyze 50+ pages, down from hours" },
      { value: "85%", label: "mandate alignment across 40+ investors" },
      { value: "< 800 ms", label: "response time" },
    ],
    stack: ["Python", "FastAPI", "RAG", "Gemini", "ElevenLabs", "React"],
    links: [{ label: "Source", href: "https://github.com/JaydenChan2/Lynx" }],
    media: {
      kind: "youtube",
      id: "FsvDk2D9g6U",
      thumb: "maxresdefault",
      title: "Lynx demo video",
      caption: "Demo: from document upload to the pitch simulator.",
    },
  },
];

export const minorProjects: MinorProject[] = [
  {
    title: "Job Application Tracker",
    summary:
      "Express and TypeScript REST API (11 endpoints, JWT and bcrypt) over PostgreSQL via Prisma, with automatic status-history logging. Deployed across Vercel, Render and Neon.",
    stack: ["Next.js", "Express", "PostgreSQL", "Prisma", "Docker"],
    href: todo("Repo or live URL"),
  },
  {
    title: "Music to Sheet Converter",
    summary: "Turns MP3 and WAV audio into guitar tabs and sheet music using Librosa signal analysis.",
    stack: ["React", "Flask", "Librosa", "NumPy"],
    href: "https://github.com/JaydenChan2/Music-to-Sheet-Converter",
  },
  {
    title: "Stock Analyzer",
    summary: "RSI and Bollinger Band signals from live yfinance data, plus budget allocation across the strongest picks.",
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
