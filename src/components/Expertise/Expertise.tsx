"use client";

import { motion } from "framer-motion";
import {
  Palette,
  Terminal,
  Cpu,
  Compass,
} from "lucide-react";

interface PillarItem {
  id: "design" | "software" | "ai-data";
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

const pillars: PillarItem[] = [
  {
    id: "design",
    number: "01",
    title: "Design",
    subtitle: "Système Visuel & Expérience",
    description:
      "Conception d'interfaces fluides, typographies rigoureuses, design systems scalables et micro-interactions immersives.",
  },
  {
    id: "software",
    number: "02",
    title: "Software",
    subtitle: "Architecture & Applications Web / PWA / Natives",
    description:
      "Développement full-stack moderne, applications web progressives (PWA) et natives, composants serveurs et state machines fiables.",
  },
  {
    id: "ai-data",
    number: "03",
    title: "AI & Data",
    subtitle: "Modèles & Intelligence Appliquée",
    description:
      "Intégration de modèles fondationnels et IA générative, curation & labellisation de données multimodales et pipelines automatisés.",
  },
];

export function Expertise() {
  return (
    <section id="expertise" className="section-shell py-20 md:py-24 relative">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-accent/5 rounded-full blur-[140px]" />

      {/* SECTION HEADER */}
      <div className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="eyebrow mb-2 text-accent flex items-center gap-2">
            <Compass size={14} className="text-accent" />
            <span>DOMAINES D&apos;EXPERTISE MULTIDISCIPLINAIRES</span>
          </div>
          <h2 className="font-display text-3xl text-text sm:text-4xl lg:text-5xl tracking-tight uppercase">
            Trois axes, <span className="text-accent">un même geste</span>
          </h2>
        </div>
        <p className="max-w-md text-xs text-muted font-mono leading-relaxed uppercase tracking-wider">
          De la conception graphique pure jusqu&apos;à l&apos;architecture logicielle et l&apos;intelligence artificielle intégrée.
        </p>
      </div>

      {/* THREE STREAMLINED AND ELEGANT EXPERTISE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pillars.map((pillar, index) => {
          return (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface/90 p-6 sm:p-7 transition-all duration-300 hover:border-accent/60 hover:bg-surface hover:-translate-y-1 shadow-sm"
            >
              <div className="space-y-4">
                {/* Header: Number & Category Icon */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent px-2.5 py-0.5 rounded-full bg-black/60 border border-accent/30">
                    #{pillar.number}
                  </span>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface/80 text-accent transition-transform duration-300 group-hover:scale-105 group-hover:border-accent">
                    {pillar.id === "design" && <Palette size={16} />}
                    {pillar.id === "software" && <Cpu size={16} />}
                    {pillar.id === "ai-data" && <Terminal size={16} />}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl text-text group-hover:text-accent transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-muted/90 uppercase tracking-wider">
                    {pillar.subtitle}
                  </p>
                </div>

                {/* Direct clean description */}
                <p className="text-sm text-text/80 leading-relaxed font-sans pt-1">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
