"use client";

import { motion } from "framer-motion";
import { Sparkles, Code2, Palette, Cpu, GraduationCap, MapPin } from "lucide-react";
import { useCmsSiteConfig } from "@/lib/cms-hooks";

const pillars = [
  { label: "Curiosité & R&D", icon: Sparkles },
  { label: "Ingénierie Logicielle", icon: Code2 },
  { label: "Design System & UI", icon: Palette },
  { label: "IA & Data Pipelines", icon: Cpu },
  { label: "Excellence Académique", icon: GraduationCap },
  { label: "Impact Réel", icon: MapPin },
];

export function About() {
  const cmsConfig = useCmsSiteConfig();

  const authorName = cmsConfig?.author || cmsConfig?.givenName || "Hilarus Gbagoule";
  const jobTitle = cmsConfig?.jobTitle || "Digital Builder & Product Engineer";
  const alumni = cmsConfig?.alumniOf?.trim();
  const bioLong = cmsConfig?.bioLong?.trim();
  const aboutSummary = cmsConfig?.aboutSummary?.trim();

  return (
    <section id="about" className="section-shell py-24 md:py-32 relative">
      <div className="pointer-events-none absolute -bottom-20 right-10 w-[450px] h-[250px] bg-accent/5 rounded-full blur-[140px]" />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 items-start">
        <div className="md:col-span-4">
          <div className="eyebrow mb-4 text-accent flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>À PROPOS</span>
          </div>
          <h2 className="font-display text-4xl text-text sm:text-5xl uppercase tracking-tight leading-tight">
            Au-delà <br />
            <span className="text-accent">du CV</span>
          </h2>
          <p className="mt-4 font-mono text-xs text-muted uppercase tracking-wider">
            {authorName} — {jobTitle}
          </p>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-muted/95 font-sans">
            <p>
              {aboutSummary ||
                "Je conçois et bâtis des produits numériques qui conjuguent la rigueur de l'ingénierie logicielle, la fluidité du design d'expérience et la puissance de l'intelligence artificielle."}
            </p>
            <p className="text-sm sm:text-base text-muted/80">
              {bioLong ||
                (alumni
                  ? `Issu d'une formation technologique pointue (${alumni}), j'ai façonné ma démarche autour d'une conviction : un bon produit ne se limite pas à du code fonctionnel ou à une belle maquette, il résout un problème humain tangible avec une exécution sans friction.`
                  : "J'ai façonné ma démarche autour d'une conviction fondamentale : un produit exceptionnel ne se limite pas à du code fonctionnel ou à une maquette esthétique, il résout un défi humain tangible avec une exécution sans friction.")}
            </p>
            <p className="text-sm sm:text-base text-muted/80">
              Des plateformes à fort impact comme <strong className="text-text font-semibold">BacPilot</strong> aux
              laboratoires d&apos;expérimentation logicielle et multimodale comme <strong className="text-text font-semibold">GB Labs</strong>,
              chaque projet est une opportunité de repousser les standards techniques et visuels.
            </p>
          </div>

          <div className="pt-6 border-t border-border/80">
            <span className="eyebrow text-xs text-muted block mb-4">
              Fondations & Principes Directeurs
            </span>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon;
                return (
                  <li
                    key={pillar.label}
                    className="flex items-center gap-2 rounded-xl border border-border bg-surface/80 px-3.5 py-2.5 text-xs text-text font-mono transition-colors hover:border-accent/40"
                  >
                    <IconComponent size={13} className="text-accent shrink-0" />
                    <span className="truncate">{pillar.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

