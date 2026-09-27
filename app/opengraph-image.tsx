import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import mesh from "@/lib/mesh.json";
import { site } from "@/content/site";

export const alt = "Jayden Chan: Software & ML";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1b1a17";
const PAPER = "#f6f4ef";
const MUTED = "#5c5850";
const ACCENT = "#b83c0a";

export default async function OpenGraphImage() {
  const dir = join(process.cwd(), "app/_og");
  const [serif, sans, mono] = await Promise.all([
    readFile(join(dir, "InstrumentSerif-Regular.ttf")),
    readFile(join(dir, "Geist-Regular.ttf")),
    readFile(join(dir, "GeistMono-Regular.ttf")),
  ]);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${mesh.viewBox}"><g fill="none" stroke-linecap="round"><path d="${mesh.tess}" stroke="#dcd6cb" stroke-width="0.7"/><path d="${mesh.contour}" stroke="#bdb6a9" stroke-width="1"/>${mesh.points
    .map((d, i) => `<path d="${d}" stroke="${["#bdb6a9", MUTED, INK][i]}" stroke-width="2.6"/>`)
    .join("")}</g></svg>`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, padding: 72 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ fontFamily: "Mono", fontSize: 20, letterSpacing: 1.5, color: MUTED, textTransform: "uppercase" }}>
            {site.kicker}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Serif", fontSize: 150, lineHeight: 0.9, color: INK, letterSpacing: -2 }}>
              Jayden Chan
            </div>
            <div style={{ fontFamily: "Serif", fontSize: 40, lineHeight: 1.2, color: INK, marginTop: 28, maxWidth: 620 }}>
              {site.headline}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Sans", fontSize: 22, color: MUTED }}>
            <span style={{ color: ACCENT, marginRight: 12 }}>●</span> jaydenchan.xyz
          </div>
        </div>
        <img
          alt=""
          width={340}
          height={408}
          style={{ alignSelf: "center" }}
          src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Serif", data: serif, style: "normal", weight: 400 },
        { name: "Sans", data: sans, style: "normal", weight: 400 },
        { name: "Mono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
