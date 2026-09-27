// Local stand-in for the two Supabase REST calls the tracker makes, so you can test
// without a Supabase project. In-memory only; data is lost when you stop it.
//
//   node scripts/mock-supabase.mjs          # empty table (see the empty state)
//   node scripts/mock-supabase.mjs --seed   # ~13 weeks of FAKE sample data for layout testing
//
// Then run the site with:
//   SUPABASE_URL=http://localhost:54321 SUPABASE_SERVICE_ROLE_KEY=local TRACKER_SECRET=local-dev-secret-123 npm run dev
import { createServer } from "node:http";

const PORT = 54321;
const rows = [];
let nextId = 1;

if (process.argv.includes("--seed")) {
  const kinds = ["studying", "building", "badminton", "social"];
  const now = Date.now();
  for (let d = 90; d >= 1; d--) {
    if (Math.random() < 0.25) continue; // some empty days
    let t = now - d * 86400_000 - 10 * 3600_000; // roughly late morning
    for (let s = 0; s < 1 + Math.floor(Math.random() * 3); s++) {
      const activity = kinds[Math.floor(Math.random() ** 1.6 * kinds.length)];
      rows.push({ id: nextId++, activity, created_at: new Date(t).toISOString() });
      t += (30 + Math.random() * 150) * 60_000;
      rows.push({ id: nextId++, activity: "stop", created_at: new Date(t).toISOString() });
      t += Math.random() * 120 * 60_000;
    }
  }
  console.log(`Seeded ${rows.length} fake entries (sample data only).`);
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.headers.apikey !== "local") return send(res, 401, { message: "bad key" });
  if (!url.pathname.endsWith("/activity_log")) return send(res, 404, {});

  if (req.method === "POST") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { activity } = JSON.parse(body);
    rows.push({ id: nextId++, activity, created_at: new Date().toISOString() });
    console.log("insert", activity);
    return send(res, 201, null);
  }

  // GET: supports created_at=gte.<iso>, order=created_at.asc, limit=<n>
  const gte = url.searchParams.get("created_at")?.replace(/^gte\./, "");
  const limit = Number(url.searchParams.get("limit") ?? 10000);
  const out = rows.filter((r) => !gte || r.created_at >= gte).sort((a, b) => a.created_at.localeCompare(b.created_at)).slice(0, limit);
  send(res, 200, out);
}).listen(PORT, "127.0.0.1", () => console.log(`Mock Supabase on http://localhost:${PORT} (this machine only)`));

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(data === null ? "" : JSON.stringify(data));
}
