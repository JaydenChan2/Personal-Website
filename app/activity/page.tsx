import type { Metadata } from "next";
import { ActivityContent } from "@/components/activity";
import { SecHead } from "@/components/container";
import { getSummary } from "@/lib/activity-data";
import type { Summary } from "@/lib/tracker";

// Re-render at most every 15 minutes (keep in sync with tracker.revalidateSeconds).
export const revalidate = 900;

export const metadata: Metadata = {
  title: "Activity",
  description: "What Jayden Chan has been spending time on lately: studying, building, hobbies and more.",
};

export default async function ActivityPage() {
  let summary: Summary | null = null;
  try {
    summary = await getSummary();
  } catch (err) {
    console.error("[activity] summary", err);
  }

  return (
    <div className="wrap page-top pb-[clamp(72px,11vh,130px)]">
      <SecHead
        as="h1"
        label="Activity"
        side="I log what I’m doing from my phone with one tap. This is the last few weeks, updated every 15 minutes."
      >
        What I&rsquo;ve been <b>up to.</b>
      </SecHead>
      <ActivityContent summary={summary} />
    </div>
  );
}
