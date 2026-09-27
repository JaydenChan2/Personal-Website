# jaydenchan.xyz

Personal site. Next.js (App Router) + TypeScript + Tailwind v4. One static page, near-zero client JS
(the theme toggle, the copy-email button and the click-to-load video are the only client components).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks)
```

Deploys to Vercel as-is.

## Editing content

Everything on the page comes from `/content`. You shouldn't need to touch `/components` to update it.

| File | What's in it |
| --- | --- |
| `content/site.ts` | Name, headline, "currently" line, availability, links, education, resume toggle |
| `content/projects.ts` | Selected work (full write-ups) and the one-line "Also built" list |
| `content/experience.ts` | Jobs and leadership, most recent first |

**Add a project:** copy an object in `projects` and fill it in. Each one has a problem, what you built,
one technical decision, optional results (real numbers only), stack, links and optional media
(`youtube`, `image`, or `placeholder`). Exactly one project should be `prominence: "lead"`.

**Screenshots:** put them in `/public/work/` and use
`media: { kind: "image", src: "/work/name.png", alt: "…", width: 1600, height: 1000, caption: "…" }`.

**Placeholders:** wrap anything you don't have yet in `todo("what's missing")`. It renders as a loud
dashed orange chip so it can't ship unnoticed. Before deploying, check nothing is left:

```bash
grep -rn "todo(" content/
```

**Resume:** off by default. Drop the PDF into `/public` and set `resume: "/your-file.pdf"` in
`content/site.ts`. The header and hero links appear automatically.

## Design system

- **Type:** Instrument Serif for display, Geist for body, Geist Mono for metadata (loaded with
  `next/font`, self-hosted, no layout shift).
- **Colour:** tokens live at the top of `app/globals.css` (`--bg`, `--ink`, `--muted`, `--rule`,
  `--accent`), with light and dark versions. All text pairs pass WCAG AA in both themes.
- **Grid:** a 12-column grid (`components/layout.tsx`). Column 1–3 is the "margin" for labels and
  metadata, and columns 4–12 hold content.
- **Fig. 0:** the hero face mesh is MediaPipe's canonical 468-point model, flattened to SVG by
  `scripts/gen-mesh.py`. The one-time scan-in animation is disabled under `prefers-reduced-motion`.
- **OG image:** `app/opengraph-image.tsx`, rendered at build time using the fonts in `app/_og/`.
