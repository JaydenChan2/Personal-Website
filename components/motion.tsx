"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Page-level motion, re-armed on every route change:
 *  - .fx copy fades up, .reveal montages "print" downward as they enter view
 *  - montage plates drift at their own depth (data-depth) while scrolling
 *  - hovering a plate writes its caption onto the montage's caption line
 * Everything here is skipped (and undone) for prefers-reduced-motion.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;

    /* ---------- Reveals ---------- */
    const reveal: IntersectionObserverCallback = (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      }
    };
    const io = new IntersectionObserver(reveal, { threshold: 0.18 });
    const ioPlate = new IntersectionObserver(reveal, { threshold: 0, rootMargin: "0px 0px -18% 0px" });
    document.querySelectorAll(".fx:not(.in)").forEach((el) => io.observe(el));
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => ioPlate.observe(el));

    /* ---------- Parallax: read every rect first, then write ---------- */
    const groups = Array.from(document.querySelectorAll<HTMLElement>(".montage"))
      .map((el) => ({ el, plates: Array.from(el.querySelectorAll<HTMLElement>(".ph[data-depth]")) }))
      .filter((g) => g.plates.length > 0);
    let vh = window.innerHeight;
    let ticking = false;
    let idle: ReturnType<typeof setTimeout> | undefined;

    const parallax = () => {
      ticking = false;
      if (reduced) return;
      const rects = groups.map((g) => g.el.getBoundingClientRect());
      groups.forEach((g, i) => {
        const r = rects[i];
        if (r.bottom < -80 || r.top > vh + 80) return;
        const progress = (r.top + r.height / 2 - vh / 2) / vh;
        for (const p of g.plates) {
          const d = parseFloat(p.dataset.depth ?? "0") || 0;
          p.style.setProperty("--py", `${(-progress * d * 220).toFixed(1)}px`);
        }
      });
    };
    const queue = () => {
      if (reduced) return;
      root.classList.add("scrolling");
      clearTimeout(idle);
      idle = setTimeout(() => root.classList.remove("scrolling"), 200);
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(parallax);
      }
    };
    const onResize = () => {
      vh = window.innerHeight;
      queue();
    };
    const onMotionPref = () => {
      reduced = mq.matches;
      if (reduced) {
        clearTimeout(idle);
        root.classList.remove("scrolling");
        groups.forEach((g) => g.plates.forEach((p) => p.style.removeProperty("--py")));
      } else queue();
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onMotionPref);
    parallax();

    /* ---------- Caption line: the label sits beside the print, not on it ---------- */
    const off: (() => void)[] = [];
    for (const g of groups) {
      const line = g.el.querySelector(".montage-cap");
      if (!line) continue;
      for (const p of g.plates) {
        const enter = () => (line.textContent = p.querySelector(".cap")?.textContent ?? "");
        p.addEventListener("mouseenter", enter);
        off.push(() => p.removeEventListener("mouseenter", enter));
      }
      const leave = () => (line.textContent = "");
      g.el.addEventListener("mouseleave", leave);
      off.push(() => g.el.removeEventListener("mouseleave", leave));
    }

    return () => {
      io.disconnect();
      ioPlate.disconnect();
      clearTimeout(idle);
      root.classList.remove("scrolling");
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onMotionPref);
      off.forEach((f) => f());
    };
  }, [pathname]);

  return null;
}
