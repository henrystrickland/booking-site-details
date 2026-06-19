import { useState } from "react";
import {
  brand,
  priceDisclaimer,
  sections,
  serviceCategories,
  type ServiceItem,
  type VehicleCategory,
} from "../content/site";
import { BookButton } from "./BookButton";
import { Reveal } from "./Reveal";

function CategoryPhoto({ category }: { category: VehicleCategory }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/[0.04]">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#ededea,#f6f5f2)]">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-ink-faint)"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-xs uppercase tracking-[0.2em] text-ink-faint">
            {category.label}
          </span>
        </div>
      )}
      <img
        src={category.image}
        alt={category.imageAlt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

function ServiceRow({ service }: { service: ServiceItem }) {
  return (
    <li className="flex items-start justify-between gap-5 py-5">
      <div className="max-w-sm">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h4 className="font-display text-lg tracking-tight text-ink">
            {service.name}
          </h4>
          {service.tag && (
            <span className="rounded-full bg-accent/12 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent-deep">
              {service.tag}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
          {service.description}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2.5">
        <span className="font-display text-base text-ink sm:text-lg">
          {service.priceRange}
          <span className="ml-1 align-middle text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            est
          </span>
        </span>
        <BookButton slug={service.slug} variant="ghost" className="px-5 py-2 text-sm">
          Book
        </BookButton>
      </div>
    </li>
  );
}

export function Services() {
  return (
    <section
      id={sections.services}
      className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24 sm:px-10 sm:py-32"
    >
      {/* Section header */}
      <Reveal>
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent-deep">
            Services & pricing
          </p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
            Priced by your <span className="font-serif font-light italic">vehicle.</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink-soft">
            {priceDisclaimer}
          </p>
          <a
            href={brand.phoneHref}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-accent-deep transition-colors hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3-8.63A2 2 0 0 1 3 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z" />
            </svg>
            Get an exact quote — call {brand.phone}
          </a>
        </div>
      </Reveal>

      {/* Vehicle categories, alternating photo side */}
      <div className="flex flex-col gap-16 sm:gap-24">
        {serviceCategories.map((category, i) => (
          <Reveal key={category.id}>
            <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <CategoryPhoto category={category} />
              </div>

              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <h3 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] text-ink">
                  {category.label}
                </h3>
                <p className="mt-2 text-sm text-ink-faint">{category.blurb}</p>
                <ul className="mt-6 divide-y divide-line border-t border-line">
                  {category.services.map((service) => (
                    <ServiceRow key={service.id} service={service} />
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
