import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { brand, hero, primaryBookingSlug } from "../content/site";
import { BookButton } from "./BookButton";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export function Hero() {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowVideo, setAllowVideo] = useState(false);

  // Decide once whether to load the (heavy) hero video. We skip it for
  // reduced-motion users and on data-saver / very slow (2G) connections, where
  // the instant poster is the better, cheaper experience. Browsers without the
  // Network Information API report nothing, so they default to playing it.
  useEffect(() => {
    if (reduce) {
      setAllowVideo(false);
      return;
    }
    const conn = (navigator as Navigator & { connection?: NetworkInformation })
      .connection;
    const constrained =
      conn?.saveData === true || /(^|-)2g$/.test(conn?.effectiveType ?? "");
    setAllowVideo(!constrained);
  }, [reduce]);

  // Make mobile autoplay actually happen. iOS/Android only autoplay a video
  // they can *see* is muted+inline — and React's `muted` prop notoriously fails
  // to set the underlying DOM attribute, so the browser treats it as audible
  // and blocks autoplay (you get a poster + a play button instead). We set those
  // properties imperatively and kick play() — retrying once the data loads,
  // since the first attempt can land before the element is ready.
  useEffect(() => {
    const v = videoRef.current;
    if (!allowVideo || !v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.playsInline = true;

    const tryPlay = () => {
      v.play().catch(() => {});
    };
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, [allowVideo]);

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

      {/* Video layer — mounted as soon as the connection check passes, and
          preloaded so it starts playing quickly. Fades in over the poster
          (no black). Skipped on reduced-motion / data-saver / 2G. */}
      {allowVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-0 transition-opacity duration-500"
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
          // Only reveal once it's genuinely playing. If a browser blocks
          // autoplay outright, the element stays invisible and the background
          // poster shows cleanly — no paused frame, no stray play button.
          onPlaying={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <source src={hero.videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Readability gradient between media and content. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/80" />

      {/* Centerpiece — the logo + the two actions. */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-24 text-center">
        {/* The mark is black line art; the wrapper's brightness-0 + invert
            renders it crisp white over the dark hero/video — no glow needed.
            The invert lives on the wrapper so the image's animated blur filter
            never overrides it. */}
        <div className="w-[64vw] max-w-[420px] brightness-0 invert">
          <motion.img
            src={hero.logoSrc}
            alt="C&H Elite Auto Detailing"
            // Intrinsic size reserves the aspect ratio (no layout shift) and the
            // 2000px source stays far above the rendered size, so it renders
            // pin-sharp on any display. It's the hero focal point → fetch first.
            width={2000}
            height={1295}
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
          <BookButton slug={primaryBookingSlug} variant="gold" chooser>
            {hero.bookCta}
          </BookButton>
        </motion.div>
      </div>
    </section>
  );
}
