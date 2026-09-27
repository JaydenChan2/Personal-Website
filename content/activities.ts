/**
 * Activity tracker config. This is the only file to edit when adding a category:
 * add an entry below and the API, the website section and the widget pick it up.
 * (If you added the optional CHECK constraint in supabase/schema.sql, update it too.)
 */

export type ActivityCategory = {
  /** What the iOS Shortcut sends, e.g. { "activity": "studying" }. Lowercase, no spaces. */
  id: string;
  label: string;
  /**
   * One colour per category, with a dark-mode variant. The current set passes a
   * colour-blind check in both modes; if you add or change one, re-check the set
   * (e.g. with a CVD simulator) so no two categories look alike.
   */
  color: { light: string; dark: string };
  /** Used in the summary line: "This week: mostly <phrase>". */
  phrase: string;
  /** If set, the summary line counts sessions: "2 badminton sessions". [singular, plural] */
  sessionNoun?: [string, string];
};

export const activities: ActivityCategory[] = [
  {
    id: "studying",
    label: "Studying",
    color: { light: "#2340ff", dark: "#6f7dff" },
    phrase: "studying",
  },
  {
    id: "building",
    label: "Building",
    color: { light: "#0e8a5f", dark: "#1f9e6c" },
    phrase: "building things",
  },
  {
    id: "badminton",
    label: "Badminton",
    color: { light: "#c2410c", dark: "#df6a28" },
    phrase: "badminton",
    sessionNoun: ["badminton session", "badminton sessions"],
  },
  {
    id: "social",
    label: "Social",
    color: { light: "#a21caf", dark: "#c653c2" },
    phrase: "time with friends",
  },
];

export const tracker = {
  timeZone: "America/Toronto",
  /** Weeks of daily data kept in the summary / API (13 weeks ≈ 90 days). */
  weeks: 13,
  /** Weeks shown in each category's line chart. */
  chartWeeks: 4,
  /** Days with any logged time needed last week before the weekly comparison is shown. */
  compareMinDays: 3,
  /** An activity with no following entry for this long is assumed forgotten and capped here. */
  maxSessionHours: 4,
  /** Hard cap on logged entries per rolling hour (enforced in the database query). */
  maxLogsPerHour: 30,
  /** How long the public summary is cached, in seconds. */
  revalidateSeconds: 900,
};

/** The special value that ends the current activity without starting a new one. */
export const STOP = "stop";

export const activityIds = activities.map((a) => a.id);
export const isLoggable = (value: string) => value === STOP || activityIds.includes(value);
