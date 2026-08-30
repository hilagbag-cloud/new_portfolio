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

/** Desktop Horizontal Roadmap Curve */
function DesktopRoadmapCurve({
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
    <div className="relative w-full overflow-visible py-1" id="journey-roadmap-curve-desktop">
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

/** Mobile Dedicated Vertical / Semi-Vertical Organic Roadmap SVG (Strict Rule 7 Compliance) */
function MobileVerticalRoadmap({
  activeIndex,
  milestonesList,
  onSelectMilestone,
}: {
  activeIndex: number;
  milestonesList: Milestone[];
  onSelectMilestone: (m: Milestone) => void;
}) {
  const count = milestonesList.length;
  const itemHeight = 64;
  const totalHeight = Math.max(count * itemHeight, 180);
  const viewBox = `0 0 160 ${totalHeight}`;

  const nodePoints = useMemo(() => {
    return milestonesList.map((_, i) => {
      const y = (i + 0.5) * itemHeight;
      // Semi-vertical alternating curve: Left (34) <-> Right (76)
      const x = i % 2 === 0 ? 34 : 76;
      return { x, y };
    });
  }, [milestonesList, itemHeight]);

  const mobileSegments: CubicSegment[] = useMemo(() => {
    if (nodePoints.length < 2) return [];
    const segs: CubicSegment[] = [];
    for (let i = 0; i < nodePoints.length - 1; i++) {
      const p0 = nodePoints[i];
      const p3 = nodePoints[i + 1];
      const dy = (p3.y - p0.y) / 2;
      const p1 = { x: p0.x, y: p0.y + dy };
      const p2 = { x: p3.x, y: p3.y - dy };
      segs.push({ p0, p1, p2, p3 });
    }
    return segs;
  }, [nodePoints]);

  const pathD = useMemo(() => pathFromSegments(mobileSegments), [mobileSegments]);

  if (count === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border/80 bg-surface/70 p-3 my-2 shadow-inner">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="eyebrow text-[10px] text-accent font-mono font-bold">
          Trajectoire Verticale (Roadmap)
        </span>
        <span className="font-mono text-[10px] text-muted">
          Touchez une étape
        </span>
      </div>

      <div className="relative w-full flex items-center justify-center">
        <svg
          viewBox={viewBox}
          className="w-full max-w-[280px] h-auto overflow-visible"
          style={{ maxHeight: `${totalHeight + 20}px` }}
          aria-hidden="true"
        >
          {/* Background dashed organic spine */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray="4 6"
            />
          )}

          {/* Active Highlight Connection Spine */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.85}
            />
          )}

          {/* Milestone Interactive Nodes */}
          {milestonesList.map((m, idx) => {
            const pt = nodePoints[idx];
            if (!pt) return null;
            const isActive = idx === activeIndex;

            return (
              <g
                key={m.id}
                className="cursor-pointer"
                onClick={() => onSelectMilestone(m)}
                tabIndex={0}
                role="button"
                aria-label={`Étape ${m.stepNumber}: ${m.shortTitle}`}
              >
                {/* Outer Pulse Halo when active */}
                {isActive && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={18}
                    fill="var(--color-accent)"
                    opacity={0.22}
                    className="animate-pulse"
                  />
                )}

                {/* Node Outer Ring */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 9 : 6}
                  fill={isActive ? "var(--color-surface)" : "var(--color-bg)"}
                  stroke={isActive ? "var(--color-accent)" : "var(--color-border)"}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ transition: "all 0.25s ease" }}
                />

                {/* Center Node Dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 3.5 : 2}
                  fill={isActive ? "var(--color-accent)" : "var(--color-muted)"}
                />

                {/* Milestone Short Title Text Label */}
                <text
                  x={pt.x + (idx % 2 === 0 ? -14 : 16)}
                  y={pt.y + 4}
                  textAnchor={idx % 2 === 0 ? "end" : "start"}
                  className={`font-mono text-[10px] font-bold ${
                    isActive ? "fill-accent font-semibold" : "fill-muted hover:fill-text"
                  }`}
                  style={{
                    fontSize: "10px",
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    transition: "fill 0.2s ease",
                  }}
                >
                  {m.shortTitle || m.stepNumber}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
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
      className="relative bg-bg py-16 sm:py-20 lg:py-0 lg:h-[300vh] transition-colors overflow-hidden w-full max-w-full"
    >
      {/* Container: Native Fluid Flow on Mobile (< lg) and Sticky Full-Screen on Desktop (>= lg) */}
      <div className="lg:sticky lg:top-0 flex min-h-screen w-full flex-col justify-center overflow-hidden py-4 sm:py-8 lg:py-12">
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
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-text transition-colors hover:bg-white/5 hover:text-accent disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text focus-ring active:scale-95"
                    aria-label="Étape précédente"
                  >
                    <ChevronLeft size={16} />
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
                    className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg text-text transition-colors hover:bg-white/5 hover:text-accent disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-text focus-ring active:scale-95"
                    aria-label="Étape suivante"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Signature Horizontal Roadmap Curve (>= lg) */}
            <div className="mt-2 hidden lg:block">
              <DesktopRoadmapCurve
                progress={manualIndex !== null ? manualIndex / (published.length - 1) : scrollProgress}
                activeIndex={computedActiveIndex}
                milestonesList={published}
                onSelectMilestone={handleSelectMilestone}
              />
            </div>

            {/* Mobile Dedicated Vertical / Semi-Vertical Organic Roadmap (< lg) */}
            <div className="block lg:hidden w-full overflow-hidden">
              <MobileVerticalRoadmap
                activeIndex={computedActiveIndex}
                milestonesList={published}
                onSelectMilestone={handleSelectMilestone}
              />
            </div>

            {/* Interactive Step Tabs Bar */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none w-full max-w-full">
              {published.map((m, idx) => {
                const isActive = idx === computedActiveIndex;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMilestone(m)}
                    className={`group relative flex items-center gap-2 rounded-xl border px-3 py-2 sm:px-3.5 sm:py-2 text-left transition-all duration-200 focus-ring flex-shrink-0 min-h-[40px] ${
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
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-xs font-mono text-muted/70">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
              <span>Faites défiler ou sélectionnez une étape pour explorer</span>
            </div>
            <Link
              href={`/journey/${activeMilestone.id}`}
              className="inline-flex min-h-[40px] items-center gap-1.5 text-xs text-accent font-semibold transition-colors hover:underline"
            >
              <span>Accéder à la page de cette étape</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
