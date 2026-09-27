/**
 * "What I've been up to": activity heatmap + this week's breakdown.
 * Server components only (plain SVG and divs, no client JS).
 */
import { activities, type ActivityCategory } from "@/content/activities";
import type { DayTotals, Summary } from "@/lib/tracker";

/** A category's colour that follows the site's light/dark theme. */
const colorOf = (c: ActivityCategory) => `light-dark(${c.color.light}, ${c.color.dark})`;

function formatMinutes(m: number) {
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min}m`;
  return min === 0 ? `${h}h` : `${h}h ${min}m`;
}

// Dates are calendar days (YYYY-MM-DD), so format them in UTC to avoid shifting a day.
const dayLabel = new Intl.DateTimeFormat("en-CA", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const monthLabel = new Intl.DateTimeFormat("en-CA", { month: "short", timeZone: "UTC" });
const parseDay = (date: string) => new Date(`${date}T00:00:00Z`);

export function ActivitySection({ summary }: { summary: Summary | null }) {
  return (
    <section aria-labelledby="activity" className="mt-20 md:mt-28">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="activity" className="text-2xl tracking-tight">
          What I&rsquo;ve been up to
        </h2>
        <p className="label">Logged from my phone, updated every 15 minutes</p>
      </div>

      {!summary ? (
        <p className="mt-6 border-t border-line pt-6 text-muted">This is taking a break right now. Check back later.</p>
      ) : (
        <div className="mt-6 grid gap-x-12 gap-y-10 border-t border-line pt-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <Heatmap days={summary.days} />
            {!summary.hasData && (
              <p className="mt-4 text-muted">I&rsquo;ve only just started tracking this. Check back in a week or two.</p>
            )}
          </div>
          <div className="md:col-span-5">
            <WeekBreakdown summary={summary} />
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------
   Heatmap: one column per week (Mon at the top), shaded by total time.
   ------------------------------------------------------------------ */

const CELL = 12;
const GAP = 3;
const STEP = CELL + GAP;
const LEFT = 26; // room for weekday labels
const TOP = 16; // room for month labels
/** Minutes at which each shade starts (level 1–4). Fixed, so shades mean the same thing every week. */
const LEVELS = [1, 60, 150, 300];
const SHADE = [0, 28, 52, 76, 100]; // % of the accent mixed into the empty-cell colour

const levelOf = (minutes: number) => LEVELS.filter((t) => minutes >= t).length;

function Heatmap({ days }: { days: DayTotals[] }) {
  const weeks = Math.ceil(days.length / 7);
  const width = LEFT + weeks * STEP - GAP;
  const height = TOP + 7 * STEP - GAP;
  const activeDays = days.filter((d) => d.total > 0);
  const totalMinutes = activeDays.reduce((sum, d) => sum + d.total, 0);

  // Month label above the first column of each new month.
  const months: { x: number; label: string }[] = [];
  for (let w = 0; w < weeks; w++) {
    const monday = parseDay(days[w * 7].date);
    const prev = w > 0 ? parseDay(days[(w - 1) * 7].date) : null;
    if (!prev || prev.getUTCMonth() !== monday.getUTCMonth()) {
      const x = LEFT + w * STEP;
      if (months.length && x - months[months.length - 1].x < 3 * STEP) months.pop(); // avoid overlap
      months.push({ x, label: monthLabel.format(monday) });
    }
  }

  return (
    <figure>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width * 1.75}
        className="h-auto max-w-full"
        role="img"
        aria-label={`Activity heatmap for the last ${weeks} weeks: ${formatMinutes(totalMinutes)} logged across ${activeDays.length} days.`}
      >
        <g fontSize="8" fill="var(--muted)">
          {months.map((m) => (
            <text key={m.x} x={m.x} y={9}>
              {m.label}
            </text>
          ))}
          {["Mon", "Wed", "Fri"].map((d, i) => (
            <text key={d} x={0} y={TOP + i * 2 * STEP + CELL - 3}>
              {d}
            </text>
          ))}
        </g>
        {days.map((day, i) => {
          const level = levelOf(day.total);
          return (
            <rect
              key={day.date}
              x={LEFT + Math.floor(i / 7) * STEP}
              y={TOP + (i % 7) * STEP}
              width={CELL}
              height={CELL}
              rx={2.5}
              style={{ fill: `color-mix(in srgb, var(--accent) ${SHADE[level]}%, var(--sunken))` }}
            >
              <title>{`${dayLabel.format(parseDay(day.date))}: ${day.total ? formatMinutes(day.total) : "nothing logged"}`}</title>
            </rect>
          );
        })}
      </svg>
      <figcaption className="label mt-3 flex items-center gap-1.5" aria-hidden="true">
        Less
        {SHADE.map((s) => (
          <span
            key={s}
            className="inline-block size-2.5 rounded-[2px]"
            style={{ background: `color-mix(in srgb, var(--accent) ${s}%, var(--sunken))` }}
          />
        ))}
        More
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------
   This week: proportions by category, plus the generated sentence.
   ------------------------------------------------------------------ */

function WeekBreakdown({ summary }: { summary: Summary }) {
  const { minutes, total } = summary.week;
  const rows = activities
    .map((c) => ({ c, share: total ? (minutes[c.id] ?? 0) / total : 0 }))
    .filter((r) => r.share > 0);

  return (
    <div>
      <h3 className="label">This week</h3>
      <p className="mt-1 text-lg leading-snug">{summary.sentence.replace(/^This week: /, "").replace(/^./, (ch) => ch.toUpperCase())}</p>

      {rows.length > 0 && (
        <>
          <div className="mt-5 flex h-2.5 gap-0.5 overflow-hidden rounded-full" aria-hidden="true">
            {rows.map(({ c, share }) => (
              <span key={c.id} style={{ width: `${share * 100}%`, background: colorOf(c) }} />
            ))}
          </div>
          <ul className="mt-4 space-y-1.5 text-[0.9375rem]">
            {rows.map(({ c, share }) => (
              <li key={c.id} className="flex items-center gap-2.5">
                <span className="inline-block size-2 rounded-full" style={{ background: colorOf(c) }} aria-hidden="true" />
                <span>{c.label}</span>
                <span className="ml-auto tabular-nums text-muted">{Math.round(share * 100)}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
