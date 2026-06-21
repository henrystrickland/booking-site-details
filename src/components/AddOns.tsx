import {
  addOns,
  addOnsNote,
  discounts,
  discountsNote,
  sections,
  type AddOn,
  type Discount,
} from "../content/site";
import { Reveal } from "./Reveal";

const DISCOUNT_ICONS: Record<Discount["icon"], React.ReactNode> = {
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />,
  repeat: (
    <>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </>
  ),
  cars: (
    <>
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h5.2a2 2 0 0 1 1.9 1.5L17 11" />
      <path d="M4 11h14a2 2 0 0 1 2 2v3h-3M4 16H2v-3a2 2 0 0 1 2-2" />
      <circle cx="7.5" cy="16.5" r="1.5" />
      <circle cx="15.5" cy="16.5" r="1.5" />
    </>
  ),
};

const ICONS: Record<AddOn["icon"], React.ReactNode> = {
  pet: (
    <>
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10c-2 0-4 1.5-4 4 0 3 2.5 4 4 4s2-1 4-1 2 1 4 1" />
    </>
  ),
  engine: (
    <>
      <path d="M5 13V9h3l2-2h4v3h3l2 2v4h-2v2H8v-2H5z" />
      <path d="M14 7V5h-3" />
    </>
  ),
  sealant: (
    <>
      <path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11z" />
      <path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" />
    </>
  ),
  travel: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
};

function AddOnCard({ addOn }: { addOn: AddOn }) {
  return (
    <div className="group flex h-full items-start gap-5 bg-canvas p-7 transition-[background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-paper sm:p-9">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 transition-colors duration-300 group-hover:bg-accent/15">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-accent-deep)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {ICONS[addOn.icon]}
        </svg>
      </span>

      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl tracking-tight text-ink">
            {addOn.name}
          </h3>
          <span className="font-display shrink-0 text-xl text-accent-deep">
            +${addOn.price}
          </span>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          {addOn.description}
        </p>
      </div>
    </div>
  );
}

function DiscountCard({ discount }: { discount: Discount }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-ink p-7 text-canvas shadow-[0_24px_50px_-30px_rgba(11,11,12,0.7)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_36px_70px_-30px_rgba(11,11,12,0.8)] sm:p-8">
      {/* Warm corner glow for depth. */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent/25 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />

      {/* Icon */}
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canvas/10 ring-1 ring-canvas/15">
        <svg
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {DISCOUNT_ICONS[discount.icon]}
        </svg>
      </span>

      {/* The savings — the focal point. The minus + dollar sit inline at the
          full numeral size so they read as one tight "−$10", not a low prefix. */}
      <div className="relative mt-6 flex items-baseline">
        <span className="font-display text-[3.25rem] leading-none tracking-tight text-accent sm:text-[4rem]">
          −${discount.amount}
        </span>
        <span className="ml-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/70">
          off
        </span>
      </div>

      {/* Name + description. */}
      <div className="relative mt-6">
        <h3 className="font-display text-lg tracking-tight text-canvas">
          {discount.name}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-canvas/65">
          {discount.description}
        </p>
      </div>
    </div>
  );
}

export function AddOns() {
  return (
    <section
      id={sections.addons}
      className="scroll-mt-20 border-t border-line bg-paper px-6 py-24 sm:px-10 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.25em] text-accent-deep">
              Add-Ons
            </p>
            <h2 className="font-display text-[clamp(2.5rem,5.5vw,3.875rem)] text-ink">
              Take it <span className="font-serif font-light italic">further.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {addOnsNote}
            </p>
          </div>
        </Reveal>

        {/* Hairline grid — clean and editorial, no card-wall. */}
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {addOns.map((addOn) => (
              <AddOnCard key={addOn.id} addOn={addOn} />
            ))}
          </div>
        </Reveal>

        {/* Discounts — savings that stack onto any detail. */}
        <Reveal>
          <div className="mb-10 mt-20 max-w-2xl">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.25em] text-accent-deep">
              Discounts
            </p>
            <h3 className="font-display text-[clamp(2.5rem,5.5vw,3.875rem)] text-ink">
              Ways to <span className="font-serif font-light italic">save.</span>
            </h3>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              {discountsNote}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {discounts.map((discount) => (
              <DiscountCard key={discount.id} discount={discount} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
