import type { Metadata } from "next";
import { ActivityContent } from "@/components/activity";
import { container, PageFooter, PageTitle } from "@/components/container";
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
    <>
      <div className={`${container} pt-10 md:pt-16`}>
        <PageTitle title="What I’ve been up to">
          <p>I log what I&rsquo;m doing from my phone with one tap. This is the last few weeks, updated every 15 minutes.</p>
        </PageTitle>
        <div className="mt-12 md:mt-16">
          <ActivityContent summary={summary} />
        </div>
      </div>
      <PageFooter />
    </>
  );
}
