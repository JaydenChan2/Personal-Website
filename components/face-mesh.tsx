import mesh from "@/lib/mesh.json";

/**
 * Fig. 0: MediaPipe's 468-point canonical face mesh, turned to a three-quarter view
 * and flattened to static SVG paths at build time (see scripts/gen-mesh.py).
 * No JS; the one-time scan-in is CSS and is skipped for prefers-reduced-motion.
 */

const callouts = [
  { id: 263, name: "Lateral canthus", at: mesh.anchors.eyeL, y: 150 },
  { id: 1, name: "Pronasale", at: mesh.anchors.nose, y: 262 },
  { id: 152, name: "Menton", at: mesh.anchors.chin, y: 446 },
];

// Points are bucketed by depth (back → front) and drawn progressively stronger.
const pointStyles = [
  { stroke: "var(--rule-strong)", width: 2.2 },
  { stroke: "var(--muted)", width: 2.4 },
  { stroke: "var(--ink)", width: 2.6 },
];

export function FaceMesh() {
  return (
    <svg
      viewBox="0 0 600 480"
      className="mesh h-auto w-[150%] max-w-none md:w-full md:overflow-visible"
      role="img"
      aria-labelledby="fig0-title"
    >
      <title id="fig0-title">
        Line drawing of a three-quarter face made of 468 tracked landmark points, the same mesh used in
        Facet.
      </title>

      <g className="mesh-reveal">
        <g className="mesh-lines" opacity="0.7" fill="none" strokeLinecap="round">
          <path d={mesh.tess} stroke="var(--rule)" strokeWidth="0.6" />
          <path d={mesh.contour} stroke="var(--rule-strong)" strokeWidth="0.9" />
        </g>
        <g fill="none" strokeLinecap="round">
          {mesh.points.map((d, i) => (
            <path key={i} d={d} stroke={pointStyles[i].stroke} strokeWidth={pointStyles[i].width} />
          ))}
        </g>
      </g>

      <line
        className="mesh-scan"
        x1="0"
        x2="400"
        y1="0"
        y2="0"
        stroke="var(--accent)"
        strokeWidth="1"
        opacity="0"
      />

      <g className="mesh-callouts max-md:hidden" fill="none" stroke="var(--accent)" strokeWidth="0.9">
        {callouts.map((c) => (
          <g key={c.id}>
            <circle cx={c.at[0]} cy={c.at[1]} r="4.5" />
            <path d={`M${c.at[0] + 4.5} ${c.at[1]}L${c.at[0] + 18} ${c.at[1]}L420 ${c.y}L432 ${c.y}`} opacity="0.8" />
          </g>
        ))}
      </g>
      <g className="mesh-callouts max-md:hidden" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="0.02em">
        {callouts.map((c) => (
          <text key={c.id} x="438" y={c.y + 4} fill="var(--muted)">
            <tspan fill="var(--accent)">{String(c.id).padStart(3, "0")}</tspan> {c.name}
          </text>
        ))}
      </g>
    </svg>
  );
}
