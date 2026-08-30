"use client";

import { useTheme, type ThemeMode } from "@/lib/theme-context";
import { Moon, Sun, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  variant?: "footer" | "compact" | "settings-card" | "inline";
  className?: string;
}

export function ThemeToggle({
  variant = "footer",
  className = "",
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, isMounted } = useTheme();

  // Guard against SSR hydration mismatches
  const currentTheme = isMounted ? theme : "dark";

  // 1. FOOTER VARIANT (Pour Visiteur - Centered, Accessible, Clear Vert/Noir vs Vert/Blanc options)
  if (variant === "footer") {
    return (
      <div
        className={`inline-flex items-center rounded-2xl border border-border bg-surface/80 p-1.5 backdrop-blur-md shadow-sm ${className}`}
        role="group"
        aria-label="Sélecteur de thème visuel"
      >
        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-pressed={currentTheme === "dark"}
          className={`relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
            currentTheme === "dark"
              ? "bg-[#141a15] text-[#a8f35a] shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-[#a8f35a]/30"
              : "text-muted hover:text-text"
          }`}
          title="Activer le thème Vert / Noir (Sombre)"
        >
          <Moon size={14} className={currentTheme === "dark" ? "text-accent fill-accent/20" : ""} />
          <span className="font-mono text-[11px] uppercase tracking-wider">Vert / Noir</span>
          {currentTheme === "dark" && (
            <motion.span
              layoutId="footer-theme-active-dot"
              className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse ml-0.5"
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setTheme("light")}
          aria-pressed={currentTheme === "light"}
          className={`relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
            currentTheme === "light"
              ? "bg-[#09090b] text-[#ffffff] shadow-[0_2px_12px_rgba(0,0,0,0.15)] border border-[#09090b]"
              : "text-muted hover:text-text"
          }`}
          title="Activer le thème Blanc / Noir (Clair)"
        >
          <Sun size={14} className={currentTheme === "light" ? "text-white" : ""} />
          <span className="font-mono text-[11px] uppercase tracking-wider">Blanc / Noir</span>
          {currentTheme === "light" && (
            <motion.span
              layoutId="footer-theme-active-dot"
              className="h-1.5 w-1.5 rounded-full bg-white animate-pulse ml-0.5"
            />
          )}
        </button>
      </div>
    );
  }

  // 2. COMPACT NAVBAR VARIANT (Pour le Dashboard Admin & Topbars)
  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text transition-all hover:border-accent hover:text-accent shadow-sm focus-ring ${className}`}
        title={`Passer au thème ${currentTheme === "dark" ? "Blanc / Noir (Clair)" : "Vert / Noir (Sombre)"}`}
        aria-label="Basculer le thème visuel"
      >
        <div className="flex items-center justify-center">
          {currentTheme === "dark" ? (
            <Moon size={14} className="text-accent" />
          ) : (
            <Sun size={14} className="text-amber-500" />
          )}
        </div>
        <span className="font-mono text-[11px] hidden sm:inline uppercase">
          {currentTheme === "dark" ? "Vert/Noir" : "Blanc/Noir"}
        </span>
      </button>
    );
  }

  // 3. SETTINGS CARD VARIANT (Pour la configuration en Admin)
  if (variant === "settings-card") {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card: Thème Vert / Noir (Sombre) */}
          <div
            onClick={() => setTheme("dark")}
            role="button"
            tabIndex={0}
            className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden ${
              currentTheme === "dark"
                ? "border-accent bg-[#0d120e] shadow-[0_0_20px_rgba(168,243,90,0.15)] ring-1 ring-accent/60"
                : "border-border bg-surface/50 opacity-70 hover:opacity-100 hover:border-border/80"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#141a15] border border-[#a8f35a]/40 text-[#a8f35a]">
                  <Moon size={18} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-[#f1f3ee] uppercase">
                    Vert / Noir
                  </h4>
                  <span className="font-mono text-[10px] text-[#8c958d]">
                    Sombre — Identité Cyber & Vert Lime
                  </span>
                </div>
              </div>
              {currentTheme === "dark" && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-bg shadow">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </div>

            {/* Mini Color Palette Preview */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-[#080a09] border border-white/20" title="Fond #080a09" />
                <span className="h-4 w-4 rounded-full bg-[#101411] border border-white/20" title="Surface #101411" />
                <span className="h-4 w-4 rounded-full bg-[#a8f35a]" title="Accent Vert Lime #a8f35a" />
                <span className="h-4 w-4 rounded-full bg-[#f1f3ee]" title="Texte Blanc #f1f3ee" />
              </div>
              <span className="font-mono text-[10px] text-accent font-semibold uppercase">
                {currentTheme === "dark" ? "Actif" : "Choisir"}
              </span>
            </div>
          </div>

          {/* Card: Thème Blanc / Noir (Clair) */}
          <div
            onClick={() => setTheme("light")}
            role="button"
            tabIndex={0}
            className={`cursor-pointer rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden ${
              currentTheme === "light"
                ? "border-[#09090b] bg-[#ffffff] text-[#09090b] shadow-[0_4px_24px_rgba(0,0,0,0.12)] ring-1 ring-[#09090b]"
                : "border-border bg-surface/50 opacity-70 hover:opacity-100 hover:border-border/80"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f4f4f5] border border-[#09090b]/30 text-[#09090b]">
                  <Sun size={18} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-inherit uppercase">
                    Blanc / Noir
                  </h4>
                  <span className="font-mono text-[10px] text-muted">
                    Clair — Épure Minimaliste & Noir Profond
                  </span>
                </div>
              </div>
              {currentTheme === "light" && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#09090b] text-white shadow">
                  <Check size={14} strokeWidth={3} />
                </span>
              )}
            </div>

            {/* Mini Color Palette Preview */}
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="h-4 w-4 rounded-full bg-[#fafafa] border border-black/15" title="Fond #fafafa" />
                <span className="h-4 w-4 rounded-full bg-[#ffffff] border border-black/15" title="Surface #ffffff" />
                <span className="h-4 w-4 rounded-full bg-[#09090b]" title="Accent Noir #09090b" />
                <span className="h-4 w-4 rounded-full bg-[#52525b]" title="Texte Muted #52525b" />
              </div>
              <span className="font-mono text-[10px] text-[#09090b] font-semibold uppercase">
                {currentTheme === "light" ? "Actif" : "Choisir"}
              </span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // 4. INLINE SIMPLE TOGGLE
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-accent transition-colors ${className}`}
    >
      {currentTheme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
      <span>{currentTheme === "dark" ? "Mode Vert/Noir" : "Mode Blanc/Noir"}</span>
    </button>
  );
}
