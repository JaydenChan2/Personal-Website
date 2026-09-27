"use client";

import { useEffect, useRef } from "react";

/**
 * Background layer that follows the cursor: a dot grid lights up around the
 * pointer and a detection-box reticle trails it with a little lag, like a
 * tracker locking on. Only runs for mouse/trackpad users without reduced
 * motion; on touch devices it renders nothing visible.
 */
export function CursorField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const box = boxRef.current;
    if (!field || !box) return;
    const canHover = matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (!canHover.matches || reduce.matches) return;

    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    let raf = 0;
    let started = false;

    const tick = () => {
      // Ease the reticle toward the pointer; the dots follow the pointer exactly.
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      field.style.setProperty("--mx", `${tx}px`);
      field.style.setProperty("--my", `${ty}px`);
      box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        x = tx;
        y = ty;
        started = true;
      }
      const overControl = (e.target as Element | null)?.closest?.("a, button, input, textarea, select, iframe, [role='button']");
      field.dataset.state = overControl ? "idle" : "on";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => (field.dataset.state = "off");
    const onDown = () => field.setAttribute("data-press", "");
    const onUp = () => field.removeAttribute("data-press");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <div ref={fieldRef} className="cursor-field" data-state="off" aria-hidden="true">
      <div className="cursor-dots" />
      <div ref={boxRef} className="cursor-box" />
    </div>
  );
}
