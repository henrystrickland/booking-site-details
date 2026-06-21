import { steps, sections } from "../content/site";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section
      id={sections.how}
      className="warm-wash scroll-mt-20 px-6 py-20 sm:px-10 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.25em] text-accent-deep">
            How it works
          </p>
          <h2 className="max-w-2xl font-display text-[clamp(2.5rem,5.5vw,3.875rem)] text-ink">
            Three steps to{" "}
            <span className="font-serif font-light italic">spotless.</span>
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-[0_30px_60px_-40px_rgba(11,11,12,0.5)] sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.id} className="bg-canvas">
              <Reveal delay={i * 0.1}>
                <div className="flex h-full flex-col gap-4 p-7 sm:p-9">
                  <span className="font-display text-5xl text-line [-webkit-text-stroke:1px_var(--color-ink)] sm:text-6xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
