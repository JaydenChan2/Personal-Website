/**
 * Server-only data access for the activity tracker. Talks to Supabase's REST API
 * with plain fetch (no client library). Only ever import this from server code:
 * route handlers and server components. The keys below have no NEXT_PUBLIC_ prefix,
 * so Next.js never ships them to the browser.
 */
import { activities, tracker } from "@/content/activities";
import { summarize, windowStart, type LogEntry, type Summary } from "@/lib/tracker";

const TABLE = "activity_log";

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

export const isConfigured = () => config() !== null;

function headers(key: string) {
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

/** Save one entry. The timestamp comes from the database (default now()), never the client. */
export async function insertEntry(activity: string) {
  const c = config();
  if (!c) throw new Error("Supabase is not configured");
  const res = await fetch(`${c.url}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: { ...headers(c.key), Prefer: "return=minimal" },
    body: JSON.stringify({ activity }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase insert failed: ${res.status}`);
}

/** How many entries were logged in the last hour (stops counting at `limit`). */
export async function countRecentEntries(limit: number) {
  const c = config();
  if (!c) throw new Error("Supabase is not configured");
  const since = new Date(Date.now() - 3600_000).toISOString();
  const res = await fetch(
    `${c.url}/rest/v1/${TABLE}?select=id&created_at=gte.${encodeURIComponent(since)}&limit=${limit}`,
    { headers: headers(c.key), cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Supabase count failed: ${res.status}`);
  return ((await res.json()) as unknown[]).length;
}

const summaryOptions = {
  timeZone: tracker.timeZone,
  weeks: tracker.weeks,
  maxSessionMs: tracker.maxSessionHours * 3600_000,
  categories: activities,
  compareMinDays: tracker.compareMinDays,
};

/** Aggregated summary. Returns an empty summary when Supabase isn't configured (e.g. local builds). */
export async function getSummary(): Promise<Summary> {
  const now = Date.now();
  const c = config();
  if (!c) return summarize([], now, summaryOptions);

  const since = new Date(windowStart(now, summaryOptions)).toISOString();
  const res = await fetch(
    `${c.url}/rest/v1/${TABLE}?select=activity,created_at&created_at=gte.${encodeURIComponent(since)}&order=created_at.asc&limit=10000`,
    { headers: headers(c.key), next: { revalidate: tracker.revalidateSeconds } },
  );
  if (!res.ok) throw new Error(`Supabase read failed: ${res.status}`);
  return summarize((await res.json()) as LogEntry[], now, summaryOptions);
}
