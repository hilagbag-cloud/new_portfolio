"use client";

import { useState } from "react";
import { Download, Smartphone, Share, PlusSquare, X, Check, Laptop } from "lucide-react";
import { usePWAInstall } from "@/lib/usePWAInstall";

interface PWAInstallButtonProps {
  variant?: "header" | "compact" | "banner";
  className?: string;
}

export function PWAInstallButton({ variant = "compact", className = "" }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running inside installed standalone PWA, hide install triggers
  if (isInstalled) {
    return null;
  }

  // Not installable on this browser and not iOS Safari
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleAction = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAction}
        className={`group inline-flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-black transition-all active:scale-95 shadow-sm ${className}`}
        title={isIOS ? "Installer l'application sur iPhone / iPad" : "Installer l'application sur votre appareil"}
      >
        {justInstalled ? (
          <>
            <Check size={13} className="text-black" />
            <span className="font-bold">App Installée !</span>
          </>
        ) : isIOS ? (
          <>
            <Smartphone size={13} className="group-hover:text-black transition-colors" />
            <span>Installer l&apos;App</span>
          </>
        ) : (
          <>
            <Download size={13} className="group-hover:text-black transition-colors" />
            <span>Installer l&apos;App</span>
          </>
        )}
      </button>

      {/* iOS Safari Guided Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-5 text-text"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 border border-accent/30 text-accent font-display font-bold text-lg">
                  H.
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-text">
                    Installer sur iPhone / iPad
                  </h3>
                  <p className="text-xs text-muted">
                    Accès ultra rapide et mode hors-ligne
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="rounded-xl p-1.5 text-muted hover:text-text hover:bg-surface-elevated transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-muted">
              <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-bg/50 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface border border-border text-accent">
                  <Share size={14} />
                </div>
                <div>
                  <strong className="text-text block font-semibold">1. Bouton Partager</strong>
                  Appuyez sur l&apos;icône <strong>Partager</strong> en bas de votre écran dans Safari.
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-bg/50 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface border border-border text-accent">
                  <PlusSquare size={14} />
                </div>
                <div>
                  <strong className="text-text block font-semibold">2. Sur l&apos;écran d&apos;accueil</strong>
                  Faites défiler la liste vers le bas et touchez <strong>« Sur l&apos;écran d&apos;accueil »</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border/80 bg-bg/50 p-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-black font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-text block font-semibold">3. Valider « Ajouter »</strong>
                  Touchez <strong>Ajouter</strong> en haut à droite. L&apos;icône Hilarus apparaîtra sur votre écran d&apos;accueil !
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-xl bg-accent text-black font-bold py-2.5 text-xs hover:brightness-105 transition-all shadow-sm"
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </>
  );
}
