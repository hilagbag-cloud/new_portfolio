"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, Image as ImageIcon, X, Check, Link as LinkIcon, Sparkles } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (dataUrlOrUrl: string) => void;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
  placeholder?: string;
}

/**
 * Resizes and compresses an image file to an optimized Base64 data URL
 */
function compressImage(file: File, maxWidth = 1280, maxHeight = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Prefer image/webp if supported, fallback to jpeg
        try {
          const webpUrl = canvas.toDataURL("image/webp", quality);
          if (webpUrl.startsWith("data:image/webp")) {
            resolve(webpUrl);
            return;
          }
        } catch {
          // ignore
        }

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Impossible de lire l'image"));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  label,
  sublabel,
  value,
  onChange,
  aspectRatio = "16/9",
  placeholder,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide (PNG, JPG, WEBP, etc.).");
      return;
    }

    try {
      setIsProcessing(true);
      const compressedDataUrl = await compressImage(file);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error("Image processing error:", err);
      alert("Erreur lors du traitement de l'image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlDraft("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="eyebrow text-xs text-text block font-semibold">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
        >
          <LinkIcon size={11} />
          <span>{showUrlInput ? "Masquer URL" : "Ou coller une URL"}</span>
        </button>
      </div>

      {sublabel && <p className="text-[11px] text-muted">{sublabel}</p>}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* URL Drawer if user clicked the toggle */}
      {showUrlInput && (
        <div className="rounded-xl border border-white/10 bg-surface/80 p-3 space-y-2">
          <label className="text-[10px] font-mono text-muted uppercase block">
            Lien externe vers l&apos;image (ex: Unsplash ou CDN) :
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-border bg-black/60 px-3 py-1.5 text-xs text-text focus-ring font-mono"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-bg hover:scale-105 transition-transform"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}

      {/* Primary Visual Zone: Live Image or Drag-and-Drop Area */}
      {value ? (
        <div className="group relative overflow-hidden rounded-2xl border border-accent/40 bg-black/80 p-2 shadow-inner">
          <div
            className={`relative w-full overflow-hidden rounded-xl bg-surface/50 ${
              aspectRatio === "16/9"
                ? "aspect-[16/9]"
                : aspectRatio === "4/3"
                ? "aspect-[4/3]"
                : aspectRatio === "1/1"
                ? "aspect-square"
                : "max-h-64 aspect-video"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Média chargé"
              className="h-full w-full object-cover object-center"
            />

            {/* Overlay buttons on hover */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-bold text-bg shadow-md transition-transform hover:scale-105"
              >
                <UploadCloud size={14} />
                <span>Remplacer</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/50 bg-red-500/20 px-3.5 py-2 text-xs font-bold text-red-300 backdrop-blur-md hover:bg-red-500/40"
              >
                <X size={14} />
                <span>Supprimer</span>
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-1 text-[11px] font-mono text-muted">
            <span className="flex items-center gap-1 text-accent">
              <Check size={12} />
              <span>Média enregistré</span>
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-muted hover:text-text underline"
            >
              Changer de fichier
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-accent bg-accent/15 scale-[1.01]"
              : "border-white/15 bg-surface/30 hover:border-accent/50 hover:bg-surface/60"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/40 bg-accent/10 text-accent mb-3 group-hover:scale-110 transition-transform">
            {isProcessing ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            ) : (
              <UploadCloud size={24} />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-text">
              {isProcessing ? (
                "Traitement et optimisation de l'image..."
              ) : (
                <>
                  <span className="text-accent underline font-bold">Cliquez pour importer</span> ou glissez une image ici
                </>
              )}
            </p>
            <p className="text-[11px] font-mono text-muted">
              {placeholder || "PNG, JPG, WEBP, SVG • Compression et optimisation automatique"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
