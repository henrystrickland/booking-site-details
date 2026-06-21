import { finalCta, primaryBookingSlug, sections } from "../content/site";
import { BookButton } from "./BookButton";
import { Reveal } from "./Reveal";
import { SocialLinks } from "./SocialLinks";

export function FinalCTA() {
  return (
    <section id={sections.book} className="scroll-mt-20 px-6 pb-20 pt-0 sm:px-10">
      <div className="grain relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center text-canvas sm:px-16 sm:py-20">
        {/* Foam-wash photo background. */}
        <img
          src="/img/cta-foam.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Dark wash for text legibility. */}
        <div className="pointer-events-none absolute inset-0 bg-ink/70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/35" />

        {/* Accent glow, kept subtle. */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <Reveal className="relative">
          <h2 className="font-display mx-auto max-w-2xl text-[clamp(2rem,5vw,3.5rem)]">
            {finalCta.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-canvas/70">
            {finalCta.subline}
          </p>
          <div className="mt-9 flex justify-center">
            <BookButton slug={primaryBookingSlug} variant="gold" chooser>
              {finalCta.button}
            </BookButton>
          </div>

          {/* Social — prominent, not buried in the footer. */}
          <div className="mt-10 flex flex-col items-center gap-4 border-t border-canvas/10 pt-8">
            <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-canvas/50">
              Follow our work
            </span>
            <SocialLinks tone="light" className="justify-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
