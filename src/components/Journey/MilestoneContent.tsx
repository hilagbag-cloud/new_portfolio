"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { Milestone } from "@/data/milestones";

interface MilestoneContentProps {
  milestone: Milestone | null;
  onNextMilestone?: () => void;
  hasNextMilestone?: boolean;
}

export function MilestoneContent({
  milestone,
  onNextMilestone,
  hasNextMilestone = false,
}: MilestoneContentProps) {
  if (!milestone) return null;

  const coverImageUrl =
    milestone.gallery?.[0]?.url ||
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={milestone.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12 rounded-3xl border border-border/80 bg-[#0c100d]/90 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-md"
        >
          {/* =========================================================================
              LEFT COLUMN: GRAND TITRE + PETIT SOUS-TITRE + DATE (Airy & Clean)
              ========================================================================= */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
            <div className="space-y-4">
              {/* Step indicator and Date badge */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-accent tracking-wider rounded-lg bg-accent/10 border border-accent/25 px-3 py-1">
                  ÉTAPE {milestone.stepNumber}
                </span>
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
                  <Calendar size={13} className="text-accent" />
                  <span>{milestone.date}</span>
                </div>
                {milestone.location && (
                  <span className="hidden sm:flex items-center gap-1 font-mono text-xs text-muted/80 border-l border-border/80 pl-3">
                    <MapPin size={12} />
                    {milestone.location}
                  </span>
                )}
              </div>

              {/* Grand Titre */}
              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text leading-[1.08]">
                {milestone.title}
              </h3>

              {/* Petit Sous-titre */}
              <p className="text-base sm:text-lg text-accent/90 font-medium leading-relaxed">
                {milestone.headline || milestone.shortTitle}
              </p>

              {/* Clean brief context (uncluttered) */}
              {milestone.description && (
                <p className="text-sm text-muted leading-relaxed font-sans max-w-xl line-clamp-3">
                  {milestone.description}
                </p>
              )}
            </div>

            {/* CTA action bar */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                href={`/journey/${milestone.id}`}
                className="btn-skew !text-xs !py-3 !px-6 flex items-center gap-2 group focus-ring"
                id={`btn-milestone-page-${milestone.id}`}
              >
                <span>Découvrir cette étape</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {hasNextMilestone && onNextMilestone && (
                <button
                  type="button"
                  onClick={onNextMilestone}
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-muted hover:text-accent transition-colors py-2 px-3 focus-ring"
                >
                  <span>Étape suivante</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: IMAGE DE COUVERTURE SPATIEUSE (Cover Image Showcase)
              ========================================================================= */}
          <div className="lg:col-span-6">
            <Link
              href={`/journey/${milestone.id}`}
              className="group relative block aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-xl transition-all duration-500 hover:border-accent hover:shadow-[0_0_30px_rgba(168,243,90,0.15)] focus-ring"
              title={`Voir l'étape ${milestone.title}`}
            >
              <Image
                src={coverImageUrl}
                alt={milestone.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/75 px-3 py-1 text-xs font-mono text-text backdrop-blur-md">
                <Sparkles size={11} className="text-accent" />
                <span>{milestone.badge || "JALON"}</span>
              </div>

              {/* Overlay hover prompt */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/80 px-3 py-1.5 font-mono text-xs text-accent font-semibold backdrop-blur-md opacity-90 group-hover:opacity-100 group-hover:bg-accent group-hover:text-bg transition-all">
                <span>Explorer l&apos;histoire</span>
                <ArrowUpRight size={13} />
              </div>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
