import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Floating "Back to top" pill. Fades in once you've scrolled roughly a screen
 * down and links to #top — so the actual scroll is driven by the same engine as
 * the rest of the site (Lenis momentum on desktop, native smooth scroll on
 * touch, instant for reduced-motion). That keeps the ride up perfectly smooth
 * and every section's reveal animation intact.
 */
export function BackToTop() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setShow(window.scrollY > window.innerHeight * 0.9)
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          className="group fixed bottom-6 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-canvas/15 bg-ink/90 px-4 py-2.5 text-[13px] font-semibold tracking-tight text-canvas shadow-[0_14px_34px_-12px_rgba(11,11,12,0.7)] backdrop-blur transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink sm:bottom-8 sm:right-8 sm:px-5 sm:py-3 sm:text-sm"
          initial={reduce ? false : { opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
          Back to top
        </motion.a>
      )}
    </AnimatePresence>
  );
}
