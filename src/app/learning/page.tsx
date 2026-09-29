"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import { ResourceViewerModal } from "@/components/Learning/ResourceViewerModal";
import {
  defaultLearningResources,
  type LearningResource,
} from "@/data/learningResources";
import {
  trackLearningVisit,
  trackResourceView,
  trackResourceDownload,
} from "@/lib/learning-analytics";
import {
  BookOpen,
  Search,
  Download,
  Eye,
  ArrowLeft,
  Sparkles,
  FileText,
  Book,
  Code,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function LearningPage() {
  const [resources, setResources] = useState<LearningResource[]>(defaultLearningResources);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeResource, setActiveResource] = useState<LearningResource | null>(null);

  // Track visit on /learning
  useEffect(() => {
    trackLearningVisit();
  }, []);

  // Listen to Firestore learningResources collection
  useEffect(() => {
    const q = query(collection(db, "learningResources"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const list = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as LearningResource[];

          // Merge Firestore with defaults so Day06 is always available
          const merged = new Map<string, LearningResource>();
          defaultLearningResources.forEach((r) => merged.set(r.id, r));
          list.forEach((r) => merged.set(r.id, { ...merged.get(r.id), ...r }));

          const publishedList = Array.from(merged.values()).filter(
            (r) => r.published !== false
          );
          setResources(publishedList);
        }
      },
      (err) => {
        console.debug("Firestore learningResources snapshot notice:", err);
      }
    );

    return () => unsub();
  }, []);

  const handleOpenResource = (res: LearningResource) => {
    trackResourceView(res.id, res.viewsCount);
    // Optimistic view increment in local state
    setResources((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, viewsCount: (r.viewsCount || 0) + 1 } : r))
    );
    setActiveResource(res);
  };

  const handleQuickDownload = (e: React.MouseEvent, res: LearningResource) => {
    e.stopPropagation();
    trackResourceDownload(res.id, res.downloadCount);
    setResources((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r))
    );

    // Download document directly
    const docContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${res.title} — Apprentissage Boosté by Hilarus</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 850px; margin: 40px auto; padding: 20px; color: #1f2937; }
    h1 { color: #0f172a; font-size: 26px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #1e3a8a; margin-top: 30px; font-size: 20px; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .quote { background: #f8fafc; border-left: 4px solid #38bdf8; padding: 12px 16px; margin: 16px 0; font-style: italic; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 13px; }
  </style>
</head>
<body>
  <div class="badge">${res.badge}</div>
  <h1>${res.title}</h1>
  <p><strong>${res.subtitle}</strong></p>
  <div class="quote">Crédits : Apprentissage Boosté — by Hilarus</div>
  <p>${res.miniDescription}</p>
  ${res.sections
    ? res.sections
        .map(
          (sec) => `
    <h2>${sec.themeNumber} : ${sec.title}</h2>
    <p>${sec.description}</p>
    ${sec.keyPoints ? `<ul>${sec.keyPoints.map((k) => `<li>${k}</li>`).join("")}</ul>` : ""}
    ${sec.codeSnippet ? `<pre><code>${sec.codeSnippet.code}</code></pre>` : ""}
  `
        )
        .join("")
    : ""}
</body>
</html>`;

    const blob = new Blob([docContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${res.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredResources = resources.filter((res) => {
    const matchCategory =
      selectedCategory === "all" || res.type === selectedCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.miniDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col transition-colors selection:bg-accent selection:text-bg">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-semibold text-text hover:text-accent transition-colors"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1 text-muted group-hover:text-accent"
              />
              <span className="font-display">Hilarus</span>
              <span className="text-muted text-xs hidden sm:inline">· Portfolio</span>
            </Link>

            <span className="text-border hidden sm:inline">|</span>

            <span className="font-display text-sm font-bold text-accent hidden sm:inline">
              Apprentissage Boosté
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/form"
              className="inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
            >
              <Sparkles size={13} />
              <span>Avis Chercheurs (/form)</span>
            </Link>

            <ThemeToggle variant="compact" />
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="border-b border-border bg-surface/30 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col gap-5 text-center items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
            <BookOpen size={14} />
            <span>Plateforme Libre de Partage de Savoir</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-text font-bold tracking-tight max-w-3xl leading-tight">
            Apprentissage Boosté <span className="text-accent">by Hilarus</span>
          </h1>

          <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            Ressources, livres, supports de cours PDF, guides de révision, fiches et schémas pratiques pour apprendre n&apos;importe quel sujet en profondeur.
          </p>

          {/* Quick Info Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-2 text-xs font-mono text-muted">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-accent" />
              <span>Accès 100% Libre & Gratuit</span>
            </span>
            <span>·</span>
            <span>Visionneuse Interactive</span>
            <span>·</span>
            <span>Téléchargements Illimités</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:py-10 space-y-8">
        {/* Controls: Search & Category Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Format Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "Tous", icon: BookOpen },
              { id: "pdf", label: "PDF & Cours", icon: FileText },
              { id: "book", label: "Livres", icon: Book },
              { id: "file", label: "Code & Fichiers", icon: Code },
              { id: "image", label: "Schémas & Images", icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-accent text-accent-contrast shadow-sm shadow-accent/20"
                      : "border border-border bg-surface text-muted hover:border-border/90 hover:text-text"
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un cours, un sujet..."
              className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-xs text-text placeholder:text-muted focus:border-accent focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="rounded-3xl border border-border bg-surface/50 p-12 text-center flex flex-col items-center gap-3">
            <BookOpen size={32} className="text-muted" />
            <h3 className="font-display text-lg font-bold text-text">
              Aucune ressource trouvée
            </h3>
            <p className="text-xs text-muted max-w-sm">
              Essayez de modifier votre recherche ou filtrez sur une autre catégorie.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                onClick={() => handleOpenResource(res)}
                className="group flex flex-col rounded-3xl border border-border bg-surface overflow-hidden shadow-sm hover:border-accent/80 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Visual Cover: Titre en grand sur un fond de couleur choisi */}
                <div
                  className="relative p-6 sm:p-7 min-h-[190px] flex flex-col justify-between text-white overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]"
                  style={{ backgroundColor: res.coverColor || "#0f2b48" }}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 z-10">
                    <span className="rounded-md bg-white/20 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {res.badge}
                    </span>
                    <span className="text-[11px] font-medium text-white/80">
                      {res.readTime}
                    </span>
                  </div>

                  {/* Grand Titre sur la cover */}
                  <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight text-white z-10 drop-shadow-sm my-3 line-clamp-3">
                    {res.title}
                  </h2>

                  {/* Category tag */}
                  <div className="z-10 text-[11px] font-mono text-white/80">
                    {res.category}
                  </div>

                  {/* Subtle background glow circle */}
                  <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none group-hover:bg-white/15 transition-all" />
                </div>

                {/* Card Content & Mini Description */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 gap-4">
                  <p className="text-xs sm:text-sm text-text/85 line-clamp-3 leading-relaxed">
                    {res.miniDescription}
                  </p>

                  {/* Telemetry and interactive actions */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    {/* Views & Downloads stats */}
                    <div className="flex items-center gap-3 text-xs text-muted font-mono">
                      <span className="flex items-center gap-1" title="Nombre de visionnages">
                        <Eye size={13} className="text-accent" />
                        <span className="tabular-nums font-semibold text-text">
                          {res.viewsCount || 0}
                        </span>
                      </span>

                      <span className="flex items-center gap-1" title="Nombre de téléchargements">
                        <Download size={13} className="text-blue-400" />
                        <span className="tabular-nums font-semibold text-text">
                          {res.downloadCount || 0}
                        </span>
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleQuickDownload(e, res)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-bg/80 text-muted hover:border-accent hover:text-accent transition-colors"
                        title="Téléchargement direct"
                      >
                        <Download size={14} />
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-xl bg-accent text-accent-contrast px-3 py-1.5 text-xs font-semibold group-hover:opacity-95 transition-opacity"
                      >
                        <span>Consulter</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Researcher CTA Banner */}
        <div className="rounded-3xl border border-accent/30 bg-surface/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-display text-lg sm:text-xl font-bold text-text">
              Vous êtes chercheur ou étudiant régulier ?
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Partagez votre avis sur ces ressources via notre questionnaire d&apos;évaluation anonyme.
            </p>
          </div>

          <Link
            href="/form"
            className="inline-flex items-center gap-2 rounded-xl bg-accent text-accent-contrast px-5 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity shrink-0 shadow-sm"
          >
            <span>Donner mon avis (/form)</span>
            <Sparkles size={14} />
          </Link>
        </div>
      </main>

      {/* Reader Modal */}
      {activeResource && (
        <ResourceViewerModal
          resource={activeResource}
          onClose={() => setActiveResource(null)}
          onDownloaded={() => {
            setResources((prev) =>
              prev.map((r) =>
                r.id === activeResource.id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r
              )
            );
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border/60 bg-surface/40 py-6 text-center text-xs text-muted mt-auto">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Apprentissage Boosté by Hilarus · Publication de ressources d&apos;apprentissage</span>
          <span className="font-mono text-[11px]">Accès ouvert · Libre & gratuit</span>
        </div>
      </footer>
    </div>
  );
}
