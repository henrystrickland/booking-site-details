/* ============================================================================
   C&H Elite Auto Detailing — SITE CONTENT
   ----------------------------------------------------------------------------
   This is the ONLY file you need to edit for copy, prices, and booking links.
   Components read everything from here. To reskin or update the site later,
   edit this file — not the components.

   QUICK EDITS YOU'LL ACTUALLY MAKE:
     • Real prices  → see `services[].priceRange` below (all marked PLACEHOLDER)
     • Go live with Cal.com → set `cal.enabled` to true (one line)
   ========================================================================== */

/* ── Cal.com booking config ─────────────────────────────────────────────────
   While `enabled` is false, every Book button stays visible but points to a
   harmless in-page anchor (#book) so nothing breaks. Flip `enabled` to true
   and every button instantly routes to the real Cal.com event — no other
   code changes needed.

   ►► TO GO LIVE: change `enabled: false` to `enabled: true` on the line below.

   The three real Cal.com events (cal.com/chautodetails/{slug}):
     • interior            — Interior detail (90 min)
     • exterior            — Exterior detail (60 min)
     • interior-exterior   — Interior + Exterior, full detail (180 min)
   These are not vehicle-specific; a sedan and an SUV book the same event and
   the exact price is quoted in person. */
export const cal = {
  /** Your Cal.com username. Final URL = https://cal.com/{username}/{slug} */
  username: "chautodetails",
  /** Set to TRUE to send every button to the live Cal.com booking pages. */
  enabled: true,
} as const;

/** Builds the destination for a Book button from a Cal.com event slug. */
export function bookingHref(slug: string): string {
  return cal.enabled ? `https://cal.com/${cal.username}/${slug}` : "#book";
}

/** The hero / nav / footer "Book a Detail" CTAs point at this event slug.
 *  Defaults to the most complete package; change to "interior" or "exterior"
 *  if you'd rather the generic buttons open a different event. */
export const primaryBookingSlug = "interior-exterior";

/* ── Brand ──────────────────────────────────────────────────────────────── */
export const brand = {
  name: "C&H Elite Auto Detailing",
  shortName: "C&H Elite",
  serviceArea: "Northern Virginia",
  /** Small logo used in the navbar and footer. */
  logoSrc: "/img/logo-mark.png",
  phone: "(703) 376-7536",
  phoneHref: "tel:7033767536",
  email: "chautodetails@gmail.com",
  instagram: "https://instagram.com/ch.autodetails",
  facebook:
    "https://www.facebook.com/people/CH-Elite-Auto-Detailing/61572140056742/",
} as const;

/* ── Navigation ─────────────────────────────────────────────────────────── */
export const nav = [
  { label: "Services", href: "#services" },
  { label: "Add-Ons", href: "#addons" },
  { label: "How It Works", href: "#how" },
] as const;

/* ── Hero ───────────────────────────────────────────────────────────────────
   The hero is logo-led: the brand logo sits large over the (eventual) video.
   Place real files at these paths; placeholders render until you do. */
export const hero = {
  videoSrc: "/video/hero.mp4",
  // Instant first paint behind the video while it buffers — prevents the black
  // flash. Replace with a still exported from the video's first frame for a
  // seamless fade (save it at /img/hero-poster.jpg and point this back to it).
  posterSrc: "/img/cta-foam.jpg",
  logoSrc: "/img/logo-mark.png",
  // The two hero buttons. "Get Your Free Quote" calls the business; "Book a
  // Detail" routes to the Cal.com booking (the primaryBookingSlug above).
  quoteCta: "Get Your Free Quote",
  bookCta: "Book a Detail",
} as const;

/* ── Trust strip ────────────────────────────────────────────────────────── */
export const trustPoints = [
  { id: "mobile", title: "We come to you", note: "Home, garage, office, anywhere" },
  { id: "professional", title: "Professional", note: "Meticulous every time" },
  { id: "rated", title: "5-star rated", note: "Across Northern VA" },
] as const;

/* ── Services ───────────────────────────────────────────────────────────────
   Services are grouped by vehicle type. Prices are ESTIMATED ranges only —
   the exact price is quoted in person. `slug` must match your Cal.com event
   slug exactly. The "Full In & Out" ranges are PLACEHOLDERS (you didn't set
   them yet) — replace them; the interior/exterior ranges are your real numbers. */
export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  /** Estimated range shown on the site, e.g. "$75–$125". */
  priceRange: string;
  /** Cal.com event slug → https://cal.com/{username}/{slug} */
  slug: string;
  /** Optional emphasis tag, e.g. the most complete package. */
  tag?: string;
}

export interface VehicleCategory {
  id: string;
  label: string;
  blurb: string;
  /** Photo placeholder — drop a real image at this path. */
  image: string;
  imageAlt: string;
  services: ServiceItem[];
}

export const serviceCategories: VehicleCategory[] = [
  {
    id: "sedan",
    label: "Sedans",
    blurb: "Coupes, sedans, and smaller cars.",
    image: "/img/service-sedan.jpg",
    imageAlt: "Freshly detailed sedan",
    services: [
      {
        id: "sedan-interior",
        name: "Interior Detail",
        description:
          "Seats, carpets, vents, and every surface deep-cleaned inside.",
        priceRange: "$75–$125",
        slug: "interior",
      },
      {
        id: "sedan-exterior",
        name: "Exterior Detail",
        description: "Hand wash, wheels, and tires for a sharp, clean finish.",
        priceRange: "$50–$70",
        slug: "exterior",
      },
      {
        id: "sedan-full",
        name: "Full In & Out Clean",
        description: "The complete package — interior and exterior, top to bottom.",
        priceRange: "$125–$195",
        slug: "interior-exterior",
        tag: "Most complete",
      },
    ],
  },
  {
    id: "suv-truck",
    label: "SUVs & Trucks",
    blurb: "SUVs, trucks, vans, and larger vehicles.",
    image: "/img/service-suv.jpg",
    imageAlt: "Freshly detailed SUV",
    services: [
      {
        id: "suv-interior",
        name: "Interior Detail",
        description:
          "Seats, carpets, vents, and every surface deep-cleaned inside.",
        priceRange: "$85–$135",
        slug: "interior",
      },
      {
        id: "suv-exterior",
        name: "Exterior Detail",
        description: "Hand wash, wheels, and tires for a sharp, clean finish.",
        priceRange: "$55–$75",
        slug: "exterior",
      },
      {
        id: "suv-full",
        name: "Full In & Out Clean",
        description: "The complete package — interior and exterior, top to bottom.",
        priceRange: "$140–$210",
        slug: "interior-exterior",
        tag: "Most complete",
      },
    ],
  },
];

/** Shown near pricing so customers know the numbers are estimates. */
export const priceDisclaimer =
  "Every price is an estimate — your exact quote depends on your vehicle's size and condition. Get a free exact quote before you book.";

/* ── Add-ons ────────────────────────────────────────────────────────────────
   Optional extras that can be added to any detail. Prices are exact add-on
   amounts (shown as "+$XX"). `icon` maps to an SVG in AddOns.tsx. */
export interface AddOn {
  id: string;
  name: string;
  description: string;
  /** Price shown as "+${price}". */
  price: number;
  icon: "pet" | "engine" | "sealant" | "travel";
}

export const addOns: AddOn[] = [
  {
    id: "pet-hair",
    name: "Pet Hair Removal",
    description: "Thorough removal of embedded pet hair from seats and carpets.",
    price: 20,
    icon: "pet",
  },
  {
    id: "engine-bay",
    name: "Engine Bay Clean",
    description: "Degrease and dress the engine bay for a clean, finished look.",
    price: 30,
    icon: "engine",
  },
  {
    id: "hydrophobic-sealant",
    name: "Hydrophobic Sealant",
    description: "A protective coating that repels water and boosts the shine.",
    price: 30,
    icon: "sealant",
  },
  {
    id: "travel-fee",
    name: "Travel Fee",
    description: "Applied to jobs more than 30 minutes away.",
    price: 20,
    icon: "travel",
  },
];

/** Caption under the add-ons heading. */
export const addOnsNote =
  "Add any of these to your detail when you book — just let us know.";

/* ── Discounts ──────────────────────────────────────────────────────────────
   Savings stacked under the add-ons. Amounts are dollars off the final price. */
export interface Discount {
  id: string;
  name: string;
  description: string;
  /** Dollars off, shown as "−$XX". */
  amount: number;
  icon: "shield" | "repeat" | "cars";
}

export const discounts: Discount[] = [
  {
    id: "military",
    name: "Military Discount",
    description: "Thank you for your service — active duty and veterans save.",
    amount: 10,
    icon: "shield",
  },
  {
    id: "returning",
    name: "Returning Customer",
    description: "Come back for another detail and we take care of you.",
    amount: 15,
    icon: "repeat",
  },
  {
    id: "multi-car",
    name: "2 or More Cars",
    description: "Booking the whole driveway? Save on every additional vehicle.",
    amount: 10,
    icon: "cars",
  },
];

/** Caption under the discounts heading. */
export const discountsNote =
  "Mention any that apply when you book — discounts come off your final quote.";

/* ── How it works ───────────────────────────────────────────────────────── */
export const steps = [
  {
    id: "book",
    title: "Book online",
    description: "Pick your service and a time that works. Takes two minutes.",
  },
  {
    id: "come",
    title: "We come to you",
    description: "Our team arrives fully equipped — at your home or office.",
  },
  {
    id: "drive",
    title: "Drive away spotless",
    description: "Hop in, settle up, and enjoy that just-detailed feeling.",
  },
] as const;

/* ── Final CTA band ─────────────────────────────────────────────────────── */
export const finalCta = {
  heading: "Ready for the best your car has looked?",
  subline: "Book your detail today — we'll handle the rest.",
  button: "Book Your Detail",
} as const;

/* ── Section labels / nav anchors ───────────────────────────────────────── */
export const sections = {
  services: "services",
  addons: "addons",
  how: "how",
  book: "book",
} as const;
