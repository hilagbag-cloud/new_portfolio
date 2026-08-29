"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  projects as initialProjects,
  type Project,
  type ProjectCategory,
  type ProjectPreviewMode,
} from "@/data/projects";
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Check,
  X,
  Layers,
  Sparkles,
  Palette,
  Terminal,
  Code2,
  Image as ImageIcon,
  FileText,
  Eye,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { seedInitialCmsData } from "@/lib/cms-seed";

function mergeProjects(firestoreList: Project[]): Project[] {
  const mergedMap = new Map<string, Project>();
  initialProjects.forEach((p) => {
    mergedMap.set(p.id, { ...p });
  });
  firestoreList.forEach((p) => {
    const existing = mergedMap.get(p.id);
    mergedMap.set(p.id, { ...existing, ...p });
  });
  return Array.from(mergedMap.values()).sort((a, b) =>
    (a.number || "").localeCompare(b.number || "")
  );
}

export function ProjectsManager() {
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "projects"),
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Project[];
          setProjectsList(mergeProjects(items));
        } else {
          setProjectsList(initialProjects);
        }
      },
      (err) => {
        console.error("Snapshot error:", err);
      }
    );
    return () => unsub();
  }, []);

  const handleSyncDefaults = async () => {
    try {
      setSyncing(true);
      await seedInitialCmsData(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      console.error("Sync error:", err);
      alert("Erreur lors de la synchronisation.");
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenAdd = (templateType: ProjectCategory = "software") => {
    const nextNum = String(projectsList.length + 1).padStart(2, "0");

    let defaults: Partial<Project> = {
      id: `proj-${Date.now()}`,
      number: nextNum,
      name: "",
      tagline: "",
      shortDescription: "",
      category: templateType,
      previewMode: "description",
      previewImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      technologies: ["Next.js", "TypeScript", "Tailwind"],
      externalUrl: "",
      caseStudy: true,
      published: true,
    };

    if (templateType === "design") {
      defaults = {
        ...defaults,
        name: "Nouveau Projet Design",
        tagline: "Design System & Expérience Utilisateur",
        shortDescription: "Conception d'interfaces haute fidélité, prototypage interactif et recherche utilisateur.",
        previewMode: "image",
        technologies: ["Figma", "Design System", "Prototyping", "UI/UX"],
      };
    } else if (templateType === "ai-data") {
      defaults = {
        ...defaults,
        name: "Nouveau Projet IA / Data",
        tagline: "Pipeline de données & Modélisation IA",
        shortDescription: "Collecte, traitement et déploiement de flux de données ou intégration de modèles d'intelligence artificielle.",
        previewMode: "description",
        technologies: ["Python", "FastAPI", "PyTorch", "LLM"],
      };
    }

    setEditingProject(defaults);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setEditingProject({ ...proj });
    setIsModalOpen(true);
  };

  const handleApplyPreset = (type: ProjectCategory) => {
    if (!editingProject) return;
    if (type === "design") {
      setEditingProject({
        ...editingProject,
        category: "design",
        previewMode: "image",
        technologies: ["Figma", "Design System", "UI/UX", "Animation"],
      });
    } else if (type === "ai-data") {
      setEditingProject({
        ...editingProject,
        category: "ai-data",
        previewMode: "description",
        technologies: ["Python", "PyTorch", "FastAPI", "Vector Search"],
      });
    } else {
      setEditingProject({
        ...editingProject,
        category: "software",
        previewMode: "description",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.name || !editingProject.shortDescription) return;

    try {
      setLoading(true);
      const projId = editingProject.id || `proj-${Date.now()}`;
      await setDoc(
        doc(db, "projects", projId),
        {
          ...editingProject,
          id: projId,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Erreur lors de la sauvegarde du projet.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, "projects", deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (proj: Project) => {
    try {
      await setDoc(
        doc(db, "projects", proj.id),
        { published: !proj.published },
        { merge: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Real-time status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-text">
              Gestion des Projets & Réalisations ({projectsList.length})
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Temps Réel Actif</span>
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Modifiez chaque projet (titres, descriptifs, médias importés et technologies) en direct.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSyncDefaults}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface/70 px-3 py-2 text-xs font-semibold text-text hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
            title="S'assure que tous les projets originaux (BacPilot, GB Labs, AdjaStream) sont enregistrés dans votre base Firestore"
          >
            <RefreshCw size={13} className={syncing ? "animate-spin text-accent" : ""} />
            <span>{syncSuccess ? "Synchronisé !" : "Synchroniser la base"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenAdd("software")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-bg transition-transform hover:scale-105 focus-ring shadow-sm"
          >
            <Plus size={15} />
            <span>Nouveau Projet</span>
          </button>
        </div>
      </div>

      {/* Template Starters Bar */}
      <div className="rounded-2xl border border-border/80 bg-surface/50 p-3.5 flex flex-wrap items-center justify-between gap-3">
        <span className="eyebrow text-xs text-muted flex items-center gap-1.5 pl-1">
          <Sparkles size={13} className="text-accent" />
          <span>Création rapide avec gabarit prédéfini :</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAdd("design")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3 py-1.5 text-xs text-text hover:border-accent hover:text-accent transition-colors"
          >
            <Palette size={13} className="text-accent" />
            <span>+ Template Design (Aperçu Image)</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenAdd("ai-data")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3 py-1.5 text-xs text-text hover:border-accent hover:text-accent transition-colors"
          >
            <Terminal size={13} className="text-accent" />
            <span>+ Template IA / Data (Terminal & Code)</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenAdd("software")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-surface px-3 py-1.5 text-xs text-text hover:border-accent hover:text-accent transition-colors"
          >
            <Code2 size={13} className="text-accent" />
            <span>+ Template Software / Web</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectsList.map((proj) => (
          <div
            key={proj.id}
            className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
              proj.published
                ? "border-border/80 bg-surface/60 shadow-sm hover:border-accent/40"
                : "border-border/40 bg-surface/20 opacity-70"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    #{proj.number || "00"}
                  </span>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                    {proj.category || "software"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => togglePublish(proj)}
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-colors cursor-pointer ${
                    proj.published
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "bg-muted/15 text-muted border border-border"
                  }`}
                >
                  {proj.published ? "Publié" : "Brouillon"}
                </button>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-text">{proj.name}</h3>
                {proj.tagline && (
                  <p className="text-[11px] text-accent font-mono mt-0.5">{proj.tagline}</p>
                )}
              </div>

              <p className="text-xs text-muted leading-relaxed line-clamp-3">
                {proj.shortDescription}
              </p>

              {/* Badges for Preview Mode & Category */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-muted pt-1">
                <span className="flex items-center gap-1 rounded bg-black/40 border border-white/10 px-2 py-0.5">
                  {proj.previewMode === "image" ? (
                    <>
                      <ImageIcon size={11} className="text-accent" />
                      <span>Aperçu Image Importée</span>
                    </>
                  ) : (
                    <>
                      <FileText size={11} className="text-accent" />
                      <span>Description & Stack</span>
                    </>
                  )}
                </span>
              </div>

              {/* Small preview thumbnail if available */}
              {proj.previewImage && (
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10 bg-black/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proj.previewImage}
                    alt={proj.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-1 pt-1">
                {proj.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-4 mt-4">
              {proj.externalUrl ? (
                <a
                  href={proj.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  <span>Lien externe</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <span className="text-[11px] text-muted font-mono">Dossier interne</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(proj)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-text transition-colors hover:border-accent hover:text-accent"
                  title="Modifier le projet"
                >
                  <Edit2 size={13} />
                  <span>Éditer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(proj.id)}
                  className="rounded-lg border border-border p-2 text-muted transition-colors hover:border-red-500 hover:text-red-400"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal for Deletion to prevent accidental wipes */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/40 bg-[#0e110f] p-6 text-text shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-text">
                  Confirmer la suppression
                </h3>
                <p className="text-xs text-muted">Cette action est irréversible.</p>
              </div>
            </div>

            <p className="text-xs text-text/80 leading-relaxed font-sans">
              Êtes-vous sûr de vouloir supprimer ce projet de la base de données ?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={loading}
                className="rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition-colors"
              >
                {loading ? "Suppression..." : "Confirmer la suppression"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[#0d110e] p-6 sm:p-8 text-text shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-text">
                  {editingProject.id && projectsList.some((p) => p.id === editingProject.id)
                    ? `Modifier : ${editingProject.name || "Projet"}`
                    : "Nouveau Projet"}
                </h3>
                <p className="text-xs text-muted">
                  Personnalisez le contenu, les médias et les animations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            {/* Template Presets buttons */}
            <div className="rounded-xl border border-border/60 bg-surface/60 p-3.5 space-y-2">
              <span className="eyebrow text-[10px] text-muted block">
                Type de projet & profil d&apos;animation :
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset("design")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    editingProject.category === "design"
                      ? "border-accent bg-accent/20 text-accent font-bold"
                      : "border-border bg-surface text-muted hover:text-text"
                  }`}
                >
                  <Palette size={13} />
                  <span>Design (Micro-interactions)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("ai-data")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    editingProject.category === "ai-data"
                      ? "border-accent bg-accent/20 text-accent font-bold"
                      : "border-border bg-surface text-muted hover:text-text"
                  }`}
                >
                  <Terminal size={13} />
                  <span>IA / Data (Terminal & Code)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("software")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors ${
                    editingProject.category === "software"
                      ? "border-accent bg-accent/20 text-accent font-bold"
                      : "border-border bg-surface text-muted hover:text-text"
                  }`}
                >
                  <Code2 size={13} />
                  <span>Software & Web</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow mb-1 block text-xs">Numéro (#01, #02...)</label>
                  <input
                    type="text"
                    value={editingProject.number || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, number: e.target.value })
                    }
                    placeholder="01"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring font-mono"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Nom du projet *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.name || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, name: e.target.value })
                    }
                    placeholder="BacPilot"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Accroche / Tagline</label>
                <input
                  type="text"
                  value={editingProject.tagline || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, tagline: e.target.value })
                  }
                  placeholder="Orientation universitaire intelligente"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring"
                />
              </div>

              {/* MEDIA IMPORT (Drag & Drop or File Picker Upload prioritized) */}
              <div className="rounded-2xl border border-border/80 bg-surface/40 p-4 space-y-3">
                <ImageUploader
                  label="Média Visuel du Projet (Capture / Maquette / Illustration)"
                  sublabel="Glissez-déposez une image depuis votre ordinateur ou téléphone. Elle sera optimisée automatiquement."
                  value={editingProject.previewImage}
                  onChange={(imgData) =>
                    setEditingProject({ ...editingProject, previewImage: imgData })
                  }
                  aspectRatio="16/9"
                />
              </div>

              {/* PREVIEW MODE CHOOSER: DESCRIPTION VS IMAGE */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-3">
                <label className="eyebrow text-xs text-accent block font-bold">
                  Comportement à l&apos;ouverture du cahier interactif *
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProject({ ...editingProject, previewMode: "description" })
                    }
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all ${
                      editingProject.previewMode === "description"
                        ? "border-accent bg-accent/20 text-text font-semibold shadow-sm"
                        : "border-border bg-surface text-muted hover:border-border/80"
                    }`}
                  >
                    <FileText size={16} className="text-accent shrink-0" />
                    <div>
                      <div className="text-xs text-text font-bold">Description & Stack</div>
                      <div className="text-[10px] text-muted">Texte explicatif & technologies</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingProject({ ...editingProject, previewMode: "image" })
                    }
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all ${
                      editingProject.previewMode === "image"
                        ? "border-accent bg-accent/20 text-text font-semibold shadow-sm"
                        : "border-border bg-surface text-muted hover:border-border/80"
                    }`}
                  >
                    <ImageIcon size={16} className="text-accent shrink-0" />
                    <div>
                      <div className="text-xs text-text font-bold">Aperçu Visuel Direct</div>
                      <div className="text-[10px] text-muted">Affichage du média importé</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Description détaillée du projet *</label>
                <textarea
                  required
                  rows={3}
                  value={editingProject.shortDescription || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      shortDescription: e.target.value,
                    })
                  }
                  placeholder="Plateforme d'orientation post-bac et d'accompagnement académique guidée pour les nouveaux bacheliers."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring leading-relaxed"
                />
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">
                  Technologies (séparées par une virgule)
                </label>
                <input
                  type="text"
                  value={editingProject.technologies?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      technologies: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Next.js 14, TypeScript, Tailwind CSS, Firebase"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring font-mono"
                />
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Lien externe vers le site / démo</label>
                <input
                  type="url"
                  value={editingProject.externalUrl || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, externalUrl: e.target.value })
                  }
                  placeholder="https://bacpilot.site"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.published ?? true}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, published: e.target.checked })
                    }
                    className="rounded border-border accent-accent h-4 w-4"
                  />
                  <span>Publié et visible sur le portfolio</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text hover:bg-white/5"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-bold text-bg hover:scale-105 transition-transform disabled:opacity-50 shadow-md"
                >
                  {loading && <RefreshCw size={14} className="animate-spin" />}
                  <span>{loading ? "Enregistrement en direct..." : "Enregistrer les modifications"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
