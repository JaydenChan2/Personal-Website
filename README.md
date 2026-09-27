# jaydenchan.xyz

Personal site. Next.js (App Router) + TypeScript + Tailwind v4. One static page, near-zero client JS
(the theme toggle, the copy-email button and the click-to-load video are the only client components).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
```

Deploys to Vercel as-is.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page: name, intro, links, and a hover-preview list of featured projects. Fits one screen. |
| `/work` | Featured projects as cards, then a "More projects" list |
| `/work/[slug]` | One page per project, generated from `content/projects.ts` |
| `/experience`, `/about`, `/contact` | What they say |

## Editing content

Everything comes from `/content`. You shouldn't need to touch `/app` or `/components` to update it.

| File | What's in it |
| --- | --- |
| `content/site.ts` | Name, intro, "currently" line, availability, links, education, resume toggle |
| `content/projects.ts` | Projects (each gets its own page) and the one-line "More projects" list |
| `content/experience.ts` | Jobs and leadership, most recent first |

**Add a project:** copy an object in `projects`. The first featured project gets the wide card and is the
default home preview. Set `featured: false` to list it under "More projects" instead (it still gets a page).
Screenshots go in `/public/work/` and are referenced as `cover` or `gallery` images.

**Placeholders:** wrap anything you don't have yet in `todo("what's missing")`. It renders as a loud
dashed red chip so it can't ship unnoticed. Before deploying:

```bash
grep -rn "todo(" content/
```

**Resume:** off by default. Drop the PDF into `/public` and set `resume: "/your-file.pdf"` in
`content/site.ts`; the nav and home page pick it up.

## Design system

- **Type:** Schibsted Grotesk only, via `next/font` (self-hosted, no layout shift).
- **Colour:** tokens at the top of `app/globals.css` (`--bg`, `--ink`, `--muted`, `--line`, `--accent`,
  `--live`), with light and dark versions. All text pairs pass WCAG AA.
- **Detection box:** the corner brackets that snap onto hovered projects (`.detect` / `.detect-box` in
  `globals.css`). A nod to object detection, and the site's one signature detail.
- **Motion:** page content staggers in, the name rises word by word, the nav pill slides between pages,
  and project pages reveal on scroll (CSS scroll-driven, where supported). All of it is disabled under
  `prefers-reduced-motion`.
- **OG image:** `app/opengraph-image.tsx`, rendered at build time with the fonts in `app/_og/`.
