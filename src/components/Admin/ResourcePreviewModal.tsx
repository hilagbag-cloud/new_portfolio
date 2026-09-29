"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  Download,
  BookOpen,
  Sparkles,
  FileText,
  FileCode,
  Image as ImageIcon,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react";
import type { LearningResource } from "@/data/learningResources";

interface Props {
  resource: LearningResource | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  isPublishing?: boolean;
}

export function ResourcePreviewModal({
  resource,
  isOpen,
  onClose,
  onConfirmPublish,
  isPublishing = false,
}: Props) {
  const [activeTab, setActiveTab] = useState<"card" | "reader">("reader");

  if (!isOpen || !resource) return null;

  const handleTestDownload = () => {
    if (resource.fileDataUrl) {
      const a = document.createElement("a");
      a.href = resource.fileDataUrl;
      a.download = resource.fileName || `${resource.id}.${resource.type === "pdf" ? "pdf" : "dat"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (resource.fileUrl) {
      window.open(resource.fileUrl, "_blank");
      return;
    }

    // Default test download message
    alert("Test de téléchargement réussi ! Le fichier réel sera téléchargé par l'utilisateur.");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative flex flex-col w-full max-w-5xl max-h-[92vh] rounded-3xl border border-accent/40 bg-surface text-text shadow-2xl overflow-hidden"
        >
          {/* Top Admin Preview Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-border bg-bg/90 backdrop-blur-md gap-3 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-black font-bold shadow-sm">
                <Eye size={18} />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-sm sm:text-base font-bold text-text">
                    Prévisualisation Complète Avant Publication
                  </h3>
                  <span className="rounded-md border border-accent/40 bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold text-accent uppercase">
                    Non Publié (Brouillon)
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  Vérifiez le rendu exact tel qu&apos;il apparaîtra aux visiteurs sur /learning.
                </p>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-surface border border-border rounded-xl p-1">
              <button
                type="button"
                onClick={() => setActiveTab("reader")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "reader"
                    ? "bg-accent text-black font-bold shadow-sm"
                    : "text-muted hover:text-text"
                }`}
              >
                <BookOpen size={13} />
                <span>Modal Lecteur</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("card")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "card"
                    ? "bg-accent text-black font-bold shadow-sm"
                    : "text-muted hover:text-text"
                }`}
              >
                <Eye size={13} />
                <span>Carte Catalogue</span>
              </button>
            </div>
          </div>

          {/* Main Scrollable Preview Content */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
            {activeTab === "card" ? (
              /* =========================================================
                 1. PREVIEW: CARD IN THE /learning CATALOG GRID
                 ========================================================= */
              <div className="space-y-4">
                <div className="p-3 rounded-xl border border-border bg-bg text-xs text-muted font-mono flex items-center justify-between">
                  <span>Aperçu de la carte dans la grille publique /learning :</span>
                  <span className="text-accent font-semibold">Format : {resource.type.toUpperCase()}</span>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="group flex flex-col rounded-3xl border border-border bg-surface overflow-hidden shadow-xl transition-all duration-300">
                    {/* Visual Cover: Titre en grand sur le fond de couleur choisi */}
                    <div
                      className="relative p-6 sm:p-7 min-h-[190px] flex flex-col justify-between text-white overflow-hidden"
                      style={{ backgroundColor: resource.coverColor || "#0f2b48" }}
                    >
                      {/* Top Badge */}
                      <div className="flex items-center justify-between gap-2 z-10">
                        <span className="rounded-md bg-white/20 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                          {resource.badge}
                        </span>
                        <span className="text-[11px] font-medium text-white/80">
                          {resource.readTime}
                        </span>
                      </div>

                      {/* Grand Titre sur la cover */}
                      <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight text-white z-10 drop-shadow-sm my-3 line-clamp-3">
                        {resource.title}
                      </h2>

                      {/* Category tag */}
                      <div className="z-10 text-[11px] font-mono text-white/80">
                        {resource.category}
                      </div>

                      {/* Background glow shape */}
                      <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
                    </div>

                    {/* Card Content & Mini Description */}
                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 gap-4">
                      <p className="text-xs sm:text-sm text-text/85 line-clamp-3 leading-relaxed">
                        {resource.miniDescription}
                      </p>

                      {/* Attached file indicator if available */}
                      {resource.fileName && (
                        <div className="rounded-xl border border-accent/30 bg-accent/5 px-3 py-2 text-xs flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-accent font-medium truncate">
                            <FileText size={13} />
                            <span className="truncate">{resource.fileName}</span>
                          </span>
                          <span className="text-[11px] text-muted font-mono shrink-0">
                            {resource.fileSizeFormatted || "Fichier joint"}
                          </span>
                        </div>
                      )}

                      {/* Card Footer: Metrics and action */}
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 text-xs text-muted font-mono">
                          <span className="flex items-center gap-1">
                            <Eye size={13} className="text-accent" />
                            <span className="tabular-nums font-semibold text-text">0</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Download size={13} className="text-blue-400" />
                            <span className="tabular-nums font-semibold text-text">0</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={handleTestDownload}
                            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-bg/80 text-muted hover:border-accent hover:text-accent transition-colors"
                            title="Tester le téléchargement"
                          >
                            <Download size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab("reader")}
                            className="inline-flex items-center gap-1 rounded-xl bg-accent text-black font-bold px-3 py-1.5 text-xs hover:brightness-105 transition-all shadow-sm"
                          >
                            <span>Consulter</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* =========================================================
                 2. PREVIEW: FULL INTERACTIVE READER MODAL VIEW
                 ========================================================= */
              <div className="space-y-6">
                {/* Visual Cover Section */}
                <div
                  className="rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-white/10"
                  style={{ backgroundColor: resource.coverColor || "#0f2b48" }}
                >
                  <div className="relative z-10 flex flex-col gap-4 text-white">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-white/20 px-2.5 py-1 text-xs font-mono font-bold tracking-wider uppercase text-white backdrop-blur-sm">
                        {resource.badge}
                      </span>
                      <span className="text-xs text-white/80 font-medium">
                        Apprentissage Boosté · by Hilarus
                      </span>
                    </div>

                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-sm">
                      {resource.title}
                    </h1>

                    <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
                      {resource.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/80 font-mono">
                      <span>{resource.readTime}</span>
                      <span>·</span>
                      <span>Catégorie : {resource.category}</span>
                      <span>·</span>
                      <span>Format : {resource.type.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
                </div>

                {/* Attached File Preview Card */}
                {(resource.fileName || resource.fileDataUrl || resource.fileUrl) && (
                  <div className="rounded-2xl border border-accent/40 bg-surface p-5 sm:p-6 space-y-4 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 text-accent shadow-sm">
                          {resource.type === "pdf" ? (
                            <FileText size={24} />
                          ) : resource.type === "image" ? (
                            <ImageIcon size={24} />
                          ) : resource.type === "file" ? (
                            <FileCode size={24} />
                          ) : (
                            <FileCheck size={24} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-text text-sm sm:text-base">
                              {resource.fileName || "Document de la ressource"}
                            </span>
                            <span className="rounded-md bg-accent/10 border border-accent/20 px-2 py-0.5 font-mono text-[10px] font-bold text-accent uppercase">
                              {resource.type}
                            </span>
                          </div>
                          <p className="text-xs text-muted font-mono mt-0.5">
                            {resource.fileSizeFormatted ? `Taille : ${resource.fileSizeFormatted}` : "Fichier prêt pour le téléchargement"}
                            {resource.fileType ? ` · ${resource.fileType}` : ""}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleTestDownload}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-black font-bold px-4 py-2 text-xs hover:brightness-105 transition-all shadow-sm shrink-0"
                      >
                        <Download size={14} className="text-black" />
                        <span>Télécharger ce fichier (Test)</span>
                      </button>
                    </div>

                    {/* Image Preview if type is image */}
                    {resource.type === "image" && resource.fileDataUrl && (
                      <div className="rounded-xl border border-border bg-bg/80 p-2 overflow-hidden flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resource.fileDataUrl}
                          alt={resource.fileName || resource.title}
                          className="max-h-[380px] w-auto rounded-lg object-contain"
                        />
                      </div>
                    )}

                    {/* Text / Code Preview */}
                    {resource.fileContentText && (
                      <div className="rounded-xl border border-border bg-bg overflow-hidden text-xs">
                        <div className="px-4 py-2 border-b border-border bg-surface/60 text-muted font-mono flex items-center justify-between text-[11px]">
                          <span>Aperçu du contenu importé</span>
                          <span>{resource.fileName}</span>
                        </div>
                        <pre className="p-4 font-mono text-text/90 overflow-x-auto max-h-[300px] leading-relaxed">
                          <code>{resource.fileContentText}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Objectives */}
                {resource.objectives && resource.objectives.length > 0 && (
                  <div className="rounded-2xl border border-border bg-bg/60 p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                      <Sparkles size={15} />
                      <span>Objectifs de la Ressource</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-text font-medium">
                      {resource.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent text-[11px] font-bold mt-0.5">
                            {i + 1}
                          </span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Course Modules & Sections */}
                {resource.sections && resource.sections.length > 0 && (
                  <div className="space-y-6">
                    {resource.sections.map((sec) => (
                      <div
                        key={sec.id}
                        className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-4"
                      >
                        <div className="flex items-center gap-2 text-xs font-mono text-accent font-semibold">
                          <span>{sec.themeNumber}</span>
                        </div>

                        <h3 className="font-display text-lg sm:text-xl font-bold text-text">
                          {sec.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-text/90 leading-relaxed whitespace-pre-line">
                          {sec.description}
                        </p>

                        {sec.keyPoints && sec.keyPoints.length > 0 && (
                          <div className="space-y-2 pt-1">
                            <span className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                              Points clés :
                            </span>
                            <ul className="space-y-1.5 text-xs sm:text-sm text-text/90">
                              {sec.keyPoints.map((pt, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2">
                                  <span className="text-accent mt-0.5">▪</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Confirmation Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-border bg-bg/90 backdrop-blur-md sticky bottom-0 z-30">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-surface text-muted hover:text-text text-xs font-medium transition-colors"
            >
              ✏️ Revenir au formulaire d&apos;édition
            </button>

            <button
              type="button"
              disabled={isPublishing}
              onClick={onConfirmPublish}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-black font-bold text-xs hover:brightness-105 transition-all shadow-md disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <Loader2 size={14} className="animate-spin text-black" />
                  <span>Publication en cours...</span>
                </>
              ) : (
                <>
                  <Send size={14} className="text-black" />
                  <span>Confirmer et Publier la ressource</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
