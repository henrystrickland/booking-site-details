import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Cal from "@calcom/embed-react";
import { cal } from "../content/site";

interface BookingContextValue {
  /** Open the booking pop-up for a given Cal.com event slug. */
  open: (slug: string) => void;
}

const BookingContext = createContext<BookingContextValue>({ open: () => {} });

/** Any component can call `useBooking().open(slug)` to launch the pop-up. */
export function useBooking() {
  return useContext(BookingContext);
}

/**
 * Wraps the app and renders the booking pop-up. Instead of Cal.com's own
 * full-screen modal, the Cal calendar is embedded *inline* inside a contained
 * card that floats over a translucent backdrop — so the site stays visible
 * (dimmed) behind it, like a true pop-up.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [slug, setSlug] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = useCallback((s: string) => setSlug(s), []);
  const close = useCallback(() => setSlug(null), []);

  // While open: lock background scroll, close on Escape, focus the close button.
  useEffect(() => {
    if (!slug) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [slug, close]);

  return (
    <BookingContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {slug && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop — the site stays visible behind it, just dimmed. */}
            <div
              className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />

            {/* The pop-up card. */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Book a detail"
              className="relative z-10 flex h-[88vh] max-h-[90vh] w-full max-w-[940px] flex-col overflow-hidden rounded-2xl bg-ink shadow-[0_50px_140px_-20px_rgba(0,0,0,0.75)] ring-1 ring-white/10 sm:h-[600px]"
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                ref={closeRef}
                onClick={close}
                aria-label="Close booking"
                className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-canvas backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              <Cal
                namespace="booking"
                calLink={`${cal.username}/${slug}`}
                style={{ width: "100%", height: "100%", overflow: "auto" }}
                config={{ layout: "month_view", theme: "dark" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}
