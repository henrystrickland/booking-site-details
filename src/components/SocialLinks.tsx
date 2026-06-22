import { brand } from "../content/site";

// Matched solid glyphs — identical to the hero's set so the brand reads the
// same everywhere. Instagram is a solid camera (lens + flash punched out via
// even-odd fill); Facebook is the bold "f" letterform only.
const InstagramIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M8 2 H16 A6 6 0 0 1 22 8 V16 A6 6 0 0 1 16 22 H8 A6 6 0 0 1 2 16 V8 A6 6 0 0 1 8 2 Z M12 7.4 a4.6 4.6 0 1 0 0 9.2 a4.6 4.6 0 1 0 0 -9.2 Z M17 5.7 a1.15 1.15 0 1 0 0 2.3 a1.15 1.15 0 1 0 0 -2.3 Z" />
  </svg>
);

const FacebookIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <g transform="translate(6.4 3) scale(0.0352)">
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </g>
  </svg>
);

type Tone = "light" | "dark";

interface SocialLinksProps {
  /** "light" for dark backgrounds, "dark" for light backgrounds. */
  tone?: Tone;
  /** Show text labels next to the icon (pills) vs. icon-only circles. */
  labels?: boolean;
  className?: string;
}

/**
 * Prominent Instagram + Facebook buttons. Bigger and more visible than a
 * plain footer link list — used both mid-page and in the footer.
 */
export function SocialLinks({ tone = "dark", labels = true, className = "" }: SocialLinksProps) {
  const pill =
    tone === "light"
      ? "border-canvas/25 text-canvas hover:border-accent hover:bg-accent hover:text-ink"
      : "border-ink/15 text-ink hover:border-accent hover:bg-accent hover:text-ink";

  const items = [
    { label: "Instagram", href: brand.instagram, icon: InstagramIcon },
    { label: "Facebook", href: brand.facebook, icon: FacebookIcon },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={`group inline-flex items-center justify-center gap-2.5 rounded-full border transition-colors duration-200 ${pill} ${
            labels ? "px-6 py-3" : "h-12 w-12"
          }`}
        >
          {item.icon}
          {labels && (
            <span className="text-[15px] font-semibold tracking-tight">{item.label}</span>
          )}
        </a>
      ))}
    </div>
  );
}
