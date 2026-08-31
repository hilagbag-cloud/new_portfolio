"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Eye,
  Check,
  Sparkles,
  RefreshCw,
  Sliders,
  FlipHorizontal,
  Maximize2,
} from "lucide-react";

interface HeroImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onSave: (croppedDataUrl: string) => void;
}

export function HeroImageStudioModal({
  isOpen,
  onClose,
  imageUrl,
  onSave,
}: HeroImageStudioModalProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [previewMode, setPreviewMode] = useState<"hero" | "circle" | "canvas">("hero");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset adjustments on open or new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setIsFlipped(false);
    }
  }, [isOpen, imageUrl]);

  // Handle Mouse Drag for Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(0.5, prev + zoomDelta), 3.5));
  };

  // Touch Support for Mobile
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    } else if (e.touches.length === 2 && touchDistance !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / touchDistance;
      setZoom((prev) => Math.min(Math.max(0.5, prev * factor), 3.5));
      setTouchDistance(dist);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(null);
  };

  // Export cropped canvas
  const handleConfirmAndExport = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High-resolution canvas output (1400x1400)
    const exportSize = 1400;
    canvas.width = exportSize;
    canvas.height = exportSize;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, exportSize, exportSize);

      ctx.save();
      // Move to center of canvas
      ctx.translate(exportSize / 2, exportSize / 2);

      // Apply Pan (normalized to 360px preview container)
      const scaleMultiplier = exportSize / 360;
      ctx.translate(position.x * scaleMultiplier, position.y * scaleMultiplier);

      // Apply Rotation
      ctx.rotate((rotation * Math.PI) / 180);

      // Apply Flip
      if (isFlipped) {
        ctx.scale(-1, 1);
      }

      // Apply Zoom
      ctx.scale(zoom, zoom);

      // Draw image centered
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW = exportSize;
      let drawH = exportSize;
      if (imgAspect > 1) {
        drawW = exportSize * imgAspect;
      } else {
        drawH = exportSize / imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // Export as optimized WebP or PNG (if transparent), fallback to JPEG
      if (imageUrl.startsWith("data:image/png") || imageUrl.endsWith(".png")) {
        try {
          const pngUrl = canvas.toDataURL("image/png");
          if (pngUrl.length < 4.5 * 1024 * 1024) {
            onSave(pngUrl);
            onClose();
            return;
          }
        } catch {
          // fallback to webp
        }
      }

      try {
        const dataUrl = canvas.toDataURL("image/webp", 0.95);
        if (dataUrl.startsWith("data:image/webp")) {
          onSave(dataUrl);
          onClose();
          return;
        }
      } catch {
        // fallback
      }

      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      onSave(dataUrl);
      onClose();
    };
    img.src = imageUrl;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hero-studio-title"
    >
      <div className="relative w-full max-w-4xl rounded-3xl border border-border bg-[#0b0e0c] shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-5 sm:px-7 py-4 bg-surface/50">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/15 text-accent border border-accent/30">
              <Sliders size={16} />
            </span>
            <div>
              <h3 id="hero-studio-title" className="font-display text-lg text-text">
                Studio Recadrage & Zoom Photo Hero
              </h3>
              <p className="text-xs text-muted">
                Ajustez le zoom, le cadrage et visualisez en direct le rendu sur l&apos;accueil
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-surface p-2 text-muted hover:text-text hover:border-accent/40 focus-ring"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Studio Workspace */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* LEFT: Interactive Cropping Stage */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Viewport Box */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-[280px] sm:w-[360px] aspect-square rounded-2xl border-2 border-dashed border-accent/40 bg-black/60 overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl flex items-center justify-center group"
            >
              {/* Image with transforms */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Édition en cours"
                draggable={false}
                className="max-w-none pointer-events-none transition-transform ease-out"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom}) scaleX(${isFlipped ? -1 : 1})`,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />

              {/* Grid Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10 opacity-30">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div />
              </div>

              {/* Circular framing guide */}
              <div className="absolute inset-2 pointer-events-none rounded-full border border-accent/30 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]" />

              {/* Floating Helper */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-muted border border-white/10 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <Move size={10} className="text-accent" />
                <span>Glissez pour déplacer • Molette pour zoomer</span>
              </div>
            </div>

            {/* Controls Bar under stage */}
            <div className="w-full max-w-[360px] mt-4 space-y-3">
              {/* Zoom Slider */}
              <div className="flex items-center gap-3 bg-surface/60 border border-border px-3.5 py-2 rounded-xl">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
                  className="text-muted hover:text-accent p-1 focus-ring"
                  title="Zoom arrière"
                >
                  <ZoomOut size={16} />
                </button>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-accent cursor-pointer h-1.5 bg-border rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.15))}
                  className="text-muted hover:text-accent p-1 focus-ring"
                  title="Zoom avant"
                >
                  <ZoomIn size={16} />
                </button>
                <span className="font-mono text-xs text-accent min-w-[3rem] text-right font-semibold">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              {/* Quick Actions (Rotate, Flip, Center) */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 py-2 text-xs font-mono text-text hover:border-accent/40 hover:text-accent transition-colors focus-ring"
                >
                  <RotateCw size={13} />
                  <span>90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFlipped((f) => !f)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-mono transition-colors focus-ring ${
                    isFlipped
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-surface text-text hover:border-accent/40 hover:text-accent"
                  }`}
                >
                  <FlipHorizontal size={13} />
                  <span>Miroir</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPosition({ x: 0, y: 0 });
                    setZoom(1);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 py-2 text-xs font-mono text-text hover:border-accent/40 hover:text-accent transition-colors focus-ring"
                >
                  <RefreshCw size={13} />
                  <span>Centrer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPosition({ x: 0, y: 0 });
                    setZoom(1.4);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 py-2 text-xs font-mono text-text hover:border-accent/40 hover:text-accent transition-colors focus-ring"
                >
                  <Maximize2 size={13} />
                  <span>Portrait</span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Preview Modes (Hero Halo vs Circle vs Card) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-accent" />
                <span className="eyebrow text-xs text-text font-semibold">Aperçu en direct</span>
              </div>

              {/* Tabs */}
              <div className="flex rounded-lg border border-border bg-surface p-0.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setPreviewMode("hero")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    previewMode === "hero" ? "bg-accent text-bg font-bold" : "text-muted hover:text-text"
                  }`}
                >
                  Halo Hero
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("circle")}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    previewMode === "circle" ? "bg-accent text-bg font-bold" : "text-muted hover:text-text"
                  }`}
                >
                  Cercle
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="relative aspect-[4/3] w-full rounded-2xl border border-border/80 bg-[#080a09] overflow-hidden flex flex-col items-center justify-center p-4">
              {previewMode === "hero" ? (
                /* HERO SIMULATOR */
                <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                  {/* Mock Background Glow */}
                  <div className="absolute w-[200px] aspect-square rounded-full bg-gradient-to-b from-[#bcf66a] via-[#84df25] to-[#2c6109] opacity-75 blur-[50px] pointer-events-none" />

                  {/* Mock HILARUS */}
                  <span className="font-display text-2xl sm:text-3xl text-white/90 uppercase tracking-tight z-10 select-none">
                    HILARUS
                  </span>

                  {/* Cropped Image in Halo */}
                  <div className="relative -my-3 z-20 w-[120px] aspect-square rounded-full overflow-hidden border-2 border-accent/60 shadow-[0_0_25px_rgba(168,243,90,0.4)] bg-black/60 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Aperçu Hero"
                      className="max-w-none"
                      style={{
                        transform: `translate(${position.x * 0.33}px, ${position.y * 0.33}px) rotate(${rotation}deg) scale(${zoom}) scaleX(${isFlipped ? -1 : 1})`,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  {/* Mock GBAGOULE */}
                  <span className="font-display text-2xl sm:text-3xl text-accent uppercase tracking-tight z-10 select-none">
                    GBAGOULE
                  </span>
                </div>
              ) : (
                /* CIRCLE / AVATAR SIMULATOR */
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-accent/80 shadow-[0_0_20px_rgba(168,243,90,0.3)] bg-black flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="Aperçu Cercle"
                      className="max-w-none"
                      style={{
                        transform: `translate(${position.x * 0.31}px, ${position.y * 0.31}px) rotate(${rotation}deg) scale(${zoom}) scaleX(${isFlipped ? -1 : 1})`,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-muted">Aperçu Photo Profil / Badge</span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-white/5 bg-surface/40 p-3 text-[11px] font-mono text-muted space-y-1">
              <p className="flex items-center gap-1.5 text-text font-semibold">
                <Sparkles size={12} className="text-accent" />
                <span>Rendu haute résolution</span>
              </p>
              <p>
                L&apos;image sera exportée au format WebP optimisé (800×800) et synchronisée instantanément avec votre portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden Canvas for High-Res Processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border/80 px-5 sm:px-7 py-4 bg-surface/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-mono text-muted hover:text-text focus-ring"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleConfirmAndExport}
            className="btn-skew !py-2.5 !px-5 !text-xs !bg-accent !text-bg !border-accent hover:!bg-accent/90 focus-ring font-bold shadow-lg"
          >
            <Check size={14} strokeWidth={2.5} />
            <span>Valider & Publier la photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
