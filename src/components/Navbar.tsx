import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { hero, nav, primaryBookingSlug } from "../content/site";
import { BookButton } from "./BookButton";

export function Navbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Smooth scroll-progress for the hairline indicator. The spring keeps the
  // fill gliding rather than snapping frame-to-frame; transforms only scaleX
  // (GPU), so it adds no scroll cost.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkColor = scrolled ? "text-ink-soft hover:text-ink" : "text-canvas/80 hover:text-canvas";

  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled ? "glass-nav" : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="relative mx-auto flex max-w-6xl items-center justify-center px-6 py-3.5 sm:px-10">
        {/* Desktop links + CTA, centered as one cluster */}
        <div className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-[17px] font-semibold tracking-tight transition-colors duration-200 ${linkColor}`}
            >
              {item.label}
            </a>
          ))}
          <BookButton
            slug={primaryBookingSlug}
            variant={scrolled ? "ink" : "gold"}
            size="slim"
          >
            Book
          </BookButton>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={`absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center sm:right-8 md:hidden ${
            scrolled ? "text-ink" : "text-canvas"
          }`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>

      {/* Scroll-progress hairline — only once the bar is solid, so it never
          floats over the transparent hero. */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className={`absolute bottom-0 left-0 h-[3px] w-full origin-left bg-accent transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{ scaleX: progress }}
        />
      )}

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink text-canvas md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between px-6 py-3">
              {/* Original (black) mark on a white rounded chip — keeps its true
                  colours and stays legible on the dark menu overlay. */}
              <span className="inline-flex rounded-xl bg-white p-2.5">
                <img
                  src="/img/logo-mark.png"
                  alt="C&H Elite Auto Detailing"
                  width={1000}
                  height={648}
                  className="h-9 w-auto"
                />
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-canvas"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-2 px-6 pt-10">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display border-b border-canvas/10 py-5 text-4xl tracking-tight text-canvas"
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.div
                className="mt-8"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32 }}
              >
                <BookButton
                  slug={primaryBookingSlug}
                  variant="gold"
                  className="w-full"
                >
                  {hero.bookCta}
                </BookButton>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
