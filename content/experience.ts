import type { Role } from "./types";

/** Most recent first. Keep each summary to one or two lines; lead with the result. */
export const experience: Role[] = [
  {
    role: "Software Engineer Intern",
    id: "exp-whn",
    org: "World Health Network",
    href: "https://whn.global/",
    start: "May 2026",
    end: "Present",
    location: "Remote",
    summary:
      "Python ETL pipeline over 4 public-health APIs (WHO, CDC, OWID) feeding a Fortran simulation of 15+ pathogen variants. New weather and infrastructure features improved the forecasting model by 4% RMSE.",
  },
  {
    role: "Full-Stack Developer",
    id: "exp-geniboo",
    org: "GENIBOO (HRSPRO)",
    start: "Jul 2026",
    end: "Sep 2026",
    location: "Remote",
    summary:
      "Bilingual Next.js site with Stripe registration, financial-assistance and donation flows, scoped directly with the Executive Director.",
    seeAlso: "geniboo",
  },
  {
    role: "Autonomy Engineer",
    id: "exp-warg",
    org: "Waterloo Aerial Robotics Group",
    href: "https://www.uwarg.com/",
    start: "Mar 2026",
    end: "Present",
    location: "Waterloo, ON",
    summary:
      "Split drone command execution across 3 parallel processes, cutting latency 40%. 50 Hz MAVLink telemetry drives closed-loop altitude and yaw corrections within 200 ms, alongside 30 fps OpenCV target tracking.",
  },
  {
    role: "Software Developer Intern",
    id: "exp-futuriq",
    org: "FuturIQ",
    href: "https://www.linkedin.com/company/futuriq-inc/",
    start: "Jul 2024",
    end: "Oct 2024",
    location: "Brampton, ON",
    summary:
      "Built a Unity/MetaHuman digital human integrated into a web app via API (~25% longer sessions in internal testing), plus a Python chatbot backend that saved an estimated 3 hours a week of manual content review.",
  },
  {
    role: "Founder & Instructor, AI and Game Development Club",
    id: "exp-club",
    org: "Dufferin-Peel Catholic DSB",
    start: "Sep 2024",
    end: "Jun 2025",
    location: "Brampton, ON",
    summary:
      "Started the club from scratch and grew it to 40+ members. Taught CNNs and RNNs in TensorFlow across 8+ workshops, and led teams to 4th and 5th at the 2025 board-wide competition, the school's best result.",
  },
];
