# Activity tracker

Log what you're doing from your iPhone with one tap. The site shows a heatmap and a weekly
breakdown on the About page, and a Scriptable widget shows the week on your home screen.

```
iPhone Shortcut ──POST /api/log (x-secret)──▶ Supabase table ◀── /api/summary (cached 15 min) ──▶ About page + widget
```

Each log is a **switch**: `{"activity": "studying"}` starts studying and ends whatever was running.
`{"activity": "stop"}` ends the current activity. Durations are the gaps between entries.

| File | What it does |
| --- | --- |
| `content/activities.ts` | Categories, colours, summary wording, and settings (time zone, 4-hour cap, rate limit) |
| `lib/tracker.ts` | Pure aggregation: sessions, 4-hour cap, midnight/DST splitting, weekly sentence |
| `lib/activity-data.ts` | Server-only Supabase reads and writes (plain `fetch`, no SDK) |
| `app/api/log/route.ts` | `POST /api/log`, used by the Shortcut |
| `app/api/summary/route.ts` | `GET /api/summary`: public, cached, aggregates only |
| `components/activity.tsx` | "What I've been up to" section (server-rendered SVG, no client JS) |
| `scriptable/activity-widget.js` | Home screen widget |
| `supabase/schema.sql` | Table setup |
| `scripts/mock-supabase.mjs` | Local fake Supabase for testing |
| `tests/tracker.test.mjs` | Tests for the aggregation (`npm test`) |

---

## 1. Create the Supabase table

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**. 

This creates `activity_log (id, activity, created_at)` with row-level security **on and no policies**,
so the public anon key can't touch it. Only the server, using the service-role key, can.

## 2. Set the environment variables

You need three. None of them may start with `NEXT_PUBLIC_`, because that would ship them to the browser.

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Supabase → Project Settings → API → **Project URL** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → **service_role** key (secret) |
| `TRACKER_SECRET` | Make one: `openssl rand -base64 32` (must be at least 16 characters) |

- **Locally:** copy `.env.example` to `.env.local` and fill it in. `.env.local` is already git-ignored.
- **On Vercel:** Project → Settings → Environment Variables. Add all three for Production (and
  Preview if you want), then redeploy.

## 3. Test locally

### a. The aggregation logic (no setup needed)

```bash
npm test
```

This covers switching, the 4-hour cap, hiding the in-progress activity, splitting at midnight,
Toronto time vs UTC, a DST change, weekly totals and the summary sentence.

### b. The whole flow without Supabase

```bash
# Terminal 1: fake Supabase (add --seed for ~13 weeks of fake sample data)
node scripts/mock-supabase.mjs --seed

# Terminal 2: the site, pointed at the fake
SUPABASE_URL=http://localhost:54321 SUPABASE_SERVICE_ROLE_KEY=local TRACKER_SECRET=local-dev-secret-123 npm run dev
```

Then:

```bash
# Should return 201
curl -i -X POST http://localhost:3000/api/log \
  -H "x-secret: local-dev-secret-123" -H "content-type: application/json" \
  -d '{"activity":"studying"}'

# Should return 401 (wrong secret) and 400 (unknown activity)
curl -i -X POST http://localhost:3000/api/log -H "x-secret: nope" -d '{"activity":"studying"}'
curl -i -X POST http://localhost:3000/api/log -H "x-secret: local-dev-secret-123" -d '{"activity":"napping"}'

# The public summary
curl -s http://localhost:3000/api/summary | head -c 600
```

Open http://localhost:3000/about to see the section. Run the mock **without** `--seed` to see the
empty state.

> **Cached data:** the summary is cached for 15 minutes, and Next.js keeps that cache in `.next/cache`
> even across restarts. If you switch between seeded and empty data and don't see a change, run
> `rm -rf .next/cache` and restart.

> **The activity you just started won't show up.** By design, the summary only counts an activity once
> it has ended (the next switch or a stop) or has passed the 4-hour cap. Log `studying`, then `stop`
> a minute later, and wait for the cache (or clear it).

### c. Against your real Supabase

Put the real values in `.env.local`, run `npm run dev`, and repeat the curl commands with your real
secret. You'll see rows appear in Supabase → Table Editor → `activity_log`.

## 4. Deploy

Push to GitHub. Vercel builds it, provided the environment variables from step 2 are set. Check
`https://www.jaydenchan.xyz/api/summary` returns JSON.

---

## 5. Build the iOS Shortcut

1. Open **Shortcuts** → tap **+** → rename it **Log activity** (tap the name at the top).
2. Add **Choose from Menu**. Set the prompt to *What are you doing?* and make five items:
   `Studying`, `Building`, `Badminton`, `Social`, `Stop`.
3. Under **each** menu item, add a **Text** action containing the lowercase id:
   `studying`, `building`, `badminton`, `social`, `stop`.
   (The menu passes on whatever the chosen branch's last action outputs, so this becomes the Menu Result.)
4. After **End Menu**, add **Get Contents of URL**:
   - URL: `https://www.jaydenchan.xyz/api/log`
   - Tap **Show More**
   - **Method:** `POST`
   - **Headers:** add one. Key `x-secret`, value: your `TRACKER_SECRET`
   - **Request Body:** `JSON`. Add a **Text** field with key `activity`, and for the value tap
     the variable button and choose **Menu Result**.
5. Optional: add **Show Notification** with text *Logged* so you get confirmation.
6. Tap **Done**, then run it once to test. A new row should appear in Supabase.

**Keep the secret private:** the secret lives inside this Shortcut. Don't share the Shortcut via iCloud
link, because the link would include the secret. If it ever leaks, generate a new `TRACKER_SECRET`,
update it in Vercel (and redeploy) and in the Shortcut.

## 6. Put it on your home screen

- **Icon:** in Shortcuts, long-press **Log activity** → **Share** → **Add to Home Screen**.
- **Widget:** long-press the home screen → **Edit** → **Add Widget** → **Shortcuts** → pick a size
  → tap the widget to choose **Log activity**.
- **Faster options:** Settings → Accessibility → Touch → **Back Tap** → Double Tap → *Log activity*,
  or assign it to the **Action button** on iPhone 15 Pro and later.

## 7. Add the Scriptable widget

1. Install **Scriptable** from the App Store.
2. Open it → **+** → paste the contents of `scriptable/activity-widget.js` → rename the script
   **Activity** (tap the title) → **Done**. Tap ▶︎ to preview it.
3. Long-press the home screen → **Edit** → **Add Widget** → **Scriptable** → choose **Small** or
   **Medium** → **Add Widget**.
4. Tap the new widget (while editing) → **Script:** *Activity* → **When Interacting:** *Run Script*
   (or leave it, since it links to your About page).

It uses only the public summary, so it needs no secret. iOS decides the exact refresh timing (roughly
every 30 minutes at best). If it can't connect, it shows the last data it loaded.

---

## Adding a category

Add one entry to `activities` in `content/activities.ts` (id, label, light/dark colour, phrase, and
optionally `sessionNoun` if you want it counted, like badminton). Then add a matching menu item and
Text action in the Shortcut. If you enabled the optional `CHECK` constraint in the SQL, update it too.

## Security and privacy notes

- **Secret:** checked with a constant-time comparison, must be at least 16 characters, and is never
  logged or returned. The Supabase service-role key only exists on the server.
- **Input:** the body is capped at 512 bytes (read as a stream, so a missing or wrong `Content-Length`
  doesn't matter), must be JSON, and the activity must be a known category or `stop`. The timestamp
  always comes from the database, never the phone.
- **Rate limits:** 10 requests a minute per IP (in memory, per server instance, to slow down secret
  guessing), plus a hard cap of 30 saved entries per rolling hour, checked in the database so it holds
  across instances. The per-IP limit relies on `x-forwarded-for`, which Vercel sets itself; on other
  hosts it could be spoofed, but the hourly cap still applies.
- **Privacy:** `/api/summary` returns only daily and weekly minute totals, never timestamps. An activity
  that's still running isn't counted until it ends or passes the 4-hour cap, so the summary never
  shows what you're doing right now. The 15-minute cache also blurs exactly when sessions end.
- **Cross-site requests:** the log endpoint needs a custom header and sends no CORS headers, so a
  malicious web page can't make your browser log anything.
