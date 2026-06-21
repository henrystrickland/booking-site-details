import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Desktop-only momentum smooth-scroll. Gives wheel/trackpad scrolling a soft
 * deceleration — including a gentle settle when you fling to the very top or
 * bottom instead of a hard clamp.
 *
 * Deliberately scoped:
 *  - Touch / coarse-pointer devices keep 100% native scroll (hijacking there
 *    is where smooth-scroll libraries feel laggy).
 *  - Honours prefers-reduced-motion.
 *  - Drives the real window scroll, so framer-motion's useScroll progress bar
 *    and in-page anchor links keep working (anchors handled by Lenis).
 */
export function useSmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches || reduced.matches) return;

    const lenis = new Lenis({
      // Smooth follow strength — low enough to feel responsive, high enough to
      // round off the ends. Native feel everywhere except the easing tail.
      lerp: 0.12,
      smoothWheel: true,
      // Let Lenis ease in-page #anchor navigation too (consistent with above).
      anchors: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}
