"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label, summary";

/**
 * Cursor follower: a ring that trails the pointer with a little lag and a dot that
 * sits exactly on it. The ring opens up over links and buttons, and turns into a
 * labelled disc over anything marked data-cursor="Label" (e.g. the project montages).
 * Mouse and pen only, and off entirely for prefers-reduced-motion. The native
 * cursor stays everywhere except over a labelled disc, where it would cover the label;
 * that only happens once this component is running (html.has-cursor).
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!root || !ring || !dot) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let started = false;
    let lastLabel = "";

    const tick = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (reduce.matches || !fine.matches || (e.pointerType !== "mouse" && e.pointerType !== "pen")) return;
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        x = tx;
        y = ty;
        started = true;
      }
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      root.setAttribute("data-on", "");

      const el = e.target as Element | null;
      const labelled = el?.closest?.<HTMLElement>("[data-cursor]");
      const next = labelled?.dataset.cursor ?? "";
      if (next !== lastLabel) {
        lastLabel = next;
        setLabel(next);
      }
      root.dataset.state = next ? "label" : el?.closest?.(INTERACTIVE) ? "link" : "";
      document.documentElement.classList.add("has-cursor");
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const hide = () => root.removeAttribute("data-on");
    const off = () => {
      hide();
      document.documentElement.classList.remove("has-cursor");
    };
    const onDown = () => root.setAttribute("data-press", "");
    const onUp = () => root.removeAttribute("data-press");
    const onReduce = () => reduce.matches && off();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    reduce.addEventListener("change", onReduce);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      reduce.removeEventListener("change", onReduce);
      off();
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-label">{label}</span>
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
