import { steps, sections } from "../content/site";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section
      id={sections.how}
      className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:px-10 sm:py-32"
    >
      <Reveal>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent-deep">
          How it works
        </p>
        <h2 className="max-w-2xl font-display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
          Three steps to{" "}
          <span className="font-serif font-light italic">spotless.</span>
        </h2>
      </Reveal>

      <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.id} className="bg-canvas">
            <Reveal delay={i * 0.1}>
              <div className="flex h-full flex-col gap-5 p-8 sm:p-10">
                <span className="font-display text-5xl text-line [-webkit-text-stroke:1px_var(--color-ink)] sm:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
