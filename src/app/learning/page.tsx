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
import Image from "next/image";
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
  X,
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

    // If an actual uploaded file exists, download it directly
    if (res.fileDataUrl) {
      const a = document.createElement("a");
      a.href = res.fileDataUrl;
      a.download = res.fileName || `${res.id}.${res.type === "pdf" ? "pdf" : "dat"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (res.fileUrl) {
      window.open(res.fileUrl, "_blank");
      return;
    }

    // Fallback: Download document directly as formatted HTML
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

      {/* Compact Modern Hero Section */}
      <section className="relative border-b border-border/60 bg-gradient-to-b from-surface/80 via-surface/40 to-transparent py-5 sm:py-7 md:py-9 overflow-hidden">
        {/* Subtle background ambient glow */}
        <div
          className="pointer-events-none absolute -top-16 right-1/4 h-52 w-52 sm:h-72 sm:w-72 rounded-full bg-accent/10 blur-[90px] -z-10"
          aria-hidden
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8 items-center">
            {/* Left Column: Title, Short Subtitle, Quick Value Props */}
            <div className="md:col-span-7 flex flex-col items-start gap-2.5 sm:gap-3.5 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-mono font-semibold text-accent">
                <BookOpen size={12} />
                <span>Ressources Libres & Guides Pratiques</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text font-bold tracking-tight leading-tight">
                Apprentissage Boosté <span className="text-accent">by Hilarus</span>
              </h1>

              <p className="text-xs sm:text-sm text-muted max-w-xl leading-relaxed">
                Supports de cours, fiches synthétiques et documents techniques pour accélérer votre maîtrise du développement, de l&apos;IA et de la data.
              </p>

              {/* Compact Meta Badges */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5 text-[11px] font-mono text-muted">
                <span className="inline-flex items-center gap-1 text-text/90">
                  <CheckCircle2 size={13} className="text-accent" />
                  <span>Accès 100% libre</span>
                </span>
                <span className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Lecteur interactif</span>
                </span>
                <span className="text-border">·</span>
                <span>Téléchargement direct</span>
              </div>
            </div>

            {/* Right Column: Seamlessly Integrated Visual Asset */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] aspect-[4/3] max-h-[160px] sm:max-h-[200px] md:max-h-[220px] lg:max-h-[240px] flex items-center justify-center">
                <Image
                  src="/learning-hero.jpg"
                  alt="Apprentissage Boosté by Hilarus"
                  fill
                  sizes="(max-width: 768px) 280px, 380px"
                  className="object-contain object-center md:object-right rounded-xl"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:py-6 lg:py-8 space-y-6">
        {/* Controls: Search & Category Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          {/* Categories: Modern scrollable horizontal row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: "all", label: "Tous", icon: BookOpen },
              { id: "pdf", label: "PDF & Cours", icon: FileText },
              { id: "book", label: "Livres", icon: Book },
              { id: "file", label: "Code & Fichiers", icon: Code },
              { id: "image", label: "Schémas & Images", icon: ImageIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              const count = tab.id === "all" 
                ? resources.length 
                : resources.filter((r) => r.type === tab.id).length;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`group inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                    isActive
                      ? "bg-accent text-black font-bold shadow-sm shadow-accent/20"
                      : "border border-border/80 bg-surface/90 text-muted hover:border-accent/40 hover:text-text"
                  }`}
                >
                  <Icon size={13} className={isActive ? "text-black" : "text-muted group-hover:text-accent"} />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                        isActive
                          ? "bg-black/15 text-black font-extrabold"
                          : "bg-surface-elevated text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un cours, un sujet..."
              className="w-full rounded-xl border border-border/80 bg-surface/90 pl-10 pr-9 py-2 text-xs text-text placeholder:text-muted focus:border-accent focus:bg-surface focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Effacer la recherche"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text p-1 rounded-md transition-colors"
              >
                <X size={13} />
              </button>
            )}
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

                  {/* Attached file badge if present */}
                  {res.fileName && (
                    <div className="rounded-xl border border-accent/25 bg-accent/5 px-2.5 py-1.5 text-[11px] flex items-center justify-between gap-1 text-muted">
                      <span className="flex items-center gap-1.5 truncate text-text/90 font-medium">
                        <FileText size={12} className="text-accent shrink-0" />
                        <span className="truncate">{res.fileName}</span>
                      </span>
                      {res.fileSizeFormatted && (
                        <span className="font-mono text-[10px] text-muted shrink-0">{res.fileSizeFormatted}</span>
                      )}
                    </div>
                  )}

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
                        className="inline-flex items-center gap-1 rounded-xl bg-accent text-black font-bold px-3 py-1.5 text-xs hover:brightness-105 transition-all shadow-sm"
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
        <div className="rounded-3xl border border-accent/40 bg-surface/90 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
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
            className="inline-flex items-center gap-2 rounded-xl bg-accent text-black font-bold px-5 py-2.5 text-xs hover:brightness-105 transition-all shrink-0 shadow-[0_0_18px_rgba(168,243,90,0.3)] active:scale-[0.98]"
          >
            <span>Donner mon avis (/form)</span>
            <Sparkles size={14} className="text-black" />
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
