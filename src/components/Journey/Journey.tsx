"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { useCmsMilestones } from "@/lib/cms-hooks";
import { type Milestone } from "@/data/milestones";
import {
  approximateLength,
  pathFromSegments,
  pointAtProgress,
  type CubicSegment,
} from "./bezier";
import { MilestoneContent } from "./MilestoneContent";

// Desktop curve geometry
const DESKTOP_VIEWBOX = "0 0 1200 140";
const DESKTOP_SEGMENTS: CubicSegment[] = [
  { p0: { x: 40, y: 95 }, p1: { x: 260, y: 25 }, p2: { x: 420, y: 115 }, p3: { x: 600, y: 70 } },
  { p0: { x: 600, y: 70 }, p1: { x: 780, y: 25 }, p2: { x: 920, y: 115 }, p3: { x: 1060, y: 60 } },
  { p0: { x: 1060, y: 60 }, p1: { x: 1110, y: 40 }, p2: { x: 1150, y: 55 }, p3: { x: 1170, y: 48 } },
];

function RoadmapCurve({
  progress,
  activeIndex,
  milestonesList,
  onSelectMilestone,
}: {
  progress: number;
  activeIndex: number;
  milestonesList: Milestone[];
  onSelectMilestone: (m: Milestone) => void;
}) {
  const reducedMotion = useReducedMotion();
  const d = useMemo(() => pathFromSegments(DESKTOP_SEGMENTS), []);
  const length = useMemo(() => approximateLength(DESKTOP_SEGMENTS), []);
  const dashoffset = reducedMotion ? 0 : length * (1 - Math.min(Math.max(progress, 0), 1));

  return (
    <div className="relative w-full overflow-visible py-1" id="journey-roadmap-curve">
      <svg viewBox={DESKTOP_VIEWBOX} className="h-12 w-full overflow-visible sm:h-14" aria-hidden>
        {/* Background Guide Line */}
        <path
          d={d}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="4 6"
        />
        {/* Glowing Progress Line */}
        <path
          d={d}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={length}
          strokeDashoffset={dashoffset}
          style={{ transition: reducedMotion ? "none" : "stroke-dashoffset 0.1s ease-out" }}
        />
        {/* Milestone Node Points */}
        {milestonesList.map((m, idx) => {
          const point = pointAtProgress(DESKTOP_SEGMENTS, m.progress);
          const isActive = idx === activeIndex;
          const isPassed = progress >= m.progress;

          return (
            <g
              key={m.id}
              className="cursor-pointer group"
              onClick={() => onSelectMilestone(m)}
              tabIndex={0}
              role="button"
              aria-label={`Aller à l'étape ${m.stepNumber}: ${m.shortTitle}`}
            >
              {/* Outer Pulse Halo when active */}
              {isActive && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={18}
                  fill="var(--color-accent)"
                  opacity={0.18}
                  className="animate-pulse"
                />
              )}
              {/* Node Outer Ring */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isActive ? 9 : 6}
                fill={isActive || isPassed ? "var(--color-surface)" : "var(--color-bg)"}
                stroke={isActive || isPassed ? "var(--color-accent)" : "var(--color-border)"}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={{ transition: "all 0.25s ease" }}
              />
              {/* Center Dot */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isActive ? 3.5 : isPassed ? 2.5 : 2}
                fill={isActive || isPassed ? "var(--color-accent)" : "var(--color-muted)"}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function Journey() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualIndex, setManualIndex] = useState<number | null>(null);

  const { milestones } = useCmsMilestones();
  const published = useMemo(() => milestones.filter((m) => m.published), [milestones]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setScrollProgress(v);
    if (manualIndex !== null) {
      setManualIndex(null);
    }
  });

  // Calculate active index based on scroll or manual selection
  const computedActiveIndex = useMemo(() => {
    if (manualIndex !== null) return manualIndex;

    const count = published.length;
    if (count === 0) return 0;

    const stepSize = 1 / count;
    const index = Math.min(Math.floor(scrollProgress / stepSize), count - 1);
    return Math.max(0, index);
  }, [scrollProgress, manualIndex, published.length]);

  const activeMilestone = published[computedActiveIndex] ?? published[0];

  const handleSelectMilestone = useCallback(
    (m: Milestone) => {
      const idx = published.findIndex((item) => item.id === m.id);
      if (idx !== -1) {
        setManualIndex(idx);
      }
    },
    [published]
  );

  const handleNext = useCallback(() => {
    if (computedActiveIndex < published.length - 1) {
      setManualIndex(computedActiveIndex + 1);
    }
  }, [computedActiveIndex, published.length]);

  const handlePrev = useCallback(() => {
    if (computedActiveIndex > 0) {
      setManualIndex(computedActiveIndex - 1);
    }
  }, [computedActiveIndex]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative h-[300vh] bg-bg"
    >
      {/* Sticky Screen-Fitted Container */}
      <div className="sticky top-0 flex min-h-screen w-full flex-col justify-center overflow-hidden py-8 sm:py-12">
        <div className="section-shell w-full flex flex-col justify-between space-y-4 sm:space-y-6">
          
          {/* Top Section Header & Timeline Control HUD */}
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b border-border/70 pb-3 sm:pb-4">
              <div>
                <div className="eyebrow mb-1.5 flex items-center gap-1.5 text-accent">
                  <Compass size={13} className="text-accent" />
                  <span>Trajectoire & Expérience</span>
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl lg:text-4xl">
                  Le chemin parcouru
                </h2>
              </div>

              {/* Progress HUD indicator & Quick Navigation */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={computedActiveIndex === 0}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-text transition-colors hover:bg-white/5 hover:text-accent disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text focus-ring"
                    aria-label="Étape précédente"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <span className="px-2 font-mono text-xs text-muted">
                    <span className="text-accent font-semibold">
                      {String(computedActiveIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="mx-1">/</span>
                    <span>{String(published.length).padStart(2, "0")}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={computedActiveIndex === published.length - 1}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-text transition-colors hover:bg-white/5 hover:text-accent disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text focus-ring"
                    aria-label="Étape suivante"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Signature Roadmap Curve */}
            <div className="mt-2 hidden lg:block">
              <RoadmapCurve
                progress={manualIndex !== null ? manualIndex / (published.length - 1) : scrollProgress}
                activeIndex={computedActiveIndex}
                milestonesList={published}
                onSelectMilestone={handleSelectMilestone}
              />
            </div>

            {/* Interactive Step Tabs Bar */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {published.map((m, idx) => {
                const isActive = idx === computedActiveIndex;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMilestone(m)}
                    className={`group relative flex items-center gap-2 rounded-xl border px-3 py-1.5 sm:px-3.5 sm:py-2 text-left transition-all duration-200 focus-ring ${
                      isActive
                        ? "border-accent/80 bg-accent/10 shadow-[0_0_12px_rgba(168,243,90,0.12)]"
                        : "border-border bg-surface/70 hover:border-border/90 hover:bg-surface"
                    }`}
                    id={`nav-milestone-${m.id}`}
                  >
                    <span
                      className={`font-mono text-xs font-semibold ${
                        isActive ? "text-accent" : "text-muted group-hover:text-text"
                      }`}
                    >
                      {m.stepNumber}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-text font-semibold" : "text-muted group-hover:text-text"
                      }`}
                    >
                      {m.shortTitle}
                    </span>
                    {isActive && (
                      <span className="hidden sm:inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Stage: Compact & Non-Clipping Preview Banner */}
          <div className="w-full py-1 sm:py-2">
            <MilestoneContent
              milestone={activeMilestone}
              onNextMilestone={handleNext}
              hasNextMilestone={computedActiveIndex < published.length - 1}
            />
          </div>

          {/* Bottom Footnote / Deep Dive Link */}
          <div className="flex items-center justify-between pt-1 text-xs font-mono text-muted/70">
            <div className="hidden sm:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
              <span>Faites défiler la page ou sélectionnez une étape</span>
            </div>
            <Link
              href={`/journey/${activeMilestone.id}`}
              className="ml-auto inline-flex items-center gap-1.5 text-xs text-accent font-semibold transition-colors hover:underline"
            >
              <span>Accéder à la page de cette étape</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
