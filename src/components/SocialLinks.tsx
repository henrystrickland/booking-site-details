import { brand } from "../content/site";

const InstagramIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

const FacebookIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
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
