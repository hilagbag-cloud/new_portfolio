"use client";

import { motion } from "framer-motion";
import { useCmsProjects } from "@/lib/cms-hooks";
import { Sparkles, LayoutGrid } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard/ProjectCard";

export function SelectedWork() {
  const { projects } = useCmsProjects();
  const published = projects.filter((p) => p.published);

  if (published.length === 0) {
    return null;
  }

  return (
    <section id="selected-work" className="section-shell py-24 md:py-32 relative">
      {/* Background ambient subtle glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/5 rounded-full blur-[140px]" />

      {/* HEADER WITH TITLE */}
      <div className="mb-12 md:mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/60 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="eyebrow mb-3 text-accent flex items-center gap-2">
            <Sparkles size={14} className="text-accent animate-pulse" />
            <span>SELECTED WORK × DOSSIERS</span>
          </div>
          <h2 className="font-display text-4xl text-text sm:text-5xl lg:text-6xl tracking-tight uppercase">
            Créations <span className="text-accent">&</span> Systèmes
          </h2>
        </motion.div>

        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <LayoutGrid size={14} className="text-accent" />
          <span>{published.length} projets documentés</span>
        </div>
      </div>

      {/* 3-COLUMN RESPONSIVE GRID OF 3D BOOK CARDS */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {published.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="w-full"
          >
            <ProjectCard project={project} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
