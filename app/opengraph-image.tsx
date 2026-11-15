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

  const label = { fontSize: 20, letterSpacing: 3, textTransform: "uppercase" as const, color: "#6d6d68" };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#fcfcfb", padding: 80, fontFamily: "Sans" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: 7, textTransform: "uppercase", color: "#141413" }}>
            {`${site.name}.`}
          </div>
          <div style={label}>Software &amp; ML</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 400, letterSpacing: -2, lineHeight: 1.04, color: "#141413" }}>Software,</div>
          <div style={{ fontSize: 96, fontWeight: 500, letterSpacing: -2, lineHeight: 1.04, color: "#141413" }}>and the world</div>
          <div style={{ fontSize: 96, fontWeight: 400, letterSpacing: -2, lineHeight: 1.04, color: "#141413" }}>it runs in.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #d2d2cc", paddingTop: 24 }}>
          <div style={label}>Waterloo &amp; Laurier</div>
          <div style={label}>jaydenchan.xyz</div>
        </div>
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
