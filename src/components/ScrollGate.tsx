import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Footer arrival accent. The first time the footer scrolls into view it flashes
 * a small white bar so the bottom of the page lands with a subtle beat. The
 * scroll is never blocked — the page stays fully responsive. Reduced-motion
 * users get no flash.
 */
export function ScrollGate() {
  const reduce = useReducedMotion();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit || firedRef.current) return;
        firedRef.current = true;

        // Flash the bar for ~1s. The scroll is intentionally never locked —
        // hijacking the scroll was the main source of perceived lag.
        setFlash(true);
        window.setTimeout(() => setFlash(false), 1000);
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
      <AnimatePresence>
        {flash && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed bottom-7 left-1/2 z-[60] h-1.5 w-16 -translate-x-1/2 rounded-full bg-white shadow-[0_0_24px_4px_rgba(255,255,255,0.65)]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0, scaleX: 0.4 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
