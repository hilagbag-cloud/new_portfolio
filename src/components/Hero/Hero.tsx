"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles, User, Camera, Upload } from "lucide-react";
import { site } from "@/data/site";
import { useCmsSiteConfig } from "@/lib/cms-hooks";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const cmsConfig = useCmsSiteConfig();

  // Photo URL resolution (Only user-uploaded photo, never artificial default)
  const rawPhoto =
    (cmsConfig as { profileImage?: string })?.profileImage ||
    (typeof window !== "undefined" ? localStorage.getItem("cms_profile_image") : null) ||
    site.profileImage ||
    "";
  const profilePhotoUrlLazy = rawPhoto === "/hilarus.png" ? "" : rawPhoto;

  const heroWidth =
    (cmsConfig as { heroImageWidth?: number })?.heroImageWidth || 560;
  const heroScale =
    (cmsConfig as { heroImageScale?: number })?.heroImageScale || 1;
  const heroFit =
    (cmsConfig as { heroImageFit?: "contain" | "cover" | "natural" })?.heroImageFit || "contain";

  // Mouse coordinate tracker for 3D tilt & spotlight depth
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const photoParallax = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : 50]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (!reducedMotion) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      setTilt({ rotateX, rotateY });
    }
  };

  const handleScrollTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="top" ref={containerRef} onMouseMove={handleMouseMove} className="relative w-full bg-bg text-text overflow-hidden transition-colors">
      {/* =========================================================================
          HERO STAGE: 3D INTEGRATED SUBJECT & MASSIVE TYPOGRAPHY
          ========================================================================= */}
      <section className="relative min-h-[92vh] md:min-h-screen flex flex-col justify-between pt-28 pb-10 md:pt-32 md:pb-14 px-4 sm:px-8 max-w-[1440px] w-full mx-auto overflow-hidden">
        
        {/* Giant Lime Green Radial Spotlight / Back-Glow */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] w-[300px] sm:w-[580px] md:w-[740px] lg:w-[880px] aspect-square rounded-full blur-[80px] sm:blur-[140px] md:blur-[180px]"
          aria-hidden
        >
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#bcf66a] via-[#84df25] to-[#2c6109] opacity-80" />
        </motion.div>

        {/* Dynamic interactive cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 243, 90, 0.18), transparent 80%)`,
          }}
          aria-hidden
        />

        {/* Subtle background tech grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        {/* TOP GREETING */}
        <div className="relative z-10 text-center w-full flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2 text-center flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-xs sm:text-sm tracking-widest text-accent uppercase font-semibold">
              {site.hero.greeting || "HEY — I'M"}
            </span>
          </motion.div>
        </div>

        {/* =========================================================================
            CENTER STAGE: RESPONSIVE DESKTOP VS MOBILE COMPOSITIONS
            ========================================================================= */}
        
        {/* MOBILE COMPOSITION (< md): TEXT -> DESCRIPTION -> PHOTO -> SOCIALS -> CTA */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 md:hidden w-full text-center space-y-3">
          {/* 1. TEXTE */}
          <div className="space-y-0.5">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.4rem,11.5vw,4rem)] leading-[0.95] tracking-tight uppercase text-text"
            >
              HILARUS
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(2.4rem,11.5vw,4rem)] leading-[0.95] tracking-tight uppercase text-accent"
            >
              GBAGOULE
            </motion.h1>
          </div>

          {/* 2. DESCRIPTION */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="px-2 max-w-md mx-auto space-y-1"
          >
            <p className="font-mono text-xs uppercase tracking-wider text-muted font-semibold">
              Creative Technologist × Product Engineer
            </p>
            <p className="text-xs sm:text-sm text-text/80 leading-relaxed font-sans">
              Conception d&apos;expériences immersives, d&apos;architectures logicielles et d&apos;IA.
            </p>
          </motion.div>

          {/* 3. PHOTO (Only rendered if custom photo is configured) */}
          {profilePhotoUrlLazy ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: heroScale }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative my-1 w-[clamp(240px,82vw,480px)] max-w-full pointer-events-none select-none flex flex-col items-center justify-end"
            >
              {/* Ambient Rim Light */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-accent/15 to-transparent blur-2xl rounded-full opacity-60 pointer-events-none" />

              <div className="relative w-full max-h-[480px] flex items-end justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profilePhotoUrlLazy}
                  alt={site.fullName || "Hilarus Gbagoule — Creative Technologist"}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className={`w-full h-auto max-h-[460px] ${
                    heroFit === "cover" ? "object-cover" : "object-contain"
                  } object-bottom portrait-3d-mask portrait-glow-filter`}
                />
              </div>
            </motion.div>
          ) : null}

          {/* 4. SOCIAL LINKS */}
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            aria-label="Social profiles mobile"
            className="flex flex-wrap items-center justify-center gap-1.5 pt-1 z-30"
          >
            {[
              {
                id: "dribbble",
                label: "DRIBBBLE",
                href: cmsConfig?.socials?.dribbble || "https://dribbble.com",
              },
              {
                id: "behance",
                label: "BEHANCE",
                href: cmsConfig?.socials?.behance || "https://behance.net",
              },
              {
                id: "linkedin",
                label: "LINKEDIN",
                href: cmsConfig?.socials?.linkedin || "https://linkedin.com/in/hilarus-gbagoule-6a926b426",
              },
              {
                id: "github",
                label: "GITHUB",
                href: cmsConfig?.socials?.github || "https://github.com",
              },
            ]
              .filter((item) => Boolean(item.href))
              .map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill-chip focus-ring"
                >
                  <span className="dot" aria-hidden="true" />
                  <span>{social.label}.</span>
                </a>
              ))}
          </motion.nav>
        </div>

        {/* DESKTOP COMPOSITION (>= md): TEXT + OVERLAPPING 3D PHOTO + TILT PARALLAX */}
        <div className="relative z-10 flex-1 hidden md:flex flex-col items-center justify-center my-2 sm:my-4">
          {/* Upper Giant Name: HILARUS */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(4.5rem,10.5vw,9.2rem)] leading-[0.9] tracking-tight uppercase text-text text-center drop-shadow-sm z-10 w-full max-w-full px-2"
          >
            HILARUS
          </motion.h1>

          {/* 3D FLOATING CUTOUT PORTRAIT (Only rendered if custom photo is configured) */}
          {profilePhotoUrlLazy ? (
            <motion.div
              style={{
                y: photoParallax,
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                width: `min(100%, ${heroWidth}px)`,
                maxWidth: "100%",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: heroScale }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative -my-10 md:-my-14 lg:-my-18 z-20 mx-auto pointer-events-none select-none flex flex-col items-center justify-end"
            >
              {/* Ambient Rim Light behind portrait */}
              <div className="absolute inset-0 -inset-x-8 bg-gradient-to-t from-accent/20 via-accent/30 to-transparent blur-3xl rounded-full opacity-70 pointer-events-none" />

              <div className="relative w-full max-h-[680px] flex items-end justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profilePhotoUrlLazy}
                  alt={site.fullName || "Hilarus Gbagoule — Creative Technologist"}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className={`w-full h-auto max-h-[660px] ${
                    heroFit === "cover" ? "object-cover" : "object-contain"
                  } object-bottom portrait-3d-mask portrait-glow-filter transition-transform duration-500`}
                />
              </div>
            </motion.div>
          ) : null}

          {/* Lower Giant Name: GBAGOULE */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`font-display text-[clamp(4.5rem,10.5vw,9.2rem)] leading-[0.9] tracking-tight uppercase text-accent text-center z-10 w-full max-w-full px-2 drop-shadow-sm ${
              !profilePhotoUrlLazy ? "mt-1 sm:mt-2" : ""
            }`}
          >
            GBAGOULE
          </motion.h1>

          {/* Social Links Ribbon right under name — styled as interactive pill chips */}
          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            aria-label="Social profiles"
            className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-30"
          >
            {[
              {
                id: "dribbble",
                label: "DRIBBBLE",
                href: cmsConfig?.socials?.dribbble || "https://dribbble.com",
              },
              {
                id: "behance",
                label: "BEHANCE",
                href: cmsConfig?.socials?.behance || "https://behance.net",
              },
              {
                id: "linkedin",
                label: "LINKEDIN",
                href: cmsConfig?.socials?.linkedin || "https://linkedin.com/in/hilarus-gbagoule-6a926b426",
              },
              {
                id: "twitter",
                label: "TWITTER",
                href: cmsConfig?.socials?.twitter || "https://twitter.com",
              },
              {
                id: "github",
                label: "GITHUB",
                href: cmsConfig?.socials?.github || "https://github.com",
              },
            ]
              .filter((item) => Boolean(item.href))
              .map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-pill-chip focus-ring"
                >
                  <span className="dot" aria-hidden="true" />
                  <span>{social.label}.</span>
                </a>
              ))}
          </motion.nav>
        </div>

        {/* BOTTOM FLANKING ACTION BUTTONS */}
        <div className="relative z-30 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6">
          {/* Bottom Left Button: Scroll Down to Projects */}
          <motion.button
            type="button"
            onClick={() => handleScrollTo("selected-work")}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="btn-skew focus-ring w-full sm:w-auto"
          >
            <span>{site.hero.ctaPrimary.label || "DÉCOUVRIR MES PROJETS"}</span>
            <ArrowDown size={15} strokeWidth={2.2} />
          </motion.button>

          {/* Bottom Right Button: Contact Me */}
          <motion.button
            type="button"
            onClick={() => handleScrollTo("contact")}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="btn-learn-more group focus-ring w-full sm:w-auto"
          >
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">
              {site.hero.ctaSecondary.label || "ME CONTACTER"}
            </span>
          </motion.button>
        </div>
      </section>

      {/* =========================================================================
          TRANSITION HERO NARRATIVE (MATCHES LOWER HALF OF REFERENCE: "I AM...")
          ========================================================================= */}
      <section className="relative z-10 border-t border-border/80 bg-surface/50 py-20 md:py-32">
        <div className="section-shell">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            
            {/* Left Big Typography block: "I AM HILARUS" */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6"
            >
              <div className="eyebrow text-accent mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>DIGITAL ARCHITECT & CREATIVE TECHNOLOGIST</span>
              </div>

              <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.94] text-text tracking-tight uppercase">
                <span className="block text-text">I AM</span>
                <span className="block text-accent">HILARUS</span>
              </h2>
            </motion.div>

            {/* Right Proposition & Narrative Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="lg:col-span-6 space-y-6 lg:pt-4"
            >
              <h3 className="font-display text-2xl sm:text-3xl text-text leading-tight uppercase">
                {site.statement.subheading}
              </h3>

              <p className="font-mono text-xs sm:text-sm leading-relaxed text-muted uppercase tracking-wider">
                {site.statement.description}
              </p>

              <div className="pt-4">
                <a
                  href="#contact"
                  className="btn-learn-more group focus-ring w-full sm:!w-auto sm:!min-w-[12.5rem]"
                >
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">
                    {site.statement.cta}
                  </span>
                </a>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
