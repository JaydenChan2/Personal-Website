/**
 * Section head on the 12-column grid: a mono index label in the margin,
 * a light/bold headline across the middle, an optional side note on the right.
 * `as="h1"` for the top of an inner page.
 */
export function SecHead({
  label,
  as: H = "h2",
  side,
  children,
  id,
}: {
  label: string;
  as?: "h1" | "h2";
  side?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="sec-head">
      <span className="mono fx">{label}</span>
      <H className="fx" id={id}>
        {children}
      </H>
      {side && <p className="side fx">{side}</p>}
    </div>
  );
}
