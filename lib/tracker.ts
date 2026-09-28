/**
 * Activity tracker aggregation. Pure functions only (no database, no Next.js), so
 * they're easy to test: see tests/tracker.test.mjs.
 *
 * Model: each log entry is a "switch". An entry starts an activity, and it runs until
 * the next entry (another activity, or "stop"). Durations come from the gaps.
 */

export type LogEntry = { activity: string; created_at: string };

export type CategoryInfo = {
  id: string;
  phrase: string;
  sessionNoun?: [string, string];
};

export type SummaryOptions = {
  timeZone: string;
  weeks: number;
  maxSessionMs: number;
  categories: CategoryInfo[];
  /** Days with logged time needed last week before the comparison is enabled. */
  compareMinDays: number;
};

export type DayTotals = {
  /** Local calendar date, YYYY-MM-DD. */
  date: string;
  /** Total minutes across all categories. */
  total: number;
  /** Minutes per category id (only categories with time are included). */
  minutes: Record<string, number>;
};

export type Summary = {
  timeZone: string;
  days: DayTotals[];
  week: {
    /** Monday of the current week, YYYY-MM-DD. */
    start: string;
    total: number;
    minutes: Record<string, number>;
    sessions: Record<string, number>;
    /** Days of this week so far, including today (Mon = 1 … Sun = 7). */
    daysElapsed: number;
  };
  lastWeek: {
    start: string;
    total: number;
    minutes: Record<string, number>;
    /** Days last week with any logged time. */
    activeDays: number;
  };
  /**
   * Average minutes per day by category: this week (so far) vs last week.
   * `enabled` is false until last week has enough data to be a fair comparison.
   */
  compare: {
    enabled: boolean;
    thisWeek: Record<string, number>;
    lastWeek: Record<string, number>;
  };
  /** Total minutes per category for today, this week (from Monday) and this calendar month. */
  totals: {
    today: Record<string, number>;
    week: Record<string, number>;
    month: Record<string, number>;
    /** First day of the current month, YYYY-MM-DD. */
    monthStart: string;
  };
  sentence: string;
  hasData: boolean;
};

type Segment = { activity: string; start: number; end: number };

const MINUTE = 60_000;

/* ------------------------------------------------------------------
   Time zone helpers (no library: Intl does the zone math, including DST)
   ------------------------------------------------------------------ */

const formatters = new Map<string, Intl.DateTimeFormat>();

function zonedParts(ms: number, timeZone: string) {
  let fmt = formatters.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    formatters.set(timeZone, fmt);
  }
  const p: Record<string, number> = {};
  for (const { type, value } of fmt.formatToParts(new Date(ms))) {
    if (type !== "literal") p[type] = Number(value);
  }
  return { y: p.year, m: p.month, d: p.day, h: p.hour, min: p.minute, s: p.second };
}

/** Milliseconds the zone is ahead of UTC at a given instant (negative for Toronto). */
function zoneOffset(ms: number, timeZone: string) {
  const p = zonedParts(ms, timeZone);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - Math.floor(ms / 1000) * 1000;
}

/** The instant local midnight starts on a calendar date (month/day may overflow; Date.UTC normalises). */
function localMidnight(y: number, m: number, d: number, timeZone: string) {
  const wallClock = Date.UTC(y, m - 1, d);
  const guess = wallClock - zoneOffset(wallClock, timeZone);
  // Re-check the offset at the guessed instant in case a DST change sits in between.
  return wallClock - zoneOffset(guess, timeZone);
}

function nextLocalMidnight(ms: number, timeZone: string) {
  const p = zonedParts(ms, timeZone);
  return localMidnight(p.y, p.m, p.d + 1, timeZone);
}

/** YYYY-MM-DD for the local calendar date of an instant. */
export function localDate(ms: number, timeZone: string) {
  const p = zonedParts(ms, timeZone);
  return isoDate(p.y, p.m, p.d);
}

function isoDate(y: number, m: number, d: number) {
  // Plain calendar arithmetic in UTC, so overflowing days/months roll over correctly.
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toISOString().slice(0, 10);
}

/** Calendar dates from the Monday `weeks - 1` weeks ago through today, oldest first. */
function dateRange(nowMs: number, timeZone: string, weeks: number) {
  const t = zonedParts(nowMs, timeZone);
  const weekday = (new Date(Date.UTC(t.y, t.m - 1, t.d)).getUTCDay() + 6) % 7; // Monday = 0
  const startOffset = weekday + (weeks - 1) * 7;
  const dates: string[] = [];
  for (let i = startOffset; i >= 0; i--) dates.push(isoDate(t.y, t.m, t.d - i));
  return {
    dates,
    weekStart: isoDate(t.y, t.m, t.d - weekday),
    lastWeekStart: isoDate(t.y, t.m, t.d - weekday - 7),
    daysElapsed: weekday + 1,
    monthStart: isoDate(t.y, t.m, 1),
    rangeStart: localMidnight(t.y, t.m, t.d - startOffset, timeZone),
  };
}

/**
 * Earliest entry the summary needs: the start of the summary's date range, minus one max
 * session (anything older than that can't reach into the range because of the cap).
 */
export function windowStart(nowMs: number, opts: Pick<SummaryOptions, "timeZone" | "weeks" | "maxSessionMs">) {
  return dateRange(nowMs, opts.timeZone, opts.weeks).rangeStart - opts.maxSessionMs;
}

/* ------------------------------------------------------------------
   Aggregation
   ------------------------------------------------------------------ */

/** Turn switch-style entries into timed segments, applying the session cap. */
export function toSegments(entries: LogEntry[], nowMs: number, opts: Pick<SummaryOptions, "maxSessionMs" | "categories">) {
  const known = new Set(opts.categories.map((c) => c.id));
  const sorted = entries
    .map((e) => ({ activity: e.activity, t: Date.parse(e.created_at) }))
    .filter((e) => Number.isFinite(e.t) && e.t <= nowMs)
    .sort((a, b) => a.t - b.t);

  const segments: Segment[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const { activity, t: start } = sorted[i];
    if (!known.has(activity)) continue; // "stop" or a category that's since been removed

    const next = sorted[i + 1];
    let end: number;
    if (next) {
      end = Math.min(next.t, start + opts.maxSessionMs);
    } else if (nowMs - start >= opts.maxSessionMs) {
      // Left running with no stop: count it, capped.
      end = start + opts.maxSessionMs;
    } else {
      // Still running and under the cap. Skip it, so the public summary never
      // reveals what's happening right now.
      continue;
    }
    if (end > start) segments.push({ activity, start, end });
  }
  return segments;
}

/** Split a segment into pieces that each fall within one local calendar day. */
function splitByDay(seg: Segment, timeZone: string) {
  const pieces: { date: string; ms: number }[] = [];
  let cursor = seg.start;
  while (cursor < seg.end) {
    const boundary = Math.min(nextLocalMidnight(cursor, timeZone), seg.end);
    pieces.push({ date: localDate(cursor, timeZone), ms: boundary - cursor });
    cursor = boundary;
  }
  return pieces;
}

export function summarize(entries: LogEntry[], nowMs: number, opts: SummaryOptions): Summary {
  const { dates, weekStart, lastWeekStart, daysElapsed, monthStart } = dateRange(nowMs, opts.timeZone, opts.weeks);
  const inRange = new Set(dates);
  const perDay = new Map<string, Map<string, number>>(dates.map((d) => [d, new Map()]));
  const weekSessions: Record<string, number> = {};

  for (const seg of toSegments(entries, nowMs, opts)) {
    for (const piece of splitByDay(seg, opts.timeZone)) {
      if (!inRange.has(piece.date)) continue;
      const day = perDay.get(piece.date)!;
      day.set(seg.activity, (day.get(seg.activity) ?? 0) + piece.ms);
    }
    // A session belongs to the week it started in. Ignore sub-minute mis-taps.
    if (seg.end - seg.start >= MINUTE && localDate(seg.start, opts.timeZone) >= weekStart) {
      weekSessions[seg.activity] = (weekSessions[seg.activity] ?? 0) + 1;
    }
  }

  const days: DayTotals[] = dates.map((date) => {
    const minutes: Record<string, number> = {};
    let total = 0;
    for (const [activity, ms] of perDay.get(date)!) {
      const m = Math.round(ms / MINUTE);
      if (m > 0) {
        minutes[activity] = m;
        total += m;
      }
    }
    return { date, total, minutes };
  });

  const thisWeek = totalsBetween(days, weekStart, "9999-12-31");
  const lastWeek = totalsBetween(days, lastWeekStart, weekStart);

  const averagePerDay = (minutes: Record<string, number>, n: number) =>
    Object.fromEntries(opts.categories.map((c) => [c.id, Math.round(((minutes[c.id] ?? 0) / n) * 10) / 10]));

  return {
    timeZone: opts.timeZone,
    days,
    week: { start: weekStart, total: thisWeek.total, minutes: thisWeek.minutes, sessions: weekSessions, daysElapsed },
    lastWeek: { start: lastWeekStart, ...lastWeek },
    totals: {
      today: totalsBetween(days, dates[dates.length - 1], "9999-12-31").minutes,
      week: thisWeek.minutes,
      // The date range always reaches back 12+ weeks, so it covers the whole month.
      month: totalsBetween(days, monthStart, "9999-12-31").minutes,
      monthStart,
    },
    compare: {
      enabled: lastWeek.activeDays >= opts.compareMinDays,
      thisWeek: averagePerDay(thisWeek.minutes, daysElapsed),
      lastWeek: averagePerDay(lastWeek.minutes, 7),
    },
    sentence: weekSentence(thisWeek.minutes, weekSessions, opts.categories),
    hasData: days.some((d) => d.total > 0),
  };
}

/** Sum the days with from <= date < to. */
function totalsBetween(days: DayTotals[], from: string, to: string) {
  const minutes: Record<string, number> = {};
  let total = 0;
  let activeDays = 0;
  for (const day of days) {
    if (day.date < from || day.date >= to) continue;
    if (day.total > 0) activeDays++;
    for (const [activity, m] of Object.entries(day.minutes)) {
      minutes[activity] = (minutes[activity] ?? 0) + m;
      total += m;
    }
  }
  return { minutes, total, activeDays };
}

/**
 * One human line about the week, e.g.
 * "This week: mostly studying, 2 gym sessions." (session counts only for categories with a sessionNoun)
 */
export function weekSentence(minutes: Record<string, number>, sessions: Record<string, number>, categories: CategoryInfo[]) {
  const total = Object.values(minutes).reduce((a, b) => a + b, 0);
  if (total === 0) return "Nothing logged yet this week.";

  const ranked = categories.filter((c) => (minutes[c.id] ?? 0) > 0).sort((a, b) => minutes[b.id] - minutes[a.id]);
  const [top, second] = ranked;
  const parts: string[] = [];

  if (minutes[top.id] / total >= 0.4 || !second) parts.push(`mostly ${top.phrase}`);
  else parts.push(`a mix of ${top.phrase} and ${second.phrase}`);

  for (const c of categories) {
    const n = sessions[c.id] ?? 0;
    if (c.sessionNoun && n > 0) parts.push(`${n} ${n === 1 ? c.sessionNoun[0] : c.sessionNoun[1]}`);
  }

  return `This week: ${parts.join(", ")}.`;
}
