import { finalCta, primaryBookingSlug, sections } from "../content/site";
import { BookButton } from "./BookButton";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section id={sections.book} className="scroll-mt-20 px-6 pb-24 sm:px-10">
      <div className="grain relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink px-8 py-20 text-center text-canvas sm:px-16 sm:py-28">
        {/* Accent glow, kept subtle. */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <Reveal>
          <h2 className="font-display mx-auto max-w-2xl text-[clamp(2rem,5vw,3.5rem)]">
            {finalCta.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base text-canvas/70">
            {finalCta.subline}
          </p>
          <div className="mt-9 flex justify-center">
            <BookButton slug={primaryBookingSlug} variant="gold">
              {finalCta.button}
            </BookButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
