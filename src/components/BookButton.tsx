import { motion } from "framer-motion";
import { bookingHref, cal } from "../content/site";

type Variant = "ink" | "gold" | "ghost";
type Size = "default" | "slim";

interface BookButtonProps {
  slug: string;
  children: React.ReactNode;
  /** Colour treatment. Pick one — don't override colours via className
   *  (conflicting Tailwind utilities resolve unpredictably). */
  variant?: Variant;
  /** Pill height/padding. Set this rather than passing px-/py- in className —
   *  base padding utilities win unpredictably over className overrides. */
  size?: Size;
  /** Layout-only extras: width, margins. No padding or colour utilities here. */
  className?: string;
}

const VARIANTS: Record<Variant, string> = {
  // Dark pill for light backgrounds.
  ink: "bg-ink text-canvas hover:bg-accent hover:text-ink",
  // Bronze pill for dark backgrounds / primary emphasis.
  gold: "bg-accent text-ink hover:bg-canvas hover:text-ink",
  // Outlined, low-emphasis.
  ghost: "border border-line bg-paper/60 text-ink hover:border-ink",
};

const SIZES: Record<Size, string> = {
  default: "px-7 py-3.5 text-[15px]",
  slim: "px-6 py-2 text-[15px]",
};

/**
 * The one place a Cal.com link is rendered. Builds its href from site.ts, so
 * flipping `cal.enabled` re-points every button at once. Opens in a new tab
 * only once live (the #book placeholder stays in-page).
 */
export function BookButton({
  slug,
  children,
  variant = "ink",
  size = "default",
  className = "",
}: BookButtonProps) {
  const href = bookingHref(slug);
  const external = cal.enabled;

  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`${base} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {children}
      <svg
        className="transition-transform duration-200 group-hover:translate-x-0.5"
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
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </motion.a>
  );
}
