/**
 * Activity tracker config. This is the only file to edit when adding a category:
 * add an entry below and the API, the website section and the widget pick it up.
 * (If you added the optional CHECK constraint in supabase/schema.sql, update it too.)
 */

export type ActivityCategory = {
  /** What the iOS Shortcut sends, e.g. { "activity": "studying" }. Lowercase, no spaces. */
  id: string;
  label: string;
  /** One colour per category, with a lighter variant for dark mode. */
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
    color: { light: "#2340ff", dark: "#8394ff" },
    phrase: "studying",
  },
  {
    id: "building",
    label: "Building",
    color: { light: "#0e8a5f", dark: "#3fcf98" },
    phrase: "building things",
  },
  {
    id: "badminton",
    label: "Badminton",
    color: { light: "#c2410c", dark: "#fb923c" },
    phrase: "badminton",
    sessionNoun: ["badminton session", "badminton sessions"],
  },
  {
    id: "social",
    label: "Social",
    color: { light: "#be185d", dark: "#f472b6" },
    phrase: "time with friends",
  },
];

export const tracker = {
  timeZone: "America/Toronto",
  /** Weeks shown in the heatmap (13 weeks ≈ 90 days). */
  weeks: 13,
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
