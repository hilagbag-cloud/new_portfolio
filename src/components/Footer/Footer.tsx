"use client";

import { site } from "@/data/site";
import { useCmsSiteConfig } from "@/lib/cms-hooks";
import { SocialFloatingTooltipList } from "@/components/Socials/SocialFloatingTooltipList";

export function Footer() {
  const cmsConfig = useCmsSiteConfig();

  const currentYear = new Date().getFullYear();
  const brandName = cmsConfig?.metaTitle?.split("—")[0]?.trim() || site.fullName || "HILARUS GBAGOULE";

  return (
    <footer className="border-t border-border/80 bg-[#070a08] py-14">
      <div className="section-shell flex flex-col items-center justify-between gap-8 md:flex-row">
        {/* Brand identity */}
        <div className="text-center md:text-left">
          <div className="font-display text-xl text-text tracking-wider uppercase font-bold">
            {brandName}
          </div>
          <p className="mt-1 text-xs text-muted">
            Designer & Product Engineer — Expériences numériques & Systèmes interactifs
          </p>
        </div>

        {/* Revealing Floating Tooltip Social Icons matching Hero format */}
        <div className="flex items-center justify-center">
          <SocialFloatingTooltipList className="!justify-center gap-3.5" />
        </div>

        {/* Rights reserved */}
        <p className="eyebrow text-[11px] text-muted text-center md:text-right">
          © {currentYear} {brandName}. TOUS DROITS RÉSERVÉS.
        </p>
      </div>
    </footer>
  );
}
