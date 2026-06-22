import { useEffect, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { nav, primaryBookingSlug } from "../content/site";
import { BookButton } from "./BookButton";

export function Navbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  // The section currently in view — its nav word is highlighted. Empty while
  // the hero is on screen (no section yet).
  const [active, setActive] = useState("");

  const { scrollY, scrollYProgress } = useScroll();

  // The frosted bar doesn't pop in at a threshold — its opacity is mapped
  // continuously to the first ~80px of scroll, so it (and its hairline) ease in
  // as you leave the hero rather than flashing on with the letters.
  const glass = useTransform(scrollY, [4, 84], [0, 1]);

  // Smooth scroll-progress for the hairline indicator. The spring keeps the
  // fill gliding rather than snapping frame-to-frame; transforms only scaleX
  // (GPU), so it adds no scroll cost.
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  // The link/CTA colour flips once the glass is roughly half-in, cross-fading
  // over 300ms so it reads as part of the same settle, not a separate snap.
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 44;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  // Scroll-spy: highlight the nav word for whichever section is crossing the
  // middle of the viewport. The thin rootMargin band makes exactly one section
  // "current" at a time, so the highlight shifts cleanly from word to word as
  // you scroll — on mobile and desktop alike.
  useEffect(() => {
    const ids = nav.map((item) => item.href.replace("#", ""));
    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        const current = ids.find((id) => inBand.has(id));
        if (current) setActive(current);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const linkColor = scrolled ? "text-ink-soft hover:text-ink" : "text-canvas/80 hover:text-canvas";

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Frosted-glass layer — its opacity rides the scroll position, so the
          bar eases in gradually instead of snapping on. Sits behind the links. */}
      <motion.div
        aria-hidden="true"
        className="glass-nav absolute inset-0"
        style={{ opacity: reduce ? (scrolled ? 1 : 0) : glass }}
      />

      <nav className="relative mx-auto flex min-h-[58px] max-w-6xl items-center justify-center px-4 py-3 sm:min-h-0 sm:px-10 sm:py-3.5">
        <div className="flex items-center gap-5 sm:gap-9">
          {nav.map((item) => {
            const isActive = active === item.href.replace("#", "");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative text-[15px] font-semibold tracking-tight transition-colors duration-300 sm:text-[17px] ${
                  isActive ? "text-accent" : linkColor
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-accent"
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 420, damping: 34 }
                    }
                  />
                )}
              </a>
            );
          })}
          {/* Book stays a desktop-only CTA so the three section links fit
              comfortably across small phones. */}
          <span className="hidden md:inline-flex">
            <BookButton
              slug={primaryBookingSlug}
              variant={scrolled ? "ink" : "gold"}
              size="slim"
              chooser
            >
              Book
            </BookButton>
          </span>
        </div>
      </nav>

      {/* Scroll-progress hairline — its opacity rides the same glass fade so it
          eases in with the bar instead of floating over the transparent hero. */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-accent"
          style={{ scaleX: progress, opacity: glass }}
        />
      )}
    </motion.header>
  );
}
