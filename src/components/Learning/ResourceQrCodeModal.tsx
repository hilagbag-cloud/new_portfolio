"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  X,
  Sparkles,
  Smartphone,
  Eye,
} from "lucide-react";
import QRCode from "qrcode";
import type { LearningResource } from "@/data/learningResources";

interface Props {
  resource: LearningResource | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResourceQrCodeModal({ resource, isOpen, onClose }: Props) {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Compute live absolute sharing URL
  useEffect(() => {
    if (typeof window !== "undefined" && resource) {
      const origin = window.location.origin;
      setShareUrl(`${origin}/learning?res=${resource.id}`);
    }
  }, [resource]);

  // Generate QR code onto the canvas with branded colors and center badge
  const renderQrCode = useCallback(async () => {
    if (!qrCanvasRef.current || !shareUrl) return;
    setIsGenerating(true);

    try {
      const canvas = qrCanvasRef.current;
      const size = 320;
      canvas.width = size;
      canvas.height = size;

      // 1. Generate QR code on canvas with High error correction (level 'H' allows center logo)
      await QRCode.toCanvas(canvas, shareUrl, {
        width: size,
        margin: 2,
        errorCorrectionLevel: "H",
        color: {
          dark: "#a8f35a", // Brand Lime Accent
          light: "#080a09", // Brand Background
        },
      });

      // 2. Draw branded center logo badge "H."
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const center = size / 2;
        const logoSize = 64;
        const radius = 16;

        // Background squircle for the badge
        ctx.fillStyle = "#080a09";
        ctx.beginPath();
        ctx.roundRect(center - logoSize / 2, center - logoSize / 2, logoSize, logoSize, radius);
        ctx.fill();

        // Border
        ctx.strokeStyle = "#a8f35a";
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Logo Monogram "H."
        ctx.fillStyle = "#a8f35a";
        ctx.font = "900 32px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("H.", center, center + 2);
      }
    } catch (err) {
      console.error("QR Code generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [shareUrl]);

  useEffect(() => {
    if (isOpen && shareUrl) {
      renderQrCode();
    }
  }, [isOpen, shareUrl, renderQrCode]);

  if (!isOpen || !resource) return null;

  // Copy direct link to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.debug("Clipboard copy note:", e);
    }
  };

  // Native Web Share
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resource.title} — Apprentissage Boosté by Hilarus`,
          text: `Découvrez la ressource « ${resource.title} » sur la plateforme d'apprentissage libre d'Hilarus Gbagoule.`,
          url: shareUrl,
        });
      } catch (err) {
        console.debug("Web Share dismissed or failed:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Download raw QR code PNG
  const handleDownloadQrOnly = () => {
    if (!qrCanvasRef.current) return;
    const url = qrCanvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${resource.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download full branded share poster card (1080x1350px high-res)
  const handleDownloadBrandedPoster = async () => {
    if (!qrCanvasRef.current) return;

    const poster = document.createElement("canvas");
    const width = 1080;
    const height = 1380;
    poster.width = width;
    poster.height = height;
    const ctx = poster.getContext("2d");
    if (!ctx) return;

    // 1. Deep Dark Background with subtle gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, "#080a09");
    bgGradient.addColorStop(0.5, "#101411");
    bgGradient.addColorStop(1, "#080a09");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Top Header brand eyebrow
    ctx.fillStyle = "#a8f35a";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText("HILARUS GBAGOULE · APPRENTISSAGE BOOSTÉ", width / 2, 90);

    // 3. Category & Format Pill
    ctx.fillStyle = "rgba(168, 243, 90, 0.15)";
    ctx.strokeStyle = "rgba(168, 243, 90, 0.4)";
    ctx.lineWidth = 2;
    const badgeText = `${resource.badge} · ${resource.category.toUpperCase()}`;
    ctx.font = "bold 20px monospace";
    const textWidth = ctx.measureText(badgeText).width;
    const pillW = textWidth + 48;
    const pillH = 44;
    ctx.beginPath();
    ctx.roundRect((width - pillW) / 2, 125, pillW, pillH, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a8f35a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(badgeText, width / 2, 125 + pillH / 2);

    // 4. Resource Title (multi-line word wrap)
    ctx.fillStyle = "#f1f3ee";
    ctx.font = "bold 46px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const words = resource.title.split(" ");
    let line = "";
    let lineY = 205;
    const maxLineW = width - 140;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && n > 0) {
        ctx.fillText(line.trim(), width / 2, lineY);
        line = words[n] + " ";
        lineY += 60;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), width / 2, lineY);

    // 5. QR Code Card Container
    const qrBoxSize = 560;
    const qrBoxY = lineY + 90;
    ctx.fillStyle = "#0c100d";
    ctx.strokeStyle = "rgba(168, 243, 90, 0.5)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect((width - qrBoxSize) / 2, qrBoxY, qrBoxSize, qrBoxSize, 40);
    ctx.fill();
    ctx.stroke();

    // Draw QR from source canvas
    const qrInnerMargin = 40;
    const qrInnerSize = qrBoxSize - qrInnerMargin * 2;
    ctx.drawImage(
      qrCanvasRef.current,
      (width - qrInnerSize) / 2,
      qrBoxY + qrInnerMargin,
      qrInnerSize,
      qrInnerSize
    );

    // 6. Subtitle / Call to Action beneath QR Code
    const scanPromptY = qrBoxY + qrBoxSize + 55;
    ctx.fillStyle = "#a8f35a";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Scannez pour accéder immédiatement au document", width / 2, scanPromptY);

    ctx.fillStyle = "#8c958d";
    ctx.font = "22px sans-serif";
    ctx.fillText("Visionneuse interactive · Téléchargement libre & gratuit", width / 2, scanPromptY + 45);

    // 7. Footer URL
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 18px monospace";
    ctx.fillText(shareUrl, width / 2, height - 55);

    // Export to download
    const url = poster.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `partage-hilarus-${resource.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-accent/40 bg-surface p-6 sm:p-8 space-y-6 shadow-2xl relative text-text overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glow */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/15 blur-3xl -z-10"
          aria-hidden
        />

        {/* Modal Top Bar */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-black font-display font-black text-xl shadow-sm">
              <QrCode size={22} className="text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-text">
                  Partager par QR Code
                </h3>
                <span className="rounded bg-accent/15 px-2 py-0.5 text-[10px] font-mono font-bold text-accent">
                  Valide & Vérifié
                </span>
              </div>
              <p className="text-xs text-muted">
                Scan instantané pour accéder à la fiche et au document
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-xl p-1.5 text-muted hover:text-text hover:bg-surface-elevated transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Resource Meta Card */}
        <div className="rounded-2xl border border-border/80 bg-bg/60 p-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-muted">
            <span className="text-accent font-semibold">{resource.badge}</span>
            <span>{resource.readTime}</span>
          </div>
          <h4 className="font-display text-sm sm:text-base font-bold text-text line-clamp-2">
            {resource.title}
          </h4>
          <p className="text-xs text-muted line-clamp-1">{resource.category}</p>
        </div>

        {/* QR Code Presentation Stage */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative rounded-3xl border-2 border-accent/50 bg-[#080a09] p-4 sm:p-5 shadow-[0_0_30px_rgba(168,243,90,0.15)] flex flex-col items-center justify-center">
            <canvas ref={qrCanvasRef} className="rounded-xl max-w-full h-auto" />
            <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-accent/90">
              <Smartphone size={13} />
              <span>Scannez avec un appareil photo</span>
            </div>
          </div>
        </div>

        {/* Direct Link Input with 1-click Copy */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-muted uppercase">Lien direct de partage</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full rounded-xl border border-border bg-bg px-3.5 py-2 text-xs font-mono text-text/90 focus:outline-none select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 active:scale-95 ${
                copied
                  ? "bg-emerald-500 text-black shadow-sm"
                  : "bg-surface border border-border text-text hover:border-accent hover:text-accent"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons for Download and Native Share */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-border/80">
          <button
            type="button"
            onClick={handleDownloadBrandedPoster}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-black font-bold px-4 py-2.5 text-xs hover:brightness-105 transition-all shadow-sm active:scale-95"
            title="Télécharger l'affiche de partage complète haute définition"
          >
            <Download size={14} className="text-black" />
            <span>Affiche de Partage (HD)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadQrOnly}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-semibold text-text hover:border-accent hover:text-accent transition-colors"
              title="Télécharger le QR Code seul au format PNG"
            >
              <Download size={13} />
              <span>QR Code seul</span>
            </button>

            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-border bg-surface text-muted hover:text-accent hover:border-accent transition-colors"
              title="Partager sur les réseaux ou par message"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
