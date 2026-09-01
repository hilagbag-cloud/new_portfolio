"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Compass,
  ArrowUpRight,
  Calendar,
  MapPin,
  Sparkles,
  Layers,
  CheckCircle2,
  ChevronRight,
  Code2,
} from "lucide-react";
import { useCmsMilestones } from "@/lib/cms-hooks";
import { type Milestone } from "@/data/milestones";
import { MilestoneModal } from "./MilestoneModal";

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { milestones } = useCmsMilestones();
  const published = useMemo(() => milestones.filter((m) => m.published), [milestones]);

  const [activeStepId, setActiveStepId] = useState<string>("");
  const [selectedModalMilestone, setSelectedModalMilestone] = useState<Milestone | null>(null);

  // Scroll progress for the continuous timeline spine
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 80%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Track which milestone is currently in viewport to highlight the top jump bar
  useEffect(() => {
    if (published.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStepId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -50% 0px", threshold: 0.1 }
    );

    published.forEach((m) => {
      const el = document.getElementById(`milestone-${m.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [published]);

  const handleScrollToMilestone = (id: string) => {
    const el = document.getElementById(`milestone-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative bg-bg py-20 sm:py-28 transition-colors overflow-hidden w-full max-w-full"
    >
      <div className="section-shell">
        {/* Section Header */}
        <div className="space-y-4 border-b border-border/70 pb-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="eyebrow mb-2 flex items-center gap-2 text-accent">
                <Compass size={14} className="text-accent" />
                <span>Trajectoire & Évolution</span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl lg:text-5xl">
                Le chemin parcouru
              </h2>
              <p className="mt-2 text-sm sm:text-base text-muted max-w-2xl">
                Découvrez chaque étape clé, projet marquant et compétence acquise à travers une frise chronologique détaillée.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted bg-surface/80 border border-border/80 rounded-xl px-3.5 py-2 shrink-0 self-start md:self-auto">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span>
                {published.length} étapes franchies
              </span>
            </div>
          </div>

          {/* Quick Jump Step Navigation Bar */}
          <div className="pt-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-[11px] font-mono text-muted shrink-0 mr-1 hidden sm:inline">
                Accès direct :
              </span>
              {published.map((m) => {
                const isActive = activeStepId === `milestone-${m.id}`;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleScrollToMilestone(m.id)}
                    className={`group inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs transition-all focus-ring shrink-0 ${
                      isActive
                        ? "border-accent bg-accent/15 text-accent font-semibold shadow-sm"
                        : "border-border bg-surface/60 text-muted hover:border-border/90 hover:text-text hover:bg-surface"
                    }`}
                  >
                    <span className="font-mono text-[11px] font-bold opacity-80">
                      {m.stepNumber}
                    </span>
                    <span className="font-medium text-xs">
                      {m.shortTitle || m.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vertical Timeline Stream */}
        <div className="relative pl-6 sm:pl-10 md:pl-16 space-y-16 sm:space-y-24">
          {/* Continuous Vertical Spine Background Line */}
          <div className="absolute left-2 sm:left-4 md:left-6 top-4 bottom-8 w-[2px] bg-border/60" />

          {/* Glowing Animated Progress Spine */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-2 sm:left-4 md:left-6 top-4 bottom-8 w-[2px] bg-gradient-to-b from-accent via-accent/80 to-accent shadow-[0_0_8px_rgba(168,243,90,0.6)]"
          />

          {/* Milestones Vertical List */}
          {published.map((milestone, idx) => {
            const coverImage =
              milestone.gallery?.[0]?.url ||
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80";
            const galleryCount = milestone.gallery?.length || 0;

            return (
              <motion.article
                key={milestone.id}
                id={`milestone-${milestone.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: idx === 0 ? 0.05 : 0.1,
                  ease: [0.21, 1, 0.36, 1],
                }}
                className="relative scroll-mt-28"
              >
                {/* Timeline Spine Node Marker */}
                <div className="absolute -left-6 sm:-left-10 md:-left-16 top-6 -translate-x-1/2 flex items-center justify-center">
                  <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-accent bg-bg shadow-[0_0_15px_rgba(168,243,90,0.25)]">
                    <span className="font-mono text-xs sm:text-sm font-bold text-accent">
                      {milestone.stepNumber}
                    </span>
                    <div className="absolute inset-0 rounded-full bg-accent/10 animate-ping opacity-20 pointer-events-none" />
                  </div>
                </div>

                {/* Main Milestone Card */}
                <div className="rounded-3xl border border-border/80 bg-surface/90 p-6 sm:p-8 lg:p-10 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-2xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* Left Column: Details & Story */}
                    <div className="lg:col-span-7 space-y-5">
                      {/* Meta badges row */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono font-bold text-accent">
                          ÉTAPE {milestone.stepNumber}
                        </span>

                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 font-mono text-muted">
                          <Calendar size={12} className="text-accent" />
                          <span>{milestone.date}</span>
                        </div>

                        {milestone.location && (
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 font-mono text-muted">
                            <MapPin size={12} className="text-accent" />
                            <span>{milestone.location}</span>
                          </div>
                        )}

                        {milestone.badge && (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-text/80">
                            <Sparkles size={11} className="text-accent" />
                            <span>{milestone.badge}</span>
                          </span>
                        )}
                      </div>

                      {/* Main Title */}
                      <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text leading-snug">
                        {milestone.title}
                      </h3>

                      {/* Subtitle / Headline */}
                      {milestone.headline && (
                        <p className="text-sm sm:text-base text-accent font-semibold leading-relaxed">
                          {milestone.headline}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-sm text-muted leading-relaxed font-sans">
                        {milestone.description}
                      </p>

                      {/* Key Highlights Grid */}
                      {milestone.keyHighlights && milestone.keyHighlights.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          {milestone.keyHighlights.map((hl, hlIdx) => (
                            <div
                              key={hlIdx}
                              className="rounded-xl border border-border/70 bg-surface/50 p-3 text-xs"
                            >
                              <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-0.5">
                                {hl.label}
                              </div>
                              <div className="font-semibold text-text">
                                {hl.value}
                              </div>
                              {hl.detail && (
                                <div className="text-[11px] text-muted/80 mt-0.5">
                                  {hl.detail}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Technologies Chips */}
                      {milestone.technologies && milestone.technologies.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                          <span className="text-[10px] font-mono text-muted mr-1">
                            Compétences :
                          </span>
                          {milestone.technologies.map((tech, techIdx) => (
                            <span
                              key={techIdx}
                              className="rounded-md border border-border/70 bg-surface px-2 py-0.5 font-mono text-[10px] text-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/60">
                        <Link
                          href={`/journey/${milestone.id}`}
                          className="btn-skew !text-xs !py-2.5 !px-5 inline-flex items-center gap-2 group focus-ring"
                        >
                          <span>Explorer cette étape</span>
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </Link>

                        {galleryCount > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedModalMilestone(milestone)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-muted hover:text-text hover:border-accent transition-colors focus-ring"
                          >
                            <Layers size={13} className="text-accent" />
                            <span>Voir la galerie ({galleryCount} {galleryCount > 1 ? "photos" : "photo"})</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Visual Cover & Media Preview */}
                    <div className="lg:col-span-5">
                      <div
                        onClick={() => setSelectedModalMilestone(milestone)}
                        className="group relative block aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-lg transition-all duration-300 hover:border-accent hover:shadow-[0_0_25px_rgba(168,243,90,0.15)] cursor-pointer focus-ring"
                        role="button"
                        tabIndex={0}
                        aria-label={`Ouvrir la galerie pour ${milestone.title}`}
                      >
                        <Image
                          src={coverImage}
                          alt={milestone.title}
                          fill
                          unoptimized={coverImage.startsWith("data:")}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 800px"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Category Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/75 px-3 py-1 text-xs font-mono text-white backdrop-blur-md">
                          <Sparkles size={11} className="text-accent" />
                          <span>{milestone.category || milestone.badge || "JALON"}</span>
                        </div>

                        {/* Bottom Overlay Hint */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          {galleryCount > 1 ? (
                            <span className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/80 px-2.5 py-1 text-[11px] font-mono text-white/90 backdrop-blur-md">
                              <Layers size={11} className="text-accent" />
                              <span>{galleryCount} photos</span>
                            </span>
                          ) : (
                            <span />
                          )}
                          <span className="flex items-center gap-1 rounded-lg border border-accent/40 bg-black/85 px-3 py-1 font-mono text-[11px] font-semibold text-accent backdrop-blur-md group-hover:bg-accent group-hover:text-accent-contrast transition-colors">
                            <span>Agrandir</span>
                            <ArrowUpRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Deep Dive Footnote */}
        <div className="mt-16 sm:mt-24 text-center border-t border-border/70 pt-8">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-border bg-surface/70 px-6 py-4">
            <div className="flex items-center gap-2 text-xs font-mono text-muted">
              <CheckCircle2 size={15} className="text-accent" />
              <span>Toutes les étapes du parcours sont synchronisées en continu.</span>
            </div>
            <Link
              href="#contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
            >
              <span>Discuter d&apos;une future collaboration</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Milestone Detail / Gallery Modal */}
      {selectedModalMilestone && (
        <MilestoneModal
          isOpen={Boolean(selectedModalMilestone)}
          milestone={selectedModalMilestone}
          allMilestones={published}
          onClose={() => setSelectedModalMilestone(null)}
          onSelectMilestone={(m) => setSelectedModalMilestone(m)}
        />
      )}
    </section>
  );
}

