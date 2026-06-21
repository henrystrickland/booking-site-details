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
import { bookingOptions, cal } from "../content/site";

interface BookingContextValue {
  /** Open the booking pop-up straight onto a given Cal.com event slug. */
  open: (slug: string) => void;
  /** Open the pop-up on the service chooser (Interior / Exterior / Full). */
  openChooser: () => void;
}

const BookingContext = createContext<BookingContextValue>({
  open: () => {},
  openChooser: () => {},
});

/** Any component can call `useBooking().open(slug)` / `.openChooser()`. */
export function useBooking() {
  return useContext(BookingContext);
}

/** What the pop-up is currently showing. */
type View =
  | { kind: "choose" }
  | { kind: "event"; slug: string; fromChooser: boolean };

/**
 * Wraps the app and renders the booking pop-up. Instead of Cal.com's own
 * full-screen modal, the Cal calendar is embedded *inline* inside a contained
 * card that floats over a translucent backdrop — so the site stays visible
 * (dimmed) behind it, like a true pop-up.
 */
export function BookingProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [view, setView] = useState<View | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(
    (s: string) => setView({ kind: "event", slug: s, fromChooser: false }),
    [],
  );
  const openChooser = useCallback(() => setView({ kind: "choose" }), []);
  const close = useCallback(() => setView(null), []);

  // While open: lock background scroll, close on Escape, focus the close button.
  useEffect(() => {
    if (!view) return;
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
  }, [view, close]);

  return (
    <BookingContext.Provider value={{ open, openChooser }}>
      {children}
      <AnimatePresence>
        {view && (
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

            {/* The pop-up card. The chooser is a compact card; the calendar
                view is the larger booking surface. */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={view.kind === "choose" ? "Choose a detail" : "Book a detail"}
              className={`relative z-10 flex w-full flex-col overflow-hidden rounded-2xl bg-ink shadow-[0_50px_140px_-20px_rgba(0,0,0,0.75)] ring-1 ring-white/10 ${
                view.kind === "choose"
                  ? "max-w-[460px]"
                  : "h-[88vh] max-h-[90vh] max-w-[940px] sm:h-[600px]"
              }`}
              initial={reduce ? false : { opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Back to the chooser — only when the calendar was reached
                  through it. */}
              {view.kind === "event" && view.fromChooser && (
                <button
                  onClick={openChooser}
                  aria-label="Back to services"
                  className="absolute left-3 top-3 z-20 flex h-9 items-center gap-1.5 rounded-full bg-white/10 px-3 text-[13px] font-semibold text-canvas backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m13 6-6 6 6 6" />
                  </svg>
                  Back
                </button>
              )}

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

              {view.kind === "choose" ? (
                <div className="px-6 pb-7 pt-14 sm:px-8">
                  <h2 className="font-display text-2xl tracking-tight text-canvas">
                    Which detail?
                  </h2>
                  <p className="mt-1.5 text-[14px] leading-snug text-canvas/55">
                    Pick a service and we'll pull up the calendar.
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    {bookingOptions.map((opt) => (
                      <button
                        key={opt.slug}
                        onClick={() =>
                          setView({ kind: "event", slug: opt.slug, fromChooser: true })
                        }
                        className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition-colors hover:border-accent/60 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold tracking-tight text-canvas">
                              {opt.label}
                            </span>
                            {opt.tag && (
                              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                                {opt.tag}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[13px] leading-snug text-canvas/55">
                            {opt.blurb}
                          </p>
                          <span className="mt-1.5 inline-block text-[12px] font-medium text-canvas/40">
                            {opt.duration}
                          </span>
                        </div>
                        <svg
                          className="shrink-0 text-canvas/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <Cal
                  namespace="booking"
                  calLink={`${cal.username}/${view.slug}`}
                  style={{ width: "100%", height: "100%", overflow: "auto" }}
                  config={{ layout: "month_view", theme: "dark" }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}
