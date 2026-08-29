"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";
import type { Milestone } from "@/data/milestones";

interface MilestoneModalProps {
  milestone: Milestone | null;
  allMilestones: Milestone[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMilestone: (milestone: Milestone) => void;
}

export function MilestoneModal({
  milestone,
  allMilestones,
  isOpen,
  onClose,
  onSelectMilestone,
}: MilestoneModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Reset active photo when milestone changes
  useEffect(() => {
    setActivePhotoIdx(0);
  }, [milestone?.id]);

  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && milestone) {
        const currentIdx = allMilestones.findIndex((m) => m.id === milestone.id);
        if (currentIdx > 0) onSelectMilestone(allMilestones[currentIdx - 1]);
      }
      if (e.key === "ArrowRight" && milestone) {
        const currentIdx = allMilestones.findIndex((m) => m.id === milestone.id);
        if (currentIdx < allMilestones.length - 1) onSelectMilestone(allMilestones[currentIdx + 1]);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, milestone, allMilestones, onSelectMilestone]);

  if (!isOpen || !milestone) return null;

  const currentIdx = allMilestones.findIndex((m) => m.id === milestone.id);
  const prevMilestone = currentIdx > 0 ? allMilestones[currentIdx - 1] : null;
  const nextMilestone = currentIdx < allMilestones.length - 1 ? allMilestones[currentIdx + 1] : null;

  const currentGalleryItem = milestone.gallery[activePhotoIdx] ?? milestone.gallery[0];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-6 md:p-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="milestone-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-[#0e120f] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-border/80 bg-surface px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-accent tracking-wider">
                ÉTAPE {milestone.stepNumber} / {String(allMilestones.length).padStart(2, "0")}
              </span>
              <span className="h-3.5 w-px bg-border" />
              <span className="eyebrow text-muted text-[11px]">{milestone.category}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Previous / Next buttons */}
              {prevMilestone && (
                <button
                  type="button"
                  onClick={() => onSelectMilestone(prevMilestone)}
                  className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 text-xs text-muted hover:border-accent hover:text-accent focus-ring"
                  title={`Étape précédente : ${prevMilestone.shortTitle}`}
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">{prevMilestone.shortTitle}</span>
                </button>
              )}
              {nextMilestone && (
                <button
                  type="button"
                  onClick={() => onSelectMilestone(nextMilestone)}
                  className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 text-xs text-muted hover:border-accent hover:text-accent focus-ring"
                  title={`Étape suivante : ${nextMilestone.shortTitle}`}
                >
                  <span className="hidden sm:inline">{nextMilestone.shortTitle}</span>
                  <ChevronRight size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent focus-ring ml-2"
                aria-label="Fermer la modal"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Title & Metadata Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-muted mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-medium text-accent">
                  <Sparkles size={12} />
                  {milestone.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-muted">
                  <Calendar size={12} />
                  {milestone.date}
                </span>
                {milestone.location && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-muted">
                    <MapPin size={12} />
                    {milestone.location}
                  </span>
                )}
              </div>

              <h2
                id="milestone-modal-title"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-text"
              >
                {milestone.title}
              </h2>

              <p className="mt-3 text-base sm:text-lg text-accent/90 font-medium italic">
                &ldquo;{milestone.headline}&rdquo;
              </p>
            </div>

            {/* Gallery Stage inside modal */}
            {milestone.gallery && milestone.gallery.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-border bg-surface/80 p-3 sm:p-4">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-black/60">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentGalleryItem.url}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full w-full"
                    >
                      <Image
                        src={currentGalleryItem.url}
                        alt={currentGalleryItem.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 850px"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </motion.div>
                  </AnimatePresence>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-4">
                    <div className="rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-md">
                      <p className="text-xs sm:text-sm font-medium text-text">
                        {currentGalleryItem.caption}
                      </p>
                      <span className="text-[10px] text-accent uppercase font-mono tracking-wider">
                        {currentGalleryItem.tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnails */}
                {milestone.gallery.length > 1 && (
                  <div className="mt-3 flex items-center gap-2 overflow-x-auto">
                    {milestone.gallery.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoIdx(idx)}
                        className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg border transition-all ${
                          idx === activePhotoIdx
                            ? "border-accent ring-1 ring-accent opacity-100"
                            : "border-border/60 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={item.url}
                          alt={item.alt}
                          fill
                          className="object-cover"
                          sizes="80px"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Highlights Grid */}
            {milestone.keyHighlights && milestone.keyHighlights.length > 0 && (
              <div>
                <h3 className="eyebrow mb-3 flex items-center gap-2 text-muted">
                  <Layers size={13} className="text-accent" />
                  Repères & Impact Clé
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {milestone.keyHighlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-border/80 bg-surface/60 p-4 transition-colors hover:border-accent/40"
                    >
                      <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
                        {item.label}
                      </span>
                      <p className="font-display text-base font-semibold text-text">{item.value}</p>
                      {item.detail && (
                        <p className="text-xs text-muted/80 mt-0.5">{item.detail}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Narrative Story */}
            <div className="space-y-4">
              <h3 className="eyebrow text-muted">Récit & Contexte de l&apos;Étape</h3>
              <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-text/90">
                {milestone.longStory.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Key Learnings */}
            {milestone.learnings && milestone.learnings.length > 0 && (
              <div className="rounded-xl border border-border bg-surface/40 p-5">
                <h3 className="eyebrow mb-3 text-muted">Acquis & Perspectives Retenus</h3>
                <ul className="space-y-2.5">
                  {milestone.learnings.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-text/90">
                      <CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies Used */}
            {milestone.technologies && milestone.technologies.length > 0 && (
              <div>
                <h3 className="eyebrow mb-3 text-muted">Technologies & Outils Mobilisés</h3>
                <div className="flex flex-wrap gap-2">
                  {milestone.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs rounded-lg border border-border bg-surface px-3 py-1 text-text/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between border-t border-border/80 bg-surface px-6 py-4">
            {milestone.externalUrl ? (
              <a
                href={milestone.externalUrl.href}
                target={milestone.externalUrl.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-bg transition-transform hover:scale-[1.02] focus-ring"
              >
                <span>{milestone.externalUrl.label}</span>
                <ExternalLink size={13} />
              </a>
            ) : (
              <div className="text-xs font-mono text-muted">
                Trajectoire continue vers le craft & l&apos;innovation
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-medium text-text hover:border-accent hover:text-accent focus-ring"
            >
              Fermer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
