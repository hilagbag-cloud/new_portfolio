"use client";

import { site } from "@/data/site";
import { useCmsSiteConfig } from "@/lib/cms-hooks";
import { SocialFloatingTooltipList } from "@/components/Socials/SocialFloatingTooltipList";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";

export function Footer() {
  const cmsConfig = useCmsSiteConfig();

  const currentYear = new Date().getFullYear();
  const brandName = cmsConfig?.metaTitle?.split("—")[0]?.trim() || site.fullName || "HILARUS GBAGOULE";

  return (
    <footer className="border-t border-border bg-surface/50 py-12 sm:py-16 transition-colors">
      <div className="section-shell flex flex-col gap-10">
        
        {/* Top Tier: Identity, Socials, and Visitor Theme Switcher */}
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Brand identity */}
          <div className="text-center md:text-left">
            <div className="font-display text-xl text-text tracking-wider uppercase font-bold">
              {brandName}
            </div>
            <p className="mt-1 text-xs text-muted max-w-sm">
              Designer & Product Engineer — Expériences numériques & Systèmes interactifs
            </p>
          </div>

          {/* Visitor Theme Toggle (Vert / Noir <-> Vert / Blanc) */}
          <div className="flex flex-col items-center gap-2">
            <span className="eyebrow text-[10px] text-muted">
              Apparence & Thème
            </span>
            <ThemeToggle variant="footer" />
          </div>

          {/* Revealing Floating Tooltip Social Icons */}
          <div className="flex items-center justify-center">
            <SocialFloatingTooltipList className="!justify-center gap-3.5" />
          </div>
        </div>

        {/* Bottom Tier: Sub-copyright and Technical indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 text-[11px] text-muted">
          <p className="eyebrow text-[10px] text-center sm:text-left">
            © {currentYear} {brandName}. TOUS DROITS RÉSERVÉS.
          </p>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="flex items-center gap-1.5 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Système Actif
            </span>
            <span>•</span>
            <span>Paris / Lomé / Remote</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

