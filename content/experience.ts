import type { Role } from "./types";

/** Most recent first. Keep points short and lead with the result. */
export const experience: Role[] = [
  {
    id: "whn",
    role: "Software Engineer Intern",
    org: "World Health Network",
    href: "https://whn.global/",
    start: "May 2026",
    end: "Present",
    location: "Remote",
    current: true,
    points: [
      "Built a Python ETL pipeline ingesting vaccination, outbreak and variant data from 4 public-health APIs (WHO, CDC, OWID), feeding a Fortran simulation of 15+ pathogen variants.",
      "Engineered weather and infrastructure features in Pandas that improved a transmission forecasting model by 4% RMSE.",
      "Designed tiered imputation for missing vaccination data, tagging every imputed row with provenance so downstream models can audit or exclude it.",
    ],
  },
  {
    id: "geniboo",
    role: "Full-Stack Developer",
    org: "GENIBOO (HRSPRO)",
    href: "https://www.geniboo.ca/",
    start: "Jul 2026",
    end: "Sep 2026",
    location: "Remote",
    points: [
      "Built the bilingual Next.js site with hand-rolled i18n and theming, covering 9 program categories.",
      "Built Stripe flows for program fees, financial-assistance applications and donations.",
      "Scoped features directly with the Executive Director through regular check-ins.",
    ],
    project: "geniboo",
  },
  {
    id: "warg",
    role: "Autonomy Engineer",
    org: "Waterloo Aerial Robotics Group",
    href: "https://www.uwarg.com/",
    start: "Mar 2026",
    end: "Present",
    location: "Waterloo, ON",
    current: true,
    points: [
      "Split drone command execution across 3 parallel processes, cutting latency 40% over the sequential version.",
      "Processed 50 Hz MAVLink telemetry in a closed loop, delivering altitude and yaw corrections within 200 ms.",
      "Built 30 fps OpenCV target detection that held up across 5+ lighting conditions in field tests.",
    ],
  },
  {
    id: "futuriq",
    role: "Software Developer Intern",
    org: "FuturIQ",
    href: "https://www.linkedin.com/company/futuriq-inc/",
    start: "Jul 2024",
    end: "Oct 2024",
    location: "Brampton, ON",
    points: [
      "Built an interactive 3D digital human with Unity and MetaHuman, integrated into a web app via API (~25% longer sessions in internal testing).",
      "Built a Python chatbot backend for content recommendations, saving an estimated 3 hours a week of manual review.",
    ],
  },
  {
    id: "club",
    role: "Founder & Instructor",
    org: "AI and Game Development Club",
    start: "Sep 2024",
    end: "Jun 2025",
    location: "Brampton, ON",
    points: [
      "Started the club from scratch and grew it to 40+ active members.",
      "Taught CNNs and RNNs in TensorFlow across 8+ hands-on workshops.",
      "Led teams to 4th and 5th at the 2025 Dufferin-Peel board-wide competition, the school's best-ever result.",
    ],
  },
];
