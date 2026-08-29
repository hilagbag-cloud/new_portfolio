"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  BookOpen,
  Sparkles,
  Terminal,
  Palette,
  Code2,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  X,
  Layers,
} from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
  isActive?: boolean;
  onSelect?: () => void;
}

export function ProjectCard({
  project,
  index,
  isActive = false,
  onSelect,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const category = project.category || "software";
  const previewMode = project.previewMode || "description";

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSelect) onSelect();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      {/* 3D Book Container */}
      <div
        className={`book-project-card group ${isOpen || isActive ? "is-open" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleToggle}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-label={`Ouvrir le dossier du projet ${project.name}`}
      >
        {/* =========================================================================
            1. INSIDE THE CAHIER / BOOK (Dossier Intérieur)
            ========================================================================= */}
        <div className="book-interior flex flex-col justify-between overflow-hidden">
          {/* Top Bar inside the book */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-black/60 border border-accent/30">
                #{project.number}
              </span>
              <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                {previewMode === "image" ? "APERÇU VISUEL DU SITE" : "DOSSIER TECHNIQUE"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-muted hover:bg-accent hover:text-bg transition-colors"
              title="Fermer le cahier"
            >
              <X size={12} />
            </button>
          </div>

          {/* Interior Content: Conditional Preview (Image vs Description) */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-none py-1">
            {previewMode === "image" && project.previewImage ? (
              /* --- IMAGE PREVIEW MODE --- */
              <div className="space-y-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-accent/30 bg-black/60 shadow-lg group/preview">
                  <Image
                    src={project.previewImage}
                    alt={`Aperçu du site ${project.name}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover/preview:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-accent font-semibold px-2 py-0.5 rounded bg-black/80 border border-accent/30">
                      Live Preview
                    </span>
                    <span className="text-[10px] text-white/80 font-mono">
                      {project.name}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-display text-lg text-text font-bold leading-tight">
                    {project.name}
                  </h4>
                  <p className="mt-1 text-xs text-muted leading-relaxed line-clamp-2">
                    {project.shortDescription}
                  </p>
                </div>
              </div>
            ) : (
              /* --- DESCRIPTION & ARCHITECTURE MODE --- */
              <div className="space-y-3">
                <div>
                  <h4 className="font-display text-xl sm:text-2xl text-text font-bold tracking-tight">
                    {project.name}
                  </h4>
                  {project.tagline && (
                    <p className="text-xs text-accent font-mono mt-0.5 font-medium">
                      {project.tagline}
                    </p>
                  )}
                </div>

                <p className="text-xs text-muted/95 leading-relaxed">
                  {project.shortDescription}
                </p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="pt-2 border-t border-white/5">
                    <span className="font-mono text-[10px] text-muted/70 uppercase block mb-1.5">
                      Technologies & Stack :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-text/90"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Link at Bottom of Interior */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="font-mono text-[10px] text-accent/90 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span>{project.caseStudy ? "Étude Complète" : "Production"}</span>
            </span>

            {project.externalUrl ? (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="btn-skew !text-[11px] !py-1.5 !px-3"
              >
                <span>Accéder au site web</span>
                <ExternalLink size={11} />
              </a>
            ) : (
              <span className="font-mono text-[10px] text-muted px-2 py-0.5 rounded bg-white/5 border border-white/10">
                PROJET INTERNE
              </span>
            )}
          </div>
        </div>

        {/* =========================================================================
            2. FRONT COVER (Le Rectangle divisé en 3 parties avec micro-animations)
            ========================================================================= */}
        <div className="book-cover flex flex-col justify-between transition-transform duration-300">
          
          {/* SECTION 1 (TOP 1/3): Header band with ID, category and status */}
          <div className="border-b border-white/10 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-black/70 border border-accent/40">
                  #{project.number}
                </span>
                <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                  {category === "design"
                    ? "DESIGN & UI"
                    : category === "ai-data"
                    ? "IA & DATA PIPELINE"
                    : "SOFTWARE & WEB"}
                </span>
              </div>

              {/* Category-specific icon */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 border border-white/10 text-accent">
                {category === "design" ? (
                  <Palette size={14} />
                ) : category === "ai-data" ? (
                  <Terminal size={14} />
                ) : (
                  <Code2 size={14} />
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2 (MIDDLE 1/3): Project identity + Domain-Adaptive Micro-Animation */}
          <div className="py-3 my-auto">
            <h3 className="font-display text-2xl sm:text-3xl text-text font-bold tracking-tight group-hover:text-accent transition-colors leading-snug">
              {project.name}
            </h3>

            {project.tagline ? (
              <p className="mt-1 text-xs font-mono text-muted/90 line-clamp-1">
                {project.tagline}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted/80 line-clamp-2 font-sans">
                {project.shortDescription}
              </p>
            )}

            {/* Micro-animations tailored to expertise category */}
            <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-black/40 p-2 text-xs">
              {category === "ai-data" ? (
                /* IA / Data: Terminal Matrix Code Flux */
                <div className="font-mono text-[10px] space-y-1 text-muted">
                  <div className="flex items-center justify-between text-accent/90">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                      &gt; data_stream.py
                    </span>
                    <span className="text-[9px] text-muted">MODEL_READY</span>
                  </div>
                  <div className="text-[9px] text-muted/70 truncate">
                    tensor_shape: [batch, 512] | accuracy: 98.4%
                  </div>
                </div>
              ) : category === "design" ? (
                /* Design: Dynamic, clean and sober visual cadence */
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent">
                    <Sparkles size={11} className="animate-pulse" />
                    <span>SYSTEM INTERACTION</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-accent/40" />
                    <span className="h-2 w-2 rounded-full bg-accent/80" />
                    <span className="h-2 w-2 rounded-full bg-accent" />
                  </div>
                </div>
              ) : (
                /* Software / Web: Tech stack pipeline */
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-accent flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    <span>BUILD: PASSING</span>
                  </span>
                  <span className="text-muted">READY_TO_LAUNCH</span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3 (BOTTOM 1/3): Tech tags & Interactive Trigger */}
          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1 max-w-[70%]">
                {project.technologies.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-muted truncate"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 2 && (
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-muted">
                    +{project.technologies.length - 2}
                  </span>
                )}
              </div>

              {/* Reveal indicator / Book trigger */}
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent font-semibold group-hover:underline">
                <BookOpen size={13} />
                <span className="uppercase text-[10px]">
                  {isOpen ? "Fermer" : "Ouvrir"}
                </span>
                <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
