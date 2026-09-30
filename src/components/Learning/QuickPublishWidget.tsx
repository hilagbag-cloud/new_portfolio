"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  FileCode,
  Image as ImageIcon,
  Book,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  X,
  FileUp,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { ResourceViewerModal } from "./ResourceViewerModal";
import type { LearningResource } from "@/data/learningResources";
import { generateResourceDetailsWithAI, type GeneratedResourceData } from "@/lib/ai-resource-generator";

export function QuickPublishWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGeneratedData, setAiGeneratedData] = useState<GeneratedResourceData | null>(null);
  const [aiStatus, setAiStatus] = useState<{
    type: "success" | "warning" | "info";
    message: string;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: number;
    sizeFormatted: string;
    type: string;
    dataUrl?: string;
    textContent?: string;
  } | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Programmation & Algorithmes");
  const [customError, setCustomError] = useState<string | null>(null);
  const [previewResource, setPreviewResource] = useState<LearningResource | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Octet";
    const k = 1024;
    const sizes = ["Octets", "Ko", "Mo", "Go"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleProcessFile = (file: File) => {
    setCustomError(null);
    if (!file) return;

    // Up to 50 MB allowed!
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setCustomError(
        `Ce fichier fait ${formatBytes(file.size)}. La limite directe est de 50 Mo. Pour les fichiers encore plus volumineux, vous pouvez renseigner un lien direct (Drive, GitHub, etc.) lors de la publication.`
      );
      return;
    }

    const sizeFormatted = formatBytes(file.size);
    const ext = file.name.split(".").pop()?.toLowerCase() || "";

    // Suggested title from file name
    const rawName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const cleanTitle = rawName
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    setTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));

    // Suggested category
    if (["c", "h", "py", "js", "ts", "cpp", "sh"].includes(ext)) {
      setCategory("Programmation C & Algorithmes");
    } else if (["epub", "mobi"].includes(ext)) {
      setCategory("Ouvrages & Guides Numériques");
    } else if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) {
      setCategory("Design & Architecture Visuelle");
    }

    const reader = new FileReader();
    if (["txt", "md", "c", "h", "py", "js", "ts", "json"].includes(ext)) {
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setSelectedFile({
          name: file.name,
          size: file.size,
          sizeFormatted,
          type: file.type || ext,
          textContent: text,
        });
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSelectedFile({
          name: file.name,
          size: file.size,
          sizeFormatted,
          type: file.type || ext,
          dataUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleAiAutoFillQuick = async () => {
    if (!selectedFile) return;
    setIsAiGenerating(true);
    setAiStatus(null);
    try {
      const res = await generateResourceDetailsWithAI({
        filename: selectedFile.name,
        fileType: selectedFile.type,
        textContent: selectedFile.textContent,
        existingTitle: title,
      });

      if (res.data) {
        setAiGeneratedData(res.data);
        setTitle(res.data.title);
        setCategory(res.data.category);
      }

      if (res.source === "gemini") {
        setAiStatus({
          type: "success",
          message: "✨ Fiche analysée et générée avec succès par Gemini 3.8 Flash !",
        });
      } else if (res.quotaExceeded) {
        setAiStatus({
          type: "warning",
          message: "⚡ Quota API Gemini atteint : l'analyseur intelligent a structuré les détails sans bloquer votre publication.",
        });
      } else {
        setAiStatus({
          type: "info",
          message: res.message || "Détails générés avec succès.",
        });
      }
    } catch (err) {
      console.error("Quick AI auto fill error:", err);
      setAiStatus({
        type: "warning",
        message: "Erreur lors de l'analyse, valeurs conservées.",
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleGoToPublish = () => {
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    let resourceType: "pdf" | "book" | "file" | "text" | "image" = "pdf";
    let badge = "PDF · COURS";

    if (["pdf"].includes(ext)) {
      resourceType = "pdf";
      badge = "PDF · COURS";
    } else if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) {
      resourceType = "image";
      badge = "SCHÉMA · INFOGRAPHIE";
    } else if (["c", "h", "py", "js", "ts", "json", "sh"].includes(ext)) {
      resourceType = "file";
      badge = `${ext.toUpperCase()} · CODE & PROJET`;
    } else if (["epub", "mobi"].includes(ext)) {
      resourceType = "book";
      badge = "LIVRE · EBOOK";
    } else if (["txt", "md"].includes(ext)) {
      resourceType = "text";
      badge = "GUIDE · DOCUMENT";
    }

    const stagedPayload = {
      title: title.trim() || aiGeneratedData?.title || selectedFile.name,
      subtitle: aiGeneratedData?.subtitle || `Document et support : ${selectedFile.name}`,
      miniDescription:
        aiGeneratedData?.miniDescription ||
        `Support d'apprentissage complet (${selectedFile.sizeFormatted}) prêt à l'étude et au téléchargement libre.`,
      category: category || aiGeneratedData?.category || "Programmation C & Algorithmes",
      type: aiGeneratedData?.type || resourceType,
      badge: aiGeneratedData?.badge || badge,
      coverColor: aiGeneratedData?.coverColor || "#0f2b48",
      readTime: aiGeneratedData?.readTime || "15 min de lecture",
      objectivesText: aiGeneratedData?.objectives ? aiGeneratedData.objectives.join("\n") : undefined,
      detailedContent: aiGeneratedData?.detailedSummary || undefined,
      uploadedFile: selectedFile,
    };

    try {
      sessionStorage.setItem("staged_learning_resource_file", JSON.stringify(stagedPayload));
    } catch (e) {
      console.warn("sessionStorage warning:", e);
    }

    router.push("/admin?tab=learning&action=publish");
  };

  const handlePreviewDirectly = () => {
    if (!selectedFile) return;
    const tempRes: LearningResource = {
      id: "preview-temp",
      title: title.trim() || aiGeneratedData?.title || selectedFile.name,
      subtitle: aiGeneratedData?.subtitle || `Document joint : ${selectedFile.name}`,
      miniDescription:
        aiGeneratedData?.miniDescription ||
        `Prévisualisation immédiate du document ${selectedFile.name} (${selectedFile.sizeFormatted}).`,
      category: category || aiGeneratedData?.category || "Programmation & Algorithmes",
      type: (aiGeneratedData?.type as any) || (selectedFile.name.endsWith(".pdf") ? "pdf" : "file"),
      coverColor: aiGeneratedData?.coverColor || "#0f2b48",
      badge: aiGeneratedData?.badge || "APERÇU FICHIER",
      readTime: aiGeneratedData?.readTime || "Accès direct",
      viewsCount: 1,
      downloadCount: 0,
      published: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileSizeFormatted: selectedFile.sizeFormatted,
      fileType: selectedFile.type,
      fileDataUrl: selectedFile.dataUrl,
      fileContentText: selectedFile.textContent,
      objectives: aiGeneratedData?.objectives,
      sections: [
        {
          id: "sec-1",
          themeNumber: "Module 1",
          title: aiGeneratedData?.subtitle || "Aperçu du contenu importé",
          description:
            aiGeneratedData?.detailedSummary ||
            aiGeneratedData?.miniDescription ||
            "Ce document est prêt pour être publié dans le catalogue de ressources libres.",
          keyPoints: aiGeneratedData?.objectives,
          codeSnippet: selectedFile.textContent
            ? {
                title: selectedFile.name,
                language: selectedFile.name.split(".").pop() || "txt",
                code: selectedFile.textContent,
              }
            : undefined,
        },
      ],
    };
    setPreviewResource(tempRes);
  };

  return (
    <div className="w-full">
      {/* Toggle button if closed */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group inline-flex items-center gap-2 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-xs font-semibold text-accent hover:bg-accent hover:text-black transition-all shadow-sm active:scale-95"
        >
          <FileUp size={15} className="group-hover:text-black transition-colors" />
          <span>Ouvrir un PDF & Publier une ressource</span>
          <span className="rounded bg-accent/20 group-hover:bg-black/20 px-1.5 py-0.5 text-[10px] font-mono">
            Jusqu&apos;à 50 Mo
          </span>
        </button>
      ) : (
        /* Expanded Quick Publish Card */
        <div className="rounded-3xl border border-accent/40 bg-surface/90 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-black font-bold">
                <FileUp size={18} />
              </div>
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-text flex items-center gap-2">
                  <span>Widget de Publication Rapide</span>
                  <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
                    Limite étendue : 50 Mo
                  </span>
                </h3>
                <p className="text-xs text-muted">
                  Ouvrez un PDF ou document pour créer instantanément une nouvelle ressource.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSelectedFile(null);
                setCustomError(null);
              }}
              aria-label="Fermer le widget"
              className="rounded-xl p-1.5 text-muted hover:text-text hover:bg-surface-elevated transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Drag & Drop Zone */}
          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-accent bg-accent/15 scale-[1.01]"
                  : "border-border hover:border-accent/60 bg-bg/40 hover:bg-surface-elevated/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.epub,.mobi,.txt,.md,.c,.h,.py,.js,.ts,.json,.png,.jpg,.jpeg,.webp,.docx,.doc,.zip"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProcessFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                <UploadCloud size={24} />
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-text">
                  Glissez-déposez votre <span className="text-accent">PDF</span> ou document ici
                </p>
                <p className="text-[11px] text-muted font-mono">
                  ou cliquez pour sélectionner un fichier (.pdf, .epub, .c, .py, .md, images)
                </p>
              </div>

              <span className="rounded-full border border-border/80 bg-surface px-3 py-1 font-mono text-[10px] text-muted">
                Taille maximale acceptée : 50 Mo
              </span>
            </div>
          ) : (
            /* Selected File Details & Quick Form */
            <div className="space-y-4 rounded-2xl border border-accent/30 bg-bg/60 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
                    {selectedFile.name.endsWith(".pdf") ? (
                      <FileText size={20} />
                    ) : ["c", "h", "py", "js", "ts"].some((ext) => selectedFile.name.endsWith(ext)) ? (
                      <FileCode size={20} />
                    ) : (
                      <Book size={20} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-text truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-muted font-mono">
                      {selectedFile.sizeFormatted} · Prêt pour publication
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded-lg p-1.5 text-muted hover:text-text hover:bg-surface transition-colors"
                  title="Changer de fichier"
                >
                  <X size={15} />
                </button>
              </div>

              {/* AI Auto-Fill Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border border-accent/40 bg-accent/10">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-black font-bold">
                    <Sparkles size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-text">
                        Analyser avec l&apos;IA (Gemini 3.8 Flash)
                      </span>
                      <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[9px] font-mono text-accent font-bold">
                        Anti-Quota
                      </span>
                    </div>
                    <p className="text-[11px] text-muted truncate">
                      Extrait le titre, la catégorie, le résumé et les objectifs à partir du contenu
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAiAutoFillQuick}
                  disabled={isAiGenerating}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-accent text-black font-bold px-3 py-1.5 text-xs hover:brightness-105 transition-all shadow-sm shrink-0 disabled:opacity-60"
                >
                  {isAiGenerating ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-black" />
                      <span>Analyse...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      <span>Générer détails IA</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Status Feedback */}
              {aiStatus && (
                <div
                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                    aiStatus.type === "success"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : aiStatus.type === "warning"
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                      : "border-blue-500/40 bg-blue-500/10 text-blue-300"
                  }`}
                >
                  <Sparkles size={13} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{aiStatus.message}</span>
                </div>
              )}

              {/* Title & Category Quick Edit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted uppercase">Titre de la ressource</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre du cours ou livre"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-text focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted uppercase">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-text focus:border-accent focus:outline-none"
                  >
                    <option value="Programmation C & Algorithmes">Programmation C & Algorithmes</option>
                    <option value="Intelligence Artificielle & Data">Intelligence Artificielle & Data</option>
                    <option value="Systèmes & Réseaux">Systèmes & Réseaux</option>
                    <option value="Web & Architecture">Web & Architecture</option>
                    <option value="Ouvrages & Guides Numériques">Ouvrages & Guides Numériques</option>
                    <option value="Design & Architecture Visuelle">Design & Architecture Visuelle</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePreviewDirectly}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text hover:border-accent hover:text-accent transition-all"
                >
                  <Eye size={13} />
                  <span>Aperçu dans le lecteur</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoToPublish}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent text-black font-bold px-4 py-2 text-xs hover:brightness-105 transition-all shadow-sm active:scale-95"
                >
                  <span>Accéder à la publication (/admin)</span>
                  <ArrowRight size={14} className="text-black" />
                </button>
              </div>
            </div>
          )}

          {customError && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-400" />
              <span>{customError}</span>
            </div>
          )}
        </div>
      )}

      {/* Reader Preview Modal if requested */}
      {previewResource && (
        <ResourceViewerModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}
    </div>
  );
}
