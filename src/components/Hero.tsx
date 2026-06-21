import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { brand, hero, primaryBookingSlug } from "../content/site";
import { BookButton } from "./BookButton";

export function Hero() {
  const reduce = useReducedMotion();
  const [mountVideo, setMountVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy-load the (assumed heavy) video AFTER first paint, and never when the
  // user prefers reduced motion — the poster is always the instant fallback.
  useEffect(() => {
    if (reduce) return;
    const idle =
      window.requestIdleCallback?.(() => setMountVideo(true)) ??
      window.setTimeout(() => setMountVideo(true), 200);
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle as number);
      } else {
        clearTimeout(idle as number);
      }
    };
  }, [reduce]);

  useEffect(() => {
    if (mountVideo) videoRef.current?.play().catch(() => {});
  }, [mountVideo]);

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-canvas"
    >
      {/* Poster / placeholder base — instant first paint, no asset required. */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundColor: "#0b0b0c",
          backgroundImage: `linear-gradient(135deg, #1a1a1d 0%, #0b0b0c 55%, #141416 100%), url(${hero.posterSrc})`,
          backgroundBlendMode: "overlay",
        }}
      />

      {/* Lazy video layer. */}
      {mountVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-0 transition-opacity duration-700"
          poster={hero.posterSrc}
          muted
          loop
          autoPlay
          playsInline
          preload="none"
          onCanPlay={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <source src={hero.videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Readability gradient between media and content. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/80" />

      {/* A very slight, clean warm glow behind the logo — minimal, just enough
          to lift it off the dark background. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[44%] -z-10 h-[58vmin] w-[92vmin] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(231,201,156,0.18) 0%, rgba(168,134,94,0.06) 46%, rgba(11,11,12,0) 76%)",
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Centerpiece — the logo + the two actions. */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-24 text-center">
        {/* Glow lives on a static wrapper so the entrance blur animation on the
            image never overrides the drop-shadow. */}
        <div className="logo-glow w-[56vw] max-w-[360px]">
          <motion.img
            src={hero.logoSrc}
            alt="C&H Elite Auto Detailing"
            // Intrinsic size reserves the aspect ratio (no layout shift) and the
            // 1565px source stays far above the rendered size, so it renders
            // pin-sharp on any display. It's the hero focal point → fetch first.
            width={1565}
            height={1017}
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="w-full"
            initial={reduce ? false : { opacity: 0, scale: 0.94, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <motion.div
          className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href={brand.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-canvas/30 px-7 py-3.5 text-[15px] font-semibold tracking-tight text-canvas transition-colors duration-200 hover:border-canvas/80 hover:bg-canvas/5"
          >
            {hero.quoteCta}
          </a>
          <BookButton slug={primaryBookingSlug} variant="gold">
            {hero.bookCta}
          </BookButton>
        </motion.div>
      </div>
    </section>
  );
}
