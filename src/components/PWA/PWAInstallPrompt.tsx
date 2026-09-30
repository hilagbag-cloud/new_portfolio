"use client";

import { useState } from "react";
import { Download, Smartphone, X, Sparkles } from "lucide-react";
import { usePWAInstall } from "@/lib/usePWAInstall";
import { PWAInstallButton } from "./PWAInstallButton";

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, isIOS, isDismissed, install, dismiss } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed or dismissed or not installable on this device/browser
  if (isInstalled || isDismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  return (
    <aside
      aria-label="Installation de l'application"
      className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-2xl border border-accent/40 bg-surface/95 p-4 shadow-xl backdrop-blur-md flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-black font-display font-black text-lg shadow-sm">
              H.
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-xs font-bold text-text">
                  Installer Hilarus App
                </h4>
                <span className="rounded bg-accent/15 px-1.5 py-0.2 text-[9px] font-mono font-bold text-accent">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-muted leading-tight mt-0.5">
                Accès direct au portfolio, cours et mode hors-ligne.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Fermer la suggestion d'installation"
            className="rounded-lg p-1 text-muted hover:text-text hover:bg-surface-elevated transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
          <button
            type="button"
            onClick={dismiss}
            className="px-3 py-1.5 text-xs text-muted hover:text-text transition-colors font-medium"
          >
            Plus tard
          </button>

          {isIOS ? (
            <PWAInstallButton
              variant="compact"
              className="bg-accent text-black font-bold border-accent hover:brightness-105 hover:bg-accent hover:text-black"
            />
          ) : (
            <button
              type="button"
              onClick={install}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent text-black font-bold px-3.5 py-1.5 text-xs hover:brightness-105 transition-all shadow-sm active:scale-95"
            >
              <Download size={13} className="text-black" />
              <span>Installer</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
