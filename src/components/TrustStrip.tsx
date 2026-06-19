import { trustPoints } from "../content/site";
import { Reveal } from "./Reveal";

const icons: Record<string, React.ReactNode> = {
  mobile: (
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7v6 M12 10h0" />
  ),
  professional: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />,
  rated: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  ),
};

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {trustPoints.map((point, i) => (
          <Reveal key={point.id} delay={i * 0.08}>
            <div className="flex items-center gap-4 px-6 py-7 sm:justify-center sm:px-8">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {icons[point.id]}
                </svg>
              </span>
              <span>
                <span className="block text-[15px] font-semibold tracking-tight text-ink">
                  {point.title}
                </span>
                <span className="block text-sm text-ink-faint">{point.note}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
