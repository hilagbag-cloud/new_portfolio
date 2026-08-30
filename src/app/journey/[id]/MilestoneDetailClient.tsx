"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Layers,
  Compass,
  ChevronLeft,
  ChevronRight,
  Code2,
} from "lucide-react";
import type { Milestone } from "@/data/milestones";
import { Navigation } from "@/components/Navigation/Navigation";
import { Footer } from "@/components/Footer/Footer";
import { MilestoneCarousel } from "@/components/Journey/MilestoneCarousel";

interface MilestoneDetailClientProps {
  milestone: Milestone;
  prevMilestone: Milestone | null;
  nextMilestone: Milestone | null;
  totalSteps: number;
}

export function MilestoneDetailClient({
  milestone,
  prevMilestone,
  nextMilestone,
  totalSteps,
}: MilestoneDetailClientProps) {
  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent selection:text-bg">
      <Navigation />

      <main className="pt-28 pb-20 sm:pt-32 sm:pb-28">
        <div className="section-shell">
          {/* Top Back Navigation & Step Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-6">
            <Link
              href="/#journey"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-medium text-text transition-all hover:border-accent hover:text-accent focus-ring"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>Retour au parcours complet</span>
            </Link>

            {/* Stepper HUD */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-accent tracking-wider">
                ÉTAPE {milestone.stepNumber} / {String(totalSteps).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-1">
                {prevMilestone ? (
                  <Link
                    href={`/journey/${prevMilestone.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent focus-ring"
                    title={`Précédent : ${prevMilestone.shortTitle}`}
                    aria-label={`Étape précédente : ${prevMilestone.shortTitle}`}
                  >
                    <ChevronLeft size={16} />
                  </Link>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-surface/40 text-muted/30 cursor-not-allowed">
                    <ChevronLeft size={16} />
                  </span>
                )}

                {nextMilestone ? (
                  <Link
                    href={`/journey/${nextMilestone.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent focus-ring"
                    title={`Suivant : ${nextMilestone.shortTitle}`}
                    aria-label={`Étape suivante : ${nextMilestone.shortTitle}`}
                  >
                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-surface/40 text-muted/30 cursor-not-allowed">
                    <ChevronRight size={16} />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Header Hero of this Milestone */}
          <div className="mt-8 sm:mt-12 space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 font-semibold text-accent">
                <Sparkles size={13} />
                {milestone.badge}
              </span>
              <span className="eyebrow text-muted uppercase tracking-wider">
                {milestone.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-muted">
                <Calendar size={13} className="text-accent" />
                {milestone.date}
              </span>
              {milestone.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-muted">
                  <MapPin size={13} className="text-muted" />
                  {milestone.location}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]">
              {milestone.title}
            </h1>

            <p className="max-w-3xl text-lg sm:text-xl font-medium italic text-accent/90 border-l-2 border-accent pl-4 py-1">
              &ldquo;{milestone.headline}&rdquo;
            </p>
          </div>

          {/* Main Grid: Gallery on left/right and Key highlights */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Visuals & Interactive Gallery Stage */}
            <div className="lg:col-span-7 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-border bg-surface/70 p-2 sm:p-4">
                <MilestoneCarousel
                  gallery={milestone.gallery}
                  milestoneTitle={milestone.title}
                  isActive={true}
                />
              </div>

              {/* Key Highlights Cards */}
              {milestone.keyHighlights && milestone.keyHighlights.length > 0 && (
                <div>
                  <h3 className="eyebrow mb-3 flex items-center gap-2 text-muted">
                    <Layers size={14} className="text-accent" />
                    Repères & Métriques Clés
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {milestone.keyHighlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border/80 bg-surface/60 p-4 transition-colors hover:border-accent/40"
                      >
                        <span className="text-[11px] font-mono text-muted uppercase tracking-wider block mb-1">
                          {item.label}
                        </span>
                        <p className="font-display text-base sm:text-lg font-bold text-text">
                          {item.value}
                        </p>
                        {item.detail && (
                          <p className="text-xs text-muted/80 mt-1">{item.detail}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Narrative Story & In-depth Context */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8 space-y-5">
                <h2 className="eyebrow flex items-center gap-2 text-muted">
                  <Compass size={14} className="text-accent" />
                  Récit de l&apos;Étape
                </h2>

                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-text/90">
                  {milestone.longStory.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Technologies & Tools */}
              {milestone.technologies && milestone.technologies.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface/40 p-5">
                  <h3 className="eyebrow mb-3 flex items-center gap-2 text-muted">
                    <Code2 size={14} className="text-accent" />
                    Technologies & Outils Mobilisés
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {milestone.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-xs rounded-lg border border-border bg-surface px-3 py-1.5 text-text/80 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Learnings & Takeaways Section */}
          {milestone.learnings && milestone.learnings.length > 0 && (
            <div className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <h3 className="eyebrow mb-4 text-muted">Acquis & Enseignements Retenus</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {milestone.learnings.map((learning, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface/40 p-4"
                  >
                    <CheckCircle2 size={18} className="text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-text/90 leading-snug">
                      {learning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External Call to action if any */}
          {milestone.externalUrl && (
            <div className="mt-8 flex justify-center">
              <a
                href={milestone.externalUrl.href}
                target={milestone.externalUrl.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-contrast transition-transform hover:scale-105 focus-ring"
              >
                <span>{milestone.externalUrl.label}</span>
                <ExternalLink size={16} />
              </a>
            </div>
          )}

          {/* Bottom Pagination Switcher across milestones */}
          <div className="mt-16 border-t border-border/80 pt-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {prevMilestone ? (
                <Link
                  href={`/journey/${prevMilestone.id}`}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 transition-all hover:border-accent/60 hover:bg-surface/80"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-muted mb-2">
                    <ArrowLeft
                      size={14}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                    <span>Étape précédente ({prevMilestone.stepNumber})</span>
                  </div>
                  <p className="font-display text-base sm:text-lg font-bold text-text group-hover:text-accent">
                    {prevMilestone.shortTitle} — {prevMilestone.title}
                  </p>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}

              {nextMilestone ? (
                <Link
                  href={`/journey/${nextMilestone.id}`}
                  className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 text-right transition-all hover:border-accent/60 hover:bg-surface/80 sm:col-start-2"
                >
                  <div className="flex items-center justify-end gap-2 text-xs font-mono text-muted mb-2">
                    <span>Étape suivante ({nextMilestone.stepNumber})</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                  <p className="font-display text-base sm:text-lg font-bold text-text group-hover:text-accent">
                    {nextMilestone.shortTitle} — {nextMilestone.title}
                  </p>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
