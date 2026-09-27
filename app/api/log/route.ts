/**
 * POST /api/log — called by the iOS Shortcut.
 *   Header: x-secret: <TRACKER_SECRET>
 *   Body:   { "activity": "studying" }   or   { "activity": "stop" }
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { activityIds, isLoggable, STOP, tracker } from "@/content/activities";
import { countRecentEntries, insertEntry, isConfigured } from "@/lib/activity-data";

const MAX_BODY_BYTES = 512;
const MIN_SECRET_LENGTH = 16;

function reply(body: object, status: number, extraHeaders: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extraHeaders } });
}

/**
 * Best-effort per-IP limit: 10 requests a minute. It lives in memory, so each server
 * instance keeps its own count; it exists to slow down secret guessing. The real cap
 * on writes is the database check further down, which holds across all instances.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
}

/** Read at most `max` bytes of the body; returns null if it's bigger. Doesn't trust Content-Length. */
async function readBody(request: Request, max: number) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

/** Constant-time comparison. Hashing first makes both sides the same length. */
function secretMatches(given: string | null) {
  const expected = process.env.TRACKER_SECRET;
  if (!expected || expected.length < MIN_SECRET_LENGTH || !given) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(ip)) return reply({ error: "Too many requests" }, 429, { "Retry-After": "60" });

  if (!isConfigured() || !process.env.TRACKER_SECRET) return reply({ error: "Tracker is not configured" }, 503);
  if (!secretMatches(request.headers.get("x-secret"))) return reply({ error: "Unauthorized" }, 401);

  // Parse a small JSON body, never reading more than MAX_BODY_BYTES into memory.
  const text = await readBody(request, MAX_BODY_BYTES);
  if (text === null) return reply({ error: "Body too large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return reply({ error: 'Expected JSON like {"activity": "studying"}' }, 400);
  }

  const raw = (body as { activity?: unknown } | null)?.activity;
  const activity = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!isLoggable(activity)) {
    return reply({ error: "Unknown activity", allowed: [...activityIds, STOP] }, 400);
  }

  try {
    if ((await countRecentEntries(tracker.maxLogsPerHour)) >= tracker.maxLogsPerHour) {
      return reply({ error: "Hourly log limit reached" }, 429, { "Retry-After": "600" });
    }
    await insertEntry(activity);
  } catch (err) {
    console.error("[api/log]", err);
    return reply({ error: "Could not save entry" }, 502);
  }

  return reply({ ok: true, activity }, 201);
}
