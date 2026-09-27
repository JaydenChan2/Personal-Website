// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: chart-bar;

/**
 * "This week" home screen widget for jaydenchan.xyz.
 * Shows the share of time per category this week, using the site's colours.
 * Works as a small or medium widget. Reads the public, cached /api/summary only
 * (no secret needed). If the network fails, it shows the last good data.
 */

const SITE = "https://www.jaydenchan.xyz";
const SUMMARY_URL = `${SITE}/api/summary`;
const CACHE_FILE = "jaydenchan-activity.json";

// Site palette (same values as app/globals.css)
const BG = Color.dynamic(new Color("#fbfbfa"), new Color("#0d0d0f"));
const INK = Color.dynamic(new Color("#111112"), new Color("#ededee"));
const MUTED = Color.dynamic(new Color("#62626a"), new Color("#9d9da6"));
const TRACK = Color.dynamic(new Color("#f1f1ef"), new Color("#18181b"));

const data = await loadSummary();
const size = config.widgetFamily ?? "medium";
const widget = data ? buildWidget(data, size) : buildMessage("Couldn't load activity.");

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentMedium(); // preview when run inside the app
}
Script.complete();

/* ------------------------------------------------------------------ */

async function loadSummary() {
  const fm = FileManager.local();
  const path = fm.joinPath(fm.documentsDirectory(), CACHE_FILE);
  try {
    const req = new Request(SUMMARY_URL);
    req.timeoutInterval = 10;
    const json = await req.loadJSON();
    if (!json || !json.week || !Array.isArray(json.categories)) throw new Error("Unexpected response");
    fm.writeString(path, JSON.stringify(json));
    return json;
  } catch (e) {
    return fm.fileExists(path) ? JSON.parse(fm.readString(path)) : null;
  }
}

function buildWidget(data, size) {
  const w = baseWidget();
  const isSmall = size === "small";
  const barWidth = isSmall ? 124 : 290;

  const { minutes, total } = data.week;
  const rows = data.categories
    .map((c) => ({ ...c, share: total ? (minutes[c.id] || 0) / total : 0 }))
    .filter((r) => r.share > 0)
    .sort((a, b) => b.share - a.share);

  const title = w.addText("This week");
  title.font = Font.mediumSystemFont(12);
  title.textColor = MUTED;

  if (!isSmall) {
    w.addSpacer(4);
    const line = w.addText(data.sentence.replace(/^This week: /, "").replace(/^./, (ch) => ch.toUpperCase()));
    line.font = Font.mediumSystemFont(15);
    line.textColor = INK;
    line.lineLimit = 2;
  }

  w.addSpacer(10);

  if (rows.length === 0) {
    const empty = w.addText("Nothing logged yet.");
    empty.font = Font.systemFont(14);
    empty.textColor = INK;
    w.addSpacer();
    return w;
  }

  // Proportion bar
  const bar = w.addStack();
  bar.cornerRadius = 4;
  bar.spacing = 2;
  bar.backgroundColor = TRACK;
  for (const r of rows) {
    const seg = bar.addStack();
    seg.size = new Size(Math.max(3, r.share * barWidth - 2), 8);
    seg.backgroundColor = colorOf(r);
  }

  w.addSpacer(10);

  // Legend: top 3 on small, all on medium (in two columns)
  const shown = isSmall ? rows.slice(0, 3) : rows;
  if (isSmall) {
    for (const r of shown) addLegendRow(w, r, 12);
  } else {
    const cols = w.addStack();
    cols.spacing = 24;
    const half = Math.ceil(shown.length / 2);
    for (const group of [shown.slice(0, half), shown.slice(half)]) {
      const col = cols.addStack();
      col.layoutVertically();
      col.spacing = 3;
      for (const r of group) addLegendRow(col, r, 13);
    }
  }

  w.addSpacer();
  return w;
}

function addLegendRow(parent, r, fontSize) {
  const row = parent.addStack();
  row.centerAlignContent();
  row.spacing = 6;
  const dot = row.addStack();
  dot.size = new Size(7, 7);
  dot.cornerRadius = 3.5;
  dot.backgroundColor = colorOf(r);
  const label = row.addText(r.label);
  label.font = Font.systemFont(fontSize);
  label.textColor = INK;
  row.addSpacer(8);
  const pct = row.addText(`${Math.round(r.share * 100)}%`);
  pct.font = Font.systemFont(fontSize);
  pct.textColor = MUTED;
}

function baseWidget() {
  const w = new ListWidget();
  w.backgroundColor = BG;
  w.setPadding(14, 16, 14, 16);
  w.url = `${SITE}/activity`;
  w.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000); // iOS decides exact timing
  return w;
}

function buildMessage(text) {
  const w = baseWidget();
  const t = w.addText(text);
  t.font = Font.systemFont(13);
  t.textColor = MUTED;
  return w;
}

function colorOf(category) {
  return Color.dynamic(new Color(category.color.light), new Color(category.color.dark));
}
