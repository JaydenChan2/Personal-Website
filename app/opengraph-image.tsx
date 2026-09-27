import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = "Jayden Chan: Software & ML";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const dir = join(process.cwd(), "app/_og");
  const [medium, regular] = await Promise.all([
    readFile(join(dir, "SchibstedGrotesk-Medium.ttf")),
    readFile(join(dir, "SchibstedGrotesk-Regular.ttf")),
  ]);

  const corner = (pos: Record<string, number>, borders: Record<string, string>) => (
    <div style={{ position: "absolute", width: 28, height: 28, ...pos, ...borders }} />
  );
  const b = "3px solid #2340ff";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fbfbfa", padding: 80, fontFamily: "Sans" }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#62626a" }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: "#17803f", marginRight: 14 }} />
          Autonomy at WARG · SWE intern at World Health Network
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", display: "flex", alignSelf: "flex-start", padding: "8px 22px 22px 18px", marginLeft: -18 }}>
            {corner({ top: 0, left: 0 }, { borderTop: b, borderLeft: b })}
            {corner({ top: 0, right: 0 }, { borderTop: b, borderRight: b })}
            {corner({ bottom: 0, left: 0 }, { borderBottom: b, borderLeft: b })}
            {corner({ bottom: 0, right: 0 }, { borderBottom: b, borderRight: b })}
            <div style={{ fontSize: 150, fontWeight: 500, letterSpacing: -7, lineHeight: 1, color: "#111112" }}>Jayden Chan</div>
          </div>
          <div style={{ fontSize: 38, lineHeight: 1.3, color: "#111112", marginTop: 30, maxWidth: 900, fontWeight: 400 }}>
            {site.intro}
          </div>
        </div>
        <div style={{ fontSize: 26, color: "#62626a" }}>jaydenchan.xyz</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Sans", data: medium, style: "normal", weight: 500 },
        { name: "Sans", data: regular, style: "normal", weight: 400 },
      ],
    },
  );
}
