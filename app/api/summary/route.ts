/**
 * GET /api/summary — public, cached. Aggregates only: per-day and this-week totals
 * in minutes by category. Never raw timestamps, never the activity in progress.
 * Used by the Scriptable widget; the website renders the same data server-side.
 */
import { activities } from "@/content/activities";
import { getSummary } from "@/lib/activity-data";

// Must be a literal for Next.js to read it. Keep in sync with tracker.revalidateSeconds.
export const revalidate = 900;

export async function GET() {
  try {
    const summary = await getSummary();
    return Response.json({
      ...summary,
      categories: activities.map(({ id, label, color }) => ({ id, label, color })),
    });
  } catch (err) {
    console.error("[api/summary]", err);
    return Response.json({ error: "Summary unavailable" }, { status: 503 });
  }
}
