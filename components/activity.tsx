/**
 * "What I've been up to": this week's breakdown + one small line chart per category.
 * Server components only (plain SVG and divs, no client JS). Hover is CSS-only.
 */
import { activities, tracker, type ActivityCategory } from "@/content/activities";
import type { Summary } from "@/lib/tracker";

/** A category's colour that follows the site's light/dark theme. */
const colorOf = (c: ActivityCategory) => `light-dark(${c.color.light}, ${c.color.dark})`;

function formatMinutes(m: number) {
  const rounded = Math.round(m);
  if (rounded < 60) return `${rounded}m`;
  const h = Math.floor(rounded / 60);
  const min = rounded % 60;
  return min === 0 ? `${h}h` : `${h}h ${min}m`;
}

/** Per-day averages: "45m", "1.8h". */
function formatPerDay(m: number) {
  const rounded = Math.round(m);
  return rounded < 60 ? `${rounded}m` : `${(m / 60).toFixed(1).replace(/\.0$/, "")}h`;
}

// Dates are calendar days (YYYY-MM-DD), so format them in UTC to avoid shifting a day.
const dayLabel = new Intl.DateTimeFormat("en-CA", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "UTC" });
const parseDay = (date: string) => new Date(`${date}T00:00:00Z`);

export function ActivityContent({ summary }: { summary: Summary | null }) {
  if (!summary) {
    return <p className="border-t border-line pt-6 text-muted">This is taking a break right now. Check back later.</p>;
  }
  if (!summary.hasData) {
    return (
      <div className="border-t border-line pt-6">
        <p className="text-lg">Nothing logged yet.</p>
        <p className="mt-1 text-muted">I&rsquo;ve only just started tracking this. Check back in a week or two.</p>
      </div>
    );
  }
  return (
    <div className="grid gap-x-12 gap-y-12 border-t border-line pt-8 md:grid-cols-12">
      <div className="space-y-12 md:col-span-4">
        <section aria-labelledby="this-week">
          <WeekBreakdown summary={summary} />
        </section>
        <section aria-labelledby="time-spent">
          <TimeTotals summary={summary} />
        </section>
      </div>
      <section aria-label="Time per day by category" className="md:col-span-8">
        <CategoryCharts summary={summary} />
      </section>
    </div>
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
      <h2 id="this-week" className="label">This week</h2>
      <p className="mt-1 text-lg leading-snug">
        {summary.sentence.replace(/^This week: /, "").replace(/^./, (ch) => ch.toUpperCase())}
      </p>

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

/* ------------------------------------------------------------------
   Time spent: totals per category for today, this week and this month.
   ------------------------------------------------------------------ */

const monthName = new Intl.DateTimeFormat("en-CA", { month: "long", timeZone: "UTC" });

function TimeTotals({ summary }: { summary: Summary }) {
  const { today, week, month, monthStart } = summary.totals;
  const periods = [
    { key: "today", label: "Today", minutes: today },
    { key: "week", label: "Week", minutes: week },
    { key: "month", label: monthName.format(parseDay(monthStart)), minutes: month },
  ];
  const sum = (m: Record<string, number>) => Object.values(m).reduce((a, b) => a + b, 0);
  const show = (m: number) => (m > 0 ? formatMinutes(m) : "–");

  return (
    <div>
      <h2 id="time-spent" className="label">
        Time spent
      </h2>
      <table className="mt-3 w-full text-[0.9375rem]">
        <thead>
          <tr className="text-left text-sm text-muted">
            <th scope="col" className="pb-2 font-normal">
              <span className="sr-only">Category</span>
            </th>
            {periods.map((p) => (
              <th key={p.key} scope="col" className="pb-2 text-right font-normal">
                {p.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {activities.map((c) => (
            <tr key={c.id} className="border-t border-line">
              <th scope="row" className="py-2 text-left font-normal">
                <span className="flex items-center gap-2.5">
                  <span className="inline-block size-2 shrink-0 rounded-full" style={{ background: colorOf(c) }} aria-hidden="true" />
                  {c.label}
                </span>
              </th>
              {periods.map((p) => (
                <td key={p.key} className={`py-2 pl-3 text-right ${p.minutes[c.id] ? "" : "text-muted"}`}>
                  {show(p.minutes[c.id] ?? 0)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-line-strong font-medium">
            <th scope="row" className="py-2 text-left font-medium">
              Total
            </th>
            {periods.map((p) => (
              <td key={p.key} className="py-2 pl-3 text-right">
                {show(sum(p.minutes))}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="label mt-3">Today&rsquo;s count updates once an activity ends.</p>
    </div>
  );
}

/* ------------------------------------------------------------------
   Small multiples: one line chart per category, all on the same scale,
   covering the last few weeks. Dashed = last week's daily average,
   thin coloured = this week's average so far.
   ------------------------------------------------------------------ */

const W = 320;
const H = 132;
const PAD = { left: 28, right: 10, top: 10, bottom: 20 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

/** Round the y-axis top up to a friendly number of hours. */
function niceMaxHours(maxMinutes: number) {
  const hours = maxMinutes / 60;
  return [1, 2, 3, 4, 6, 8, 10, 12, 16, 24].find((n) => n >= hours) ?? Math.ceil(hours);
}

function CategoryCharts({ summary }: { summary: Summary }) {
  const slots = tracker.chartWeeks * 7;
  // Chart window: the last `chartWeeks` Monday-to-Sunday weeks, ending with this week.
  const start = summary.days.length - (7 * (tracker.chartWeeks - 1) + summary.week.daysElapsed);
  const days = summary.days.slice(Math.max(0, start));
  const { compare } = summary;

  // One shared scale so the charts can be compared honestly.
  let maxMinutes = 60;
  for (const d of days) for (const m of Object.values(d.minutes)) maxMinutes = Math.max(maxMinutes, m);
  if (compare.enabled) {
    for (const c of activities) maxMinutes = Math.max(maxMinutes, compare.lastWeek[c.id], compare.thisWeek[c.id]);
  }
  const maxHours = niceMaxHours(maxMinutes);

  const x = (i: number) => PAD.left + (i / (slots - 1)) * PLOT_W;
  const y = (minutes: number) => PAD.top + PLOT_H - (minutes / (maxHours * 60)) * PLOT_H;
  const scale = { x, y, slots, maxHours };

  return (
    <div>
      <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {activities.map((c) => (
          <li key={c.id}>
            <CategoryChart category={c} days={days} summary={summary} scale={scale} />
          </li>
        ))}
      </ul>

      <div className="label mt-6 flex flex-wrap items-center gap-x-5 gap-y-2" aria-hidden="true">
        <span className="flex items-center gap-2">
          <svg width="18" height="8"><path d="M1 6 L6 2 L11 5 L17 1" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Time per day
        </span>
        {compare.enabled ? (
          <>
            <span className="flex items-center gap-2">
              <svg width="18" height="8"><path d="M0 4 H18" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 3" /></svg>
              Last week&rsquo;s daily average
            </span>
            <span className="flex items-center gap-2">
              <svg width="18" height="8"><path d="M0 4 H18" stroke="var(--muted)" strokeWidth="1.5" opacity="0.6" /></svg>
              This week&rsquo;s average so far
            </span>
          </>
        ) : (
          <span>The weekly comparison appears once there&rsquo;s a full week of data.</span>
        )}
      </div>

      <DataTable days={days} />
    </div>
  );
}

type Scale = { x: (i: number) => number; y: (m: number) => number; slots: number; maxHours: number };

function CategoryChart({
  category: c,
  days,
  summary,
  scale: { x, y, slots, maxHours },
}: {
  category: ActivityCategory;
  days: Summary["days"];
  summary: Summary;
  scale: Scale;
}) {
  const { compare } = summary;
  const values = days.map((d) => d.minutes[c.id] ?? 0);
  const last = values.length - 1;
  const thisWeekFrom = slots - 7;
  const lastWeekFrom = slots - 14;
  const avgNow = compare.thisWeek[c.id];
  const avgBefore = compare.lastWeek[c.id];
  const delta = avgNow - avgBefore;

  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(last).toFixed(1)} ${y(0)} L${x(0)} ${y(0)} Z`;
  const color = colorOf(c);

  const summaryText = compare.enabled
    ? `${c.label}: averaging ${formatPerDay(avgNow)} a day this week, compared with ${formatPerDay(avgBefore)} last week.`
    : `${c.label}: averaging ${formatPerDay(avgNow)} a day this week.`;

  return (
    <figure>
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 font-medium">
          <span className="inline-block size-2 rounded-full" style={{ background: color }} aria-hidden="true" />
          {c.label}
        </span>
        <span className="text-sm text-muted">
          <span className="text-ink">{formatPerDay(avgNow)}</span>/day
          {compare.enabled && (
            <span>
              {" · "}
              {Math.abs(delta) < 1
                ? "same as last week"
                : `${delta > 0 ? "↑" : "↓"} ${formatPerDay(Math.abs(delta))} vs last week`}
            </span>
          )}
        </span>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 h-auto w-full overflow-visible" role="img" aria-label={summaryText}>
        {/* This week's band */}
        <rect x={x(thisWeekFrom) - 4} y={PAD.top - 4} width={x(slots - 1) - x(thisWeekFrom) + 8} height={PLOT_H + 8} rx={4} fill="var(--sunken)" />

        {/* Gridlines + y ticks (0, half, max) */}
        <g fontSize="10" fill="var(--muted)">
          {[0, maxHours / 2, maxHours].map((h) => (
            <g key={h}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(h * 60)} y2={y(h * 60)} stroke="var(--line)" strokeWidth="1" />
              <text x={PAD.left - 6} y={y(h * 60) + 3.5} textAnchor="end">
                {h === 0 ? "0" : `${h}h`}
              </text>
            </g>
          ))}
          {/* x labels: the Monday of each week */}
          {Array.from({ length: slots / 7 }, (_, w) => w * 7)
            .filter((i) => days[i])
            .map((i) => (
              <text key={i} x={x(i)} y={H - 5} textAnchor={i === 0 ? "start" : "middle"}>
                {i === slots - 7 ? "This wk" : shortDate.format(parseDay(days[i].date))}
              </text>
            ))}
        </g>

        {/* Averages */}
        {compare.enabled && (
          <g>
            <line x1={x(lastWeekFrom)} x2={x(slots - 1)} y1={y(avgBefore)} y2={y(avgBefore)} stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1={x(thisWeekFrom)} x2={x(slots - 1)} y1={y(avgNow)} y2={y(avgNow)} style={{ stroke: color }} strokeWidth="1.5" opacity="0.6" />
          </g>
        )}

        {/* The data */}
        <path d={area} style={{ fill: color }} fillOpacity="0.1" />
        <path d={line} fill="none" style={{ stroke: color }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={x(last)} cy={y(values[last])} r="4" style={{ fill: color }} stroke="var(--bg)" strokeWidth="2" />

        {/* Hover: invisible full-height columns; CSS reveals the crosshair and dot, <title> gives the value */}
        {values.map((v, i) => (
          <g key={days[i].date} className="chart-day">
            <rect x={x(i) - PLOT_W / (slots - 1) / 2} y={PAD.top} width={PLOT_W / (slots - 1)} height={PLOT_H} fill="transparent" />
            <line className="chart-hover" x1={x(i)} x2={x(i)} y1={PAD.top} y2={PAD.top + PLOT_H} stroke="var(--line-strong)" strokeWidth="1" />
            <circle className="chart-hover" cx={x(i)} cy={y(v)} r="4" style={{ fill: color }} stroke="var(--bg)" strokeWidth="2" />
            <title>{`${c.label}, ${dayLabel.format(parseDay(days[i].date))}: ${v ? formatMinutes(v) : "none"}`}</title>
          </g>
        ))}
      </svg>
    </figure>
  );
}

/** The same numbers as a table, for screen readers. */
function DataTable({ days }: { days: Summary["days"] }) {
  return (
    <table className="sr-only">
      <caption>Time per day by category</caption>
      <thead>
        <tr>
          <th scope="col">Day</th>
          {activities.map((c) => (
            <th key={c.id} scope="col">
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {days.map((d) => (
          <tr key={d.date}>
            <th scope="row">{dayLabel.format(parseDay(d.date))}</th>
            {activities.map((c) => (
              <td key={c.id}>{formatMinutes(d.minutes[c.id] ?? 0)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
