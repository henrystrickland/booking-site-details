import { brand, primaryBookingSlug } from "../content/site";
import { BookButton } from "./BookButton";
import { Reveal } from "./Reveal";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative overflow-hidden bg-ink px-6 py-12 text-canvas sm:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="grid gap-8 sm:grid-cols-[1.5fr_1fr_1.3fr_auto] sm:items-start sm:gap-10">
            {/* Brand */}
            <div>
              <img
                src="/img/logo.png"
                alt={brand.name}
                className="h-12 w-auto brightness-0 invert"
              />
              <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-canvas/60">
                Premium mobile detailing across {brand.serviceArea}. We come to you.
              </p>
            </div>

            {/* Contact */}
            <div>
              <p className="mb-3 font-serif text-xs uppercase tracking-[0.25em] text-accent">
                Contact
              </p>
              <ul className="space-y-2 text-[15px] text-canvas/65">
                <li>
                  <a className="transition-colors hover:text-accent" href={brand.phoneHref}>
                    {brand.phone}
                  </a>
                </li>
                <li>
                  <a className="transition-colors hover:text-accent" href={`mailto:${brand.email}`}>
                    {brand.email}
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow */}
            <div>
              <p className="mb-3 font-serif text-xs uppercase tracking-[0.25em] text-accent">
                Follow
              </p>
              <SocialLinks tone="light" />
            </div>

            {/* CTA */}
            <div className="sm:pt-1">
              <BookButton slug={primaryBookingSlug} variant="gold">
                Book a Detail
              </BookButton>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 border-t border-canvas/10 pt-5 text-xs tracking-wide text-canvas/40">
          © {year} {brand.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
