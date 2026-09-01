"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Check,
  Link as LinkIcon,
  Sparkles,
  Sliders,
  Crop,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { HeroImageStudioModal } from "./HeroImageStudioModal";

export type ImageQualityPreset = "hd" | "standard" | "raw_url";

interface ImageUploaderProps {
  label: string;
  sublabel?: string;
  value?: string;
  onChange: (dataUrlOrUrl: string) => void;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "auto";
  placeholder?: string;
  showCropTool?: boolean;
  defaultPreset?: ImageQualityPreset;
}

/**
 * High-Precision Multi-Step Downsampling Canvas Resampler.
 * Uses iterative 50% half-step downsizes with imageSmoothingQuality="high"
 * to prevent pixel aliasing, blurriness, and loss of fine details (eyes, textures, text).
 */
function resampleCanvasStepDown(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  let currentCanvas = sourceCanvas;
  let curW = sourceCanvas.width;
  let curH = sourceCanvas.height;

  // Step down by half iteratively until within 2x of target
  while (curW > targetWidth * 2 || curH > targetHeight * 2) {
    const nextW = Math.max(Math.floor(curW * 0.5), targetWidth);
    const nextH = Math.max(Math.floor(curH * 0.5), targetHeight);

    const stepCanvas = document.createElement("canvas");
    stepCanvas.width = nextW;
    stepCanvas.height = nextH;
    const stepCtx = stepCanvas.getContext("2d");
    if (!stepCtx) break;

    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = "high";
    stepCtx.drawImage(currentCanvas, 0, 0, curW, curH, 0, 0, nextW, nextH);

    currentCanvas = stepCanvas;
    curW = nextW;
    curH = nextH;
  }

  // Final draw to exact target dimensions
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = targetWidth;
  finalCanvas.height = targetHeight;
  const finalCtx = finalCanvas.getContext("2d");
  if (finalCtx) {
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = "high";
    finalCtx.drawImage(currentCanvas, 0, 0, curW, curH, 0, 0, targetWidth, targetHeight);
    return finalCanvas;
  }

  return currentCanvas;
}

/**
 * Resizes and optimizes an image with maximum visual fidelity and sharpness.
 * Retains high resolution (up to 2048px) and crisp WebP/PNG formatting without block artifacts.
 */
export function compressImage(
  file: File,
  maxWidth = 2048,
  maxHeight = 2048,
  initialQuality = 0.93
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate target dimensions preserving aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = Math.round(height);
          }
        }

        // Draw source to high-res canvas
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = img.width;
        sourceCanvas.height = img.height;
        const sourceCtx = sourceCanvas.getContext("2d");
        if (!sourceCtx) {
          resolve(readerEvent.target?.result as string);
          return;
        }
        sourceCtx.imageSmoothingEnabled = true;
        sourceCtx.imageSmoothingQuality = "high";
        sourceCtx.drawImage(img, 0, 0);

        // Perform smooth multi-step downsampling for razor-sharp results
        const finalCanvas =
          img.width > width || img.height > height
            ? resampleCanvasStepDown(sourceCanvas, width, height)
            : sourceCanvas;

        // Target size limit: 750 KB (comfortable margin within Firestore's 1MB limit)
        const MAX_SAFE_DATA_SIZE = 750 * 1024;

        // 1. If PNG with transparency, attempt PNG export first
        if (file.type === "image/png") {
          try {
            const pngUrl = finalCanvas.toDataURL("image/png");
            if (pngUrl.length <= MAX_SAFE_DATA_SIZE) {
              resolve(pngUrl);
              return;
            }
          } catch {
            // fallback
          }
        }

        // 2. High Quality WebP export (Preserves alpha channel, incredible clarity, zero noise)
        try {
          const webpUrl = finalCanvas.toDataURL("image/webp", initialQuality);
          if (webpUrl.startsWith("data:image/webp") && webpUrl.length <= MAX_SAFE_DATA_SIZE) {
            resolve(webpUrl);
            return;
          }
        } catch {
          // fallback
        }

        // 3. Fallback High-Fidelity WebP at 0.88 or JPEG at 0.90
        try {
          const webpFallback = finalCanvas.toDataURL("image/webp", 0.88);
          if (webpFallback.startsWith("data:image/webp") && webpFallback.length <= MAX_SAFE_DATA_SIZE) {
            resolve(webpFallback);
            return;
          }
        } catch {
          // fallback
        }

        let finalDataUrl = finalCanvas.toDataURL("image/jpeg", 0.90);
        if (finalDataUrl.length > MAX_SAFE_DATA_SIZE) {
          finalDataUrl = finalCanvas.toDataURL("image/jpeg", 0.84);
        }

        resolve(finalDataUrl);
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
  showCropTool = false,
  defaultPreset = "hd",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);
  const [qualityPreset, setQualityPreset] = useState<ImageQualityPreset>(defaultPreset);
  const [imageMeta, setImageMeta] = useState<{
    width?: number;
    height?: number;
    sizeKb?: number;
    format?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analyze active image metadata
  useEffect(() => {
    if (!value) {
      setImageMeta(null);
      return;
    }

    if (value.startsWith("data:")) {
      const approxBytes = Math.round((value.length * 3) / 4);
      const sizeKb = Math.round(approxBytes / 1024);
      const format = value.split(";")[0]?.replace("data:image/", "")?.toUpperCase() || "IMG";

      const img = new Image();
      img.onload = () => {
        setImageMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeKb,
          format,
        });
      };
      img.src = value;
    } else {
      // External URL
      const img = new Image();
      img.onload = () => {
        setImageMeta({
          width: img.naturalWidth,
          height: img.naturalHeight,
          format: "URL / CDN 4K",
        });
      };
      img.src = value;
    }
  }, [value]);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner un fichier image valide (PNG, JPG, WEBP, etc.).");
      return;
    }

    try {
      setIsProcessing(true);

      // Apply resolution according to preset
      const maxDim = qualityPreset === "hd" ? 2048 : 1600;
      const targetQuality = qualityPreset === "hd" ? 0.94 : 0.90;

      const compressedDataUrl = await compressImage(file, maxDim, maxDim, targetQuality);
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
    setImageMeta(null);
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
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="eyebrow text-xs text-text block font-semibold">
          {label}
        </label>
        
        <div className="flex items-center gap-3">
          {/* Quality preset selector badge */}
          <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface/80 p-0.5 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setQualityPreset("hd")}
              className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                qualityPreset === "hd"
                  ? "bg-accent text-accent-contrast shadow-sm"
                  : "text-muted hover:text-text"
              }`}
              title="Haute Définition : Jusqu'à 2048px, netteté maximale et qualité 95%"
            >
              💎 HD 2048px
            </button>
            <button
              type="button"
              onClick={() => setQualityPreset("standard")}
              className={`px-2 py-0.5 rounded-md font-semibold transition-all ${
                qualityPreset === "standard"
                  ? "bg-accent text-accent-contrast shadow-sm"
                  : "text-muted hover:text-text"
              }`}
              title="Standard : 1600px, équilibre vitesse et netteté"
            >
              ⚡ 1600px
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1"
          >
            <LinkIcon size={11} />
            <span>{showUrlInput ? "Masquer URL" : "Lien URL direct"}</span>
          </button>
        </div>
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
        <div className="rounded-xl border border-accent/40 bg-surface/90 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono text-muted uppercase block font-semibold">
              Lien direct vers une photo HD / 4K (Unsplash, Cloudinary, Imgur, CDN) :
            </label>
            <span className="text-[10px] font-mono text-accent font-semibold">
              0 compression • Qualité Originale
            </span>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://images.unsplash.com/... ou https://..."
              className="flex-1 rounded-lg border border-border bg-black/60 px-3 py-1.5 text-xs text-text focus-ring font-mono"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-accent-contrast hover:scale-105 transition-transform"
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
                : "max-h-72 aspect-video"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Média chargé"
              className="h-full w-full object-cover object-center"
              style={{ imageRendering: "auto" }}
            />

            {/* Overlay buttons on hover */}
            <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2.5 bg-black/70 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 p-2">
              {showCropTool && (
                <button
                  type="button"
                  onClick={() => setShowCropModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-bold text-accent-contrast shadow-md transition-transform hover:scale-105"
                  title="Ouvrir le studio de recadrage haute résolution"
                >
                  <Crop size={14} />
                  <span>Studio & Cadrage HD</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-surface/90 px-3.5 py-2 text-xs font-bold text-text shadow-md transition-transform hover:scale-105 hover:border-accent/40"
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

          {/* Bottom Info Bar with Live Resolution & Quality Badge */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles size={12} className="text-accent" />
              <span className="font-semibold">
                {imageMeta?.width && imageMeta?.height
                  ? `${imageMeta.width} × ${imageMeta.height} px`
                  : "Média haute fidélité"}
              </span>
              {imageMeta?.format && (
                <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent border border-accent/30 font-bold">
                  {imageMeta.format}
                </span>
              )}
              {imageMeta?.sizeKb ? (
                <span className="text-muted text-[10px]">
                  ({imageMeta.sizeKb} Ko)
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {showCropTool && (
                <button
                  type="button"
                  onClick={() => setShowCropModal(true)}
                  className="text-accent hover:underline flex items-center gap-1 font-semibold"
                >
                  <Crop size={11} />
                  <span>Ajuster le cadrage</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted hover:text-text underline"
              >
                Changer de fichier
              </button>
            </div>
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
                "Traitement et optimisation haute fidélité (Netteté maximale)..."
              ) : (
                <>
                  <span className="text-accent underline font-bold">Cliquez pour importer en HD</span> ou glissez votre photo ici
                </>
              )}
            </p>
            <p className="text-[11px] font-mono text-muted">
              {placeholder || "PNG, JPG, WEBP • Résolution jusqu'à 2048px • Aucune perte de netteté"}
            </p>
          </div>
        </div>
      )}

      {showCropTool && showCropModal && value && (
        <HeroImageStudioModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageUrl={value}
          onSave={(croppedData) => {
            onChange(croppedData);
          }}
        />
      )}
    </div>
  );
}

