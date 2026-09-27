// Run with: npm test  (Node's built-in test runner; Node strips the TypeScript types)
import assert from "node:assert/strict";
import { test } from "node:test";
import { summarize, toSegments, weekSentence, windowStart } from "../lib/tracker.ts";

const categories = [
  { id: "studying", phrase: "studying" },
  { id: "building", phrase: "building things" },
  { id: "badminton", phrase: "badminton", sessionNoun: ["badminton session", "badminton sessions"] },
  { id: "social", phrase: "time with friends" },
];
const opts = { timeZone: "America/Toronto", weeks: 13, maxSessionMs: 4 * 3600_000, categories };
const at = (iso) => ({ created_at: iso }); // helper for readability
const log = (activity, iso) => ({ activity, ...at(iso) });
const day = (s, date) => s.days.find((d) => d.date === date);

// Wednesday 2026-09-23, 15:00 Toronto (EDT, UTC-4) = 19:00Z
const NOW = Date.parse("2026-09-23T19:00:00Z");

test("switching activities ends the previous one", () => {
  const s = summarize(
    [log("studying", "2026-09-22T13:00:00Z"), log("building", "2026-09-22T14:30:00Z"), log("stop", "2026-09-22T15:00:00Z")],
    NOW,
    opts,
  );
  assert.deepEqual(day(s, "2026-09-22").minutes, { studying: 90, building: 30 });
});

test("an activity with no stop is capped at 4 hours", () => {
  const s = summarize([log("studying", "2026-09-22T12:00:00Z")], NOW, opts); // left running for >24h
  assert.equal(day(s, "2026-09-22").minutes.studying, 240);
});

test("the gap before the next entry is also capped", () => {
  const s = summarize([log("studying", "2026-09-22T12:00:00Z"), log("social", "2026-09-22T22:00:00Z"), log("stop", "2026-09-22T23:00:00Z")], NOW, opts);
  assert.deepEqual(day(s, "2026-09-22").minutes, { studying: 240, social: 60 });
});

test("the currently running activity is never included", () => {
  const s = summarize([log("badminton", "2026-09-23T18:00:00Z")], NOW, opts); // started 1h ago
  assert.equal(s.hasData, false);
  assert.equal(s.week.total, 0);
  assert.deepEqual(s.week.sessions, {});
});

test("sessions spanning local midnight are split across both days", () => {
  // 23:00 to 01:30 Toronto time on the night of Sep 21 → 22
  const s = summarize([log("building", "2026-09-22T03:00:00Z"), log("stop", "2026-09-22T05:30:00Z")], NOW, opts);
  assert.equal(day(s, "2026-09-21").minutes.building, 60);
  assert.equal(day(s, "2026-09-22").minutes.building, 90);
});

test("days follow Toronto time, not UTC", () => {
  // 21:00–22:00 Toronto on Sep 21 is 01:00–02:00Z on Sep 22
  const s = summarize([log("social", "2026-09-22T01:00:00Z"), log("stop", "2026-09-22T02:00:00Z")], NOW, opts);
  assert.equal(day(s, "2026-09-21").minutes.social, 60);
  assert.equal(day(s, "2026-09-22").total, 0);
});

test("midnight split is correct across a DST change", () => {
  // DST ends 2026-11-01 02:00 → 01:00. 23:00 Oct 31 (EDT) to 03:00 Nov 1 (EST) = 5 real hours, capped to 4
  const now = Date.parse("2026-11-04T17:00:00Z");
  const s = summarize([log("studying", "2026-11-01T03:00:00Z"), log("stop", "2026-11-01T08:00:00Z")], now, opts);
  assert.equal(day(s, "2026-10-31").minutes.studying, 60); // 23:00 → midnight
  assert.equal(day(s, "2026-11-01").minutes.studying, 180); // midnight → cap
});

test("range covers 13 weeks ending today, starting on a Monday", () => {
  const s = summarize([], NOW, opts);
  assert.equal(s.days.at(-1).date, "2026-09-23");
  assert.equal(new Date(s.days[0].date).getUTCDay(), 1); // Monday
  assert.equal(s.days.length, 12 * 7 + 3); // 12 full weeks + Mon..Wed
  assert.equal(s.week.start, "2026-09-21");
});

test("week totals and session counts only include the current week", () => {
  const s = summarize(
    [
      log("badminton", "2026-09-19T22:00:00Z"), log("stop", "2026-09-19T23:00:00Z"), // last Saturday
      log("badminton", "2026-09-21T22:00:00Z"), log("stop", "2026-09-21T23:30:00Z"), // Monday
      log("badminton", "2026-09-22T22:00:00Z"), log("stop", "2026-09-22T23:00:00Z"), // Tuesday
      log("studying", "2026-09-22T13:00:00Z"), log("stop", "2026-09-22T17:00:00Z"),
    ],
    NOW,
    opts,
  );
  assert.deepEqual(s.week.minutes, { badminton: 150, studying: 240 });
  assert.deepEqual(s.week.sessions, { badminton: 2, studying: 1 });
  assert.equal(s.sentence, "This week: mostly studying, 2 badminton sessions.");
});

test("unknown activities and garbage timestamps are ignored", () => {
  const segs = toSegments([log("napping", "2026-09-22T10:00:00Z"), log("studying", "not a date"), log("stop", "2026-09-22T11:00:00Z")], NOW, opts);
  assert.equal(segs.length, 0);
});

test("sentence wording", () => {
  assert.equal(weekSentence({}, {}, categories), "Nothing logged yet this week.");
  assert.equal(weekSentence({ studying: 100, building: 90, social: 80 }, {}, categories), "This week: a mix of studying and building things.");
  assert.equal(weekSentence({ badminton: 60 }, { badminton: 1 }, categories), "This week: mostly badminton, 1 badminton session.");
});

test("window start reaches back one max session before the range", () => {
  const start = windowStart(NOW, opts);
  const firstDay = summarize([], NOW, opts).days[0].date; // 2026-06-29
  assert.equal(start, Date.parse(`${firstDay}T04:00:00Z`) - 4 * 3600_000); // local midnight (EDT) minus 4h
});
