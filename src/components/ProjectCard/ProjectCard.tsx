"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  BookOpen,
  Sparkles,
  Terminal,
  Palette,
  Code2,
  ArrowUpRight,
  X,
  Layers,
  FileText,
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
  const [, setIsHovered] = useState(false);

  const category = project.category || "software";
  const previewMode = project.previewMode || "description";
  const displayImage = project.previewImage || project.coverImage;

  const handleToggle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSelect) onSelect();
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      {/* =========================================================================
          1. MOBILE VIEW (< md): DIRECT CLEAN MINIMALIST GRID CARD (Aperçu, Titre, Description)
          ========================================================================= */}
      <div className="block md:hidden w-full">
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 active:scale-[0.99]">
          
          {/* APERÇU (VISUAL PREVIEW IMAGE) */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg/80 border-b border-border/80">
            {displayImage ? (
              displayImage.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayImage}
                  alt={`Aperçu de ${project.name}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <Image
                  src={displayImage}
                  alt={`Aperçu de ${project.name}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                  referrerPolicy="no-referrer"
                />
              )
            ) : (
              /* Fallback sleek gradient mockup if no image */
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-surface via-bg to-accent/10 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                  {category === "design" ? (
                    <Palette size={22} />
                  ) : category === "ai-data" ? (
                    <Terminal size={22} />
                  ) : (
                    <Code2 size={22} />
                  )}
                </div>
                <span className="mt-3 font-mono text-xs text-muted">
                  {project.tagline || project.name}
                </span>
              </div>
            )}

            {/* Gradient Overlay & Badges */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Bar Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="font-mono text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-black/80 border border-accent/40 shadow-sm">
                #{project.number}
              </span>

              <span className="font-mono text-[10px] text-white/90 font-medium px-2 py-0.5 rounded bg-black/70 border border-white/10 uppercase">
                {category === "design"
                  ? "Design"
                  : category === "ai-data"
                  ? "AI & Data"
                  : "Software"}
              </span>
            </div>

            {/* Bottom image caption */}
            {project.externalUrl && (
              <div className="absolute bottom-2.5 right-3 pointer-events-none">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-accent font-semibold px-2 py-0.5 rounded-md bg-black/80 border border-accent/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  <span>En ligne</span>
                </span>
              </div>
            )}
          </div>

          {/* TITRE & DESCRIPTION (Clean, minimal, direct) */}
          <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
            <div className="space-y-2">
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-text font-bold leading-snug">
                  {project.name}
                </h3>
                {project.tagline && (
                  <p className="font-mono text-xs text-accent mt-0.5 font-medium">
                    {project.tagline}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
                {project.shortDescription}
              </p>
            </div>

            {/* TECHNOLOGIES TAGS */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-bg border border-border text-muted font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* ACTION DIRECT CTA */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <Link
                href={`/projects/${project.id}`}
                className="font-mono text-[11px] text-muted hover:text-accent flex items-center gap-1.5 transition-colors"
              >
                <FileText size={12} className="text-accent" />
                <span>Fiche projet</span>
              </Link>

              {project.externalUrl ? (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-skew !text-[11px] !py-1.5 !px-3.5 focus-ring"
                >
                  <span>Visiter</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="font-mono text-[10px] text-muted px-2 py-1 rounded bg-bg border border-border">
                  Interne
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. DESKTOP VIEW (>= md): 3D BOOK & FOLDER DOSSIER CARD
          ========================================================================= */}
      <div className="hidden md:block w-full">
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
          {/* INSIDE THE CAHIER / BOOK */}
          <div className="book-interior flex flex-col justify-between overflow-hidden">
            {/* Top Bar inside the book */}
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-accent px-2 py-0.5 rounded bg-accent/15 border border-accent/30">
                  #{project.number}
                </span>
                <span className="font-mono text-[10px] text-muted uppercase tracking-wider font-semibold">
                  {previewMode === "image" ? "APERÇU DU SITE" : "DOSSIER TECHNIQUE"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggle}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted hover:bg-accent hover:text-accent-contrast transition-colors"
                title="Fermer le cahier"
              >
                <X size={12} />
              </button>
            </div>

            {/* Interior Content: Conditional Preview (Image vs Description) */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-none py-1">
              {previewMode === "image" && displayImage ? (
                /* IMAGE PREVIEW MODE */
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-accent/30 bg-black/60 shadow-lg group/preview">
                    {displayImage.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={displayImage}
                        alt={`Aperçu du site ${project.name}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
                      />
                    ) : (
                      <Image
                        src={displayImage}
                        alt={`Aperçu du site ${project.name}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover/preview:scale-105"
                        sizes="400px"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-accent font-semibold px-2 py-0.5 rounded bg-black/80 border border-accent/30">
                        Live Preview
                      </span>
                      <span className="text-[10px] text-white/90 font-mono">
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
                /* DESCRIPTION & ARCHITECTURE MODE */
                <div className="space-y-3">
                  <div>
                    <h4 className="font-display text-xl sm:text-2xl text-text font-bold tracking-tight">
                      {project.name}
                    </h4>
                    {project.tagline && (
                      <p className="text-xs text-accent font-mono mt-0.5 font-semibold">
                        {project.tagline}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <span className="font-mono text-[10px] text-muted uppercase block mb-1.5 font-semibold">
                        Technologies & Stack :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-surface border border-border text-text font-medium"
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
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
              <Link
                href={`/projects/${project.id}`}
                onClick={(e) => e.stopPropagation()}
                className="font-mono text-[10px] text-muted hover:text-accent flex items-center gap-1.5 transition-colors"
                title={`Ouvrir la fiche complète de ${project.name}`}
              >
                <FileText size={11} className="text-accent" />
                <span>Fiche complète</span>
              </Link>

              {project.externalUrl ? (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="btn-skew !text-[11px] !py-1.5 !px-3"
                >
                  <span>Accéder au site</span>
                  <ExternalLink size={11} />
                </a>
              ) : (
                <span className="font-mono text-[10px] text-muted px-2 py-0.5 rounded bg-surface border border-border">
                  PROJET INTERNE
                </span>
              )}
            </div>
          </div>

          {/* FRONT COVER */}
          <div className="book-cover flex flex-col justify-between transition-transform duration-300">
            {/* Header band */}
            <div className="border-b border-border/80 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/40">
                    #{project.number}
                  </span>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-wider font-semibold">
                    {category === "design"
                      ? "DESIGN & UI"
                      : category === "ai-data"
                      ? "IA & DATA PIPELINE"
                      : "SOFTWARE & WEB"}
                  </span>
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface border border-border text-accent shadow-xs">
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

            {/* Middle Identity */}
            <div className="py-3 my-auto">
              <h3 className="font-display text-2xl sm:text-3xl text-text font-bold tracking-tight group-hover:text-accent transition-colors leading-snug">
                {project.name}
              </h3>

              {project.tagline ? (
                <p className="mt-1 text-xs font-mono text-muted line-clamp-1">
                  {project.tagline}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted line-clamp-2 font-sans">
                  {project.shortDescription}
                </p>
              )}

              {/* Micro-animations tailored to expertise category */}
              <div className="mt-3 overflow-hidden rounded-lg border border-border/80 bg-surface/80 p-2.5 text-xs">
                {category === "ai-data" ? (
                  <div className="font-mono text-[10px] space-y-1 text-muted">
                    <div className="flex items-center justify-between text-accent font-semibold">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                        &gt; data_stream.py
                      </span>
                      <span className="text-[9px] text-muted">MODEL_READY</span>
                    </div>
                    <div className="text-[9px] text-muted truncate">
                      tensor_shape: [batch, 512] | accuracy: 98.4%
                    </div>
                  </div>
                ) : category === "design" ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent font-semibold">
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
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-accent flex items-center gap-1 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      <span>BUILD: PASSING</span>
                    </span>
                    <span className="text-muted font-medium">READY_TO_LAUNCH</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Tech & Trigger */}
            <div className="border-t border-border/80 pt-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1 max-w-[70%]">
                  {project.technologies.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted truncate font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 2 && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted font-medium">
                      +{project.technologies.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-accent font-bold group-hover:underline">
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
    </div>
  );
}
