import { addOns, addOnsNote, sections, type AddOn } from "../content/site";
import { Reveal } from "./Reveal";

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
    <div className="group flex h-full items-start gap-5 bg-canvas p-7 transition-colors duration-300 hover:bg-paper sm:p-9">
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
          <h3 className="font-display text-lg tracking-tight text-ink">
            {addOn.name}
          </h3>
          <span className="font-display shrink-0 text-lg text-accent-deep">
            +${addOn.price}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {addOn.description}
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
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent-deep">
              Add-Ons
            </p>
            <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
              Take it <span className="font-serif font-light italic">further.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink-soft">
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
      </div>
    </section>
  );
}
