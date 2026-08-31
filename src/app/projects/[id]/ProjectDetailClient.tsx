"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Share2,
  Check,
  Palette,
  Terminal,
  Code2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Globe,
  Cpu,
  BookmarkCheck,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { Navigation } from "@/components/Navigation/Navigation";
import { Footer } from "@/components/Footer/Footer";

interface ProjectDetailClientProps {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
  relatedProjects: Project[];
  totalCount: number;
}

export function ProjectDetailClient({
  project,
  prevProject,
  nextProject,
  relatedProjects,
  totalCount,
}: ProjectDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const displayImage = project.previewImage || project.coverImage;
  const category = project.category || "software";

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${project.name} — Hilarus Gbagoule`,
          text: project.shortDescription,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent selection:text-bg">
      <Navigation />

      <main className="pt-28 pb-20 sm:pt-32 sm:pb-28">
        <div className="section-shell">
          {/* Top Bar Navigation & Navigation HUD */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 pb-6 mb-8 sm:mb-12">
            <Link
              href="/#selected-work"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-medium text-text transition-all hover:border-accent hover:text-accent focus-ring"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span>Retour aux projets</span>
            </Link>

            {/* Stepper / Pager */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-accent tracking-wider">
                PROJET #{project.number} / {String(totalCount).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-1">
                {prevProject ? (
                  <Link
                    href={`/projects/${prevProject.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent focus-ring"
                    title={`Précédent : ${prevProject.name}`}
                    aria-label={`Projet précédent : ${prevProject.name}`}
                  >
                    <ChevronLeft size={16} />
                  </Link>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-surface/40 text-muted/30 cursor-not-allowed">
                    <ChevronLeft size={16} />
                  </div>
                )}

                {nextProject ? (
                  <Link
                    href={`/projects/${nextProject.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent focus-ring"
                    title={`Suivant : ${nextProject.name}`}
                    aria-label={`Projet suivant : ${nextProject.name}`}
                  >
                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-surface/40 text-muted/30 cursor-not-allowed">
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Main Hero Header */}
          <div className="space-y-6 mb-12">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs font-bold text-accent">
                <Sparkles size={13} className="animate-pulse" />
                <span>#{project.number}</span>
              </span>

              <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs font-semibold text-text uppercase">
                {category === "design"
                  ? "Design & UI/UX"
                  : category === "ai-data"
                  ? "Intelligence Artificielle & Données"
                  : "Ingénierie Logicielle & Web"}
              </span>

              {project.caseStudy && (
                <span className="rounded-full border border-accent/30 bg-accent/15 px-3 py-1 font-mono text-xs font-semibold text-accent flex items-center gap-1">
                  <BookmarkCheck size={13} />
                  <span>Étude de Cas Documentée</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text">
                {project.name}
              </h1>
              {project.tagline && (
                <p className="font-mono text-base sm:text-xl text-accent font-medium">
                  {project.tagline}
                </p>
              )}
            </div>

            <p className="max-w-3xl text-sm sm:text-base lg:text-lg text-muted leading-relaxed font-sans">
              {project.shortDescription}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.externalUrl ? (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-skew !py-2.5 !px-6 !text-xs sm:!text-sm focus-ring flex items-center gap-2"
                >
                  <Globe size={15} />
                  <span>Visiter le site en direct</span>
                  <ExternalLink size={14} />
                </a>
              ) : null}

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-medium text-text transition-all hover:border-accent hover:text-accent focus-ring"
              >
                {copied ? <Check size={15} className="text-accent" /> : <Share2 size={15} />}
                <span>{copied ? "Lien copié !" : "Partager cette page"}</span>
              </button>

              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs sm:text-sm font-medium text-muted transition-all hover:border-text hover:text-text focus-ring"
              >
                <span>Demander un projet similaire</span>
              </Link>
            </div>
          </div>

          {/* Large Visual Showcase Image / Canvas */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-2xl md:rounded-3xl border border-border bg-surface/90 shadow-2xl mb-16 group">
            {displayImage ? (
              displayImage.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={displayImage}
                  alt={`Aperçu complet du projet ${project.name}`}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={displayImage}
                  alt={`Aperçu complet du projet ${project.name}`}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  referrerPolicy="no-referrer"
                />
              )
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-surface via-bg to-accent/15 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent">
                  {category === "design" ? (
                    <Palette size={32} />
                  ) : category === "ai-data" ? (
                    <Terminal size={32} />
                  ) : (
                    <Code2 size={32} />
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl sm:text-2xl text-text font-bold">
                  {project.name}
                </h3>
                <span className="mt-1 font-mono text-xs text-accent">
                  {project.tagline || "Architecture & Conception"}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Technical Deep Dive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            {/* Left Col (8 cols): Architecture & Value Proposition */}
            <div className="lg:col-span-8 space-y-8">
              {/* Stack & Technologies */}
              <div className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-text border-b border-border/60 pb-3">
                  <Cpu size={18} className="text-accent" />
                  <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wide">
                    Stack & Technologies Utilisées
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 font-mono text-xs sm:text-sm text-text font-medium shadow-xs"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Context & Description */}
              <div className="rounded-2xl border border-border bg-surface/60 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-text border-b border-border/60 pb-3">
                  <Layers size={18} className="text-accent" />
                  <h2 className="font-display text-lg sm:text-xl font-bold uppercase tracking-wide">
                    Contexte & Objectifs du Projet
                  </h2>
                </div>

                <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed font-sans">
                  <p>
                    {project.shortDescription}
                  </p>
                  <p>
                    Ce projet a été conçu avec un focus rigoureux sur la performance, la clarté typographique, l&apos;accessibilité et une architecture logicielle modulaire et maintenable.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Col (4 cols): Meta Summary Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-border bg-surface/80 p-6 space-y-4">
                <h3 className="font-display text-base font-bold text-text uppercase tracking-wider border-b border-border/60 pb-3">
                  Fiche Technique
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted">Numéro :</span>
                    <span className="text-accent font-bold">#{project.number}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted">Catégorie :</span>
                    <span className="text-text font-semibold uppercase">{category}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted">Auteur :</span>
                    <span className="text-text">Hilarus Gbagoule</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-border/40">
                    <span className="text-muted">Statut :</span>
                    <span className="inline-flex items-center gap-1 text-accent font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      <span>{project.externalUrl ? "En ligne" : "Production"}</span>
                    </span>
                  </div>

                  {project.externalUrl && (
                    <div className="pt-2">
                      <a
                        href={project.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-skew !w-full !py-2 !text-xs flex items-center justify-center gap-2"
                      >
                        <span>Ouvrir l&apos;application</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related / Other Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="border-t border-border/70 pt-12 mt-12 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="eyebrow block text-xs text-accent">DÉCOUVRIR</span>
                  <h2 className="font-display text-2xl font-bold text-text">
                    Autres Réalisations & Expérimentations
                  </h2>
                </div>
                <Link
                  href="/#selected-work"
                  className="font-mono text-xs text-accent hover:underline flex items-center gap-1"
                >
                  <span>Voir tous les projets</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/projects/${rel.id}`}
                    className="group rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/60 hover:bg-surface/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs text-accent font-bold">
                          #{rel.number}
                        </span>
                        <span className="font-mono text-[10px] text-muted uppercase">
                          {rel.category}
                        </span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-text group-hover:text-accent transition-colors">
                        {rel.name}
                      </h4>
                      <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
                        {rel.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-accent">
                      <span>Consulter la fiche</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
