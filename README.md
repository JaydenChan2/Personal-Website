# jaydenchan.xyz

My personal site: work, experience, and a live look at what I've been spending time on.
Live at **[www.jaydenchan.xyz](https://www.jaydenchan.xyz)**.

Built with Next.js (App Router), TypeScript and Tailwind CSS v4. Nearly everything is server-rendered;
the only client JavaScript is a handful of small interactive pieces (nav, theme toggle, copy-email,
cursor field, project preview, click-to-load video).

---

## Contents

- [Tech stack](#tech-stack)
- [Pages](#pages)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Editing content](#editing-content)
- [Activity tracker](#activity-tracker)
- [Design notes](#design-notes)
- [Testing](#testing)
- [Deploying](#deploying)
- [Before you ship](#before-you-ship)

---

## Tech stack

| Layer | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, static generation + 15-minute revalidation), React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/postcss`), CSS custom properties for light/dark theming |
| Fonts & images | `next/font` (Schibsted Grotesk, self-hosted), `next/image` (AVIF/WebP) |
| Share image | `next/og` (Open Graph image rendered at build time) |
| Charts | Hand-written SVG, server-rendered, no charting library |
| Database | [Supabase](https://supabase.com) (Postgres), called through its REST API with plain `fetch`, no SDK |
| API | Next.js route handlers (`/api/log`, `/api/summary`) |
| Testing | Node's built-in test runner (`node --test`) |
| Hosting | [Vercel](https://vercel.com) |
| iPhone | iOS Shortcuts (logging) and [Scriptable](https://scriptable.app) (home screen widget) |

Runtime dependencies are just `next`, `react` and `react-dom`; everything else is a dev dependency.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page: name, current roles, intro, links, and a hover-preview of featured projects. Fits one screen. |
| `/work` | Featured projects as cards, then a "More projects" list |
| `/work/[slug]` | One page per project (problem, what I built, one technical decision, outcomes, screenshots, demo) |
| `/experience` | Roles, most recent first, plus education |
| `/about` | A short bio and what I do away from the keyboard |
| `/activity` | "What I've been up to": weekly breakdown, time totals and per-category charts, fed by the activity tracker |
| `/contact` | Email (with a copy button), LinkedIn, GitHub |
| `/api/log` | `POST` endpoint the iOS Shortcut uses to log activities (secret-protected) |
| `/api/summary` | Public, cached activity aggregates (used by the Scriptable widget) |

Also generated: `sitemap.xml`, `robots.txt`, an Open Graph image, and a favicon.

## Getting started

Requires **Node.js 20.9 or newer**.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serve the production build |
| `npm run typecheck` | Type-check without building |
| `npm test` | Run the activity-tracker tests (Node's built-in runner, no extra dependencies) |

The site builds and runs **without any environment variables**. Only the activity tracker needs them;
without them, `/activity` shows its empty state.

## Environment variables

Copy `.env.example` to `.env.local` for local development, and add the same values in Vercel
(Project → Settings → Environment Variables). None of these may start with `NEXT_PUBLIC_`, since that
would expose them to the browser.

| Variable | Used for | Where to get it |
| --- | --- | --- |
| `SUPABASE_URL` | Activity tracker storage | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only database access | Supabase → Project Settings → API → `service_role` key |
| `TRACKER_SECRET` | Authenticating the iOS Shortcut | `openssl rand -base64 32` (at least 16 characters) |

## Project structure

```
app/                    Routes (App Router)
  page.tsx              Home
  work/                 /work and /work/[slug]
  experience/ about/ activity/ contact/
  api/log/route.ts      POST /api/log
  api/summary/route.ts  GET /api/summary
  layout.tsx            Fonts, metadata, theme + intro script, nav
  globals.css           Design tokens, components, motion
  opengraph-image.tsx   Share image (fonts in app/_og/)
components/             UI pieces (nav, covers, charts, cursor field, …)
content/                Everything you edit: site info, projects, experience, activity categories
lib/
  tracker.ts            Pure activity aggregation (sessions, caps, time zones)
  activity-data.ts      Server-only Supabase access (plain fetch, no SDK)
public/                 Portrait and project screenshots
docs/                   Activity tracker setup guide
scriptable/             iOS home screen widget
scripts/                Local mock of Supabase for testing
supabase/               Table schema
tests/                  Tests for lib/tracker.ts
```

## Editing content

Everything on the site comes from `/content`. You shouldn't need to touch `/app` or `/components` to
update it.

| File | What's in it |
| --- | --- |
| `content/site.ts` | Name, intro, "currently" roles, availability, links, education, resume toggle |
| `content/projects.ts` | Projects (each gets its own page) and the one-line "More projects" list |
| `content/experience.ts` | Roles and leadership, most recent first |
| `content/activities.ts` | Activity categories, their colours, and tracker settings |

**Add a project.** Copy an entry in `projects`. The first featured project gets the wide card on `/work`
and is the default preview on the home page. Set `featured: false` to list it under "More projects"
instead (it still gets its own page). Put screenshots in `public/work/` and reference them as `cover`
or `gallery` images. Only add numbers you can back up.

**Add an activity category.** Add one entry to `activities` in `content/activities.ts`, then add a
matching item to the iOS Shortcut. The colours are checked for colour-blind safety; re-check the set if
you change them.

**Placeholders.** Wrap anything you don't have yet in `todo("what's missing")`. It renders as a loud red
dashed chip so it can't ship unnoticed.

**Resume.** Off by default. Drop the PDF into `public/` and set `resume: "/your-file.pdf"` in
`content/site.ts`; links appear in the nav and on the home page automatically.

## Activity tracker

A one-tap iOS Shortcut logs what I'm doing to Supabase. The `/activity` page and a home screen widget
show the aggregates.

```
iOS Shortcut ──POST /api/log (x-secret)──▶ Supabase ◀── /api/summary (cached 15 min) ──▶ /activity + widget
```

- Each log is a **switch**: `{"activity": "studying"}` starts studying and ends whatever was running;
  `{"activity": "stop"}` ends it. Durations come from the gaps between entries.
- Sessions are capped at 4 hours, split at local midnight (America/Toronto, DST-safe), and the activity
  in progress is never shown publicly.
- The API returns aggregates only: no raw timestamps.

Full setup (Supabase table, the Shortcut, the Scriptable widget, local testing and security notes) is in
**[docs/activity-tracker.md](docs/activity-tracker.md)**.

## Design notes

- **Type:** Schibsted Grotesk only, self-hosted through `next/font` (no layout shift).
- **Colour:** tokens at the top of `app/globals.css` (`--bg`, `--ink`, `--muted`, `--line`, `--accent`,
  `--live`) with light and dark sets. Dark mode follows the system unless the visitor picks a theme.
  All text passes WCAG AA.
- **Detection box:** the corner brackets that snap onto hovered projects, a nod to object detection
  (`.detect` / `.detect-box` in `globals.css`).
- **Cursor field:** a dot grid lights up around the pointer and a reticle trails it
  (`components/cursor-field.tsx`). Mouse and trackpad only.
- **Entrance:** hero elements fade and rise once per session, in under 600 ms. Set up by a small script
  in `app/layout.tsx`; per-item delays use the `--d` style on `.intro-item`.
- **Charts:** server-rendered SVG with CSS-only hover, a shared scale across categories, and a
  screen-reader table of the same data.
- **Accessibility:** semantic HTML and keyboard navigation with visible focus. Under
  `prefers-reduced-motion`, the entrance, cursor field and looping animations are off and movement
  transitions are removed (only small hover fades remain).

## Testing

```bash
npm test
```

This covers the activity aggregation: switching, the 4-hour cap, hiding the in-progress activity,
midnight and DST splits, weekly comparisons, and day/week/month totals.

To try the whole tracker without a Supabase project, run the local mock:

```bash
node scripts/mock-supabase.mjs --seed     # fake sample data; omit --seed for the empty state

SUPABASE_URL=http://localhost:54321 SUPABASE_SERVICE_ROLE_KEY=local \
TRACKER_SECRET=local-dev-secret-123 npm run dev
```

The summary is cached for 15 minutes, and Next.js keeps that cache in `.next/cache` across restarts. If
data looks stale while testing, run `rm -rf .next/cache`.

## Deploying

The site deploys to Vercel with no extra configuration:

1. Push to GitHub and import the repo in Vercel (or push to the connected branch).
2. Add the three environment variables above.
3. Point the domain at the project.

After deploying, check that `https://www.jaydenchan.xyz/api/summary` returns JSON.

## Before you ship

```bash
grep -rn "todo(" content/     # any placeholders left?
npm test && npm run build
```
