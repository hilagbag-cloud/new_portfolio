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
} from "lucide-react";

export function ProjectsManager() {
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Project[];
        setProjectsList(items);
      }
    });
    return () => unsub();
  }, []);

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
      await setDoc(doc(db, "projects", projId), {
        ...editingProject,
        id: projId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjectsList((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
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
      {/* Top Header & Fast Template Creators */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-text">
            Gestion des Projets & Templates ({projectsList.length})
          </h2>
          <p className="text-xs text-muted">
            Créez des projets prêts à l&apos;emploi avec choix d&apos;animation (Design vs IA vs Dev) et d&apos;aperçu (Image vs Description).
          </p>
        </div>

        {/* Quick Add with Template Options */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenAdd("software")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-bold text-bg transition-transform hover:scale-105 focus-ring"
          >
            <Plus size={15} />
            <span>Nouveau Projet</span>
          </button>
        </div>
      </div>

      {/* Template Starters Bar */}
      <div className="rounded-2xl border border-border/80 bg-surface/50 p-3 flex flex-wrap items-center justify-between gap-3">
        <span className="eyebrow text-xs text-muted flex items-center gap-1.5 pl-1">
          <Sparkles size={13} className="text-accent" />
          <span>Templates préconfigurés en 1-clic :</span>
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
                ? "border-border/80 bg-surface/60 shadow-sm"
                : "border-border/40 bg-surface/20 opacity-70"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    #{proj.number || "00"}
                  </span>
                  <span className="font-mono text-[10px] text-muted uppercase">
                    {proj.category || "software"}
                  </span>
                </div>
                <span
                  onClick={() => togglePublish(proj)}
                  className={`cursor-pointer rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold transition-colors ${
                    proj.published
                      ? "bg-accent/15 text-accent border border-accent/30"
                      : "bg-muted/15 text-muted border border-border"
                  }`}
                >
                  {proj.published ? "Publié" : "Brouillon"}
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-text">{proj.name}</h3>
                {proj.tagline && (
                  <p className="text-[11px] text-accent font-mono mt-0.5">{proj.tagline}</p>
                )}
              </div>

              <p className="text-xs text-muted leading-relaxed line-clamp-2">
                {proj.shortDescription}
              </p>

              {/* Badges for Preview Mode & Category */}
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted pt-1">
                <span className="flex items-center gap-1 rounded bg-black/40 border border-white/10 px-2 py-0.5">
                  {proj.previewMode === "image" ? (
                    <>
                      <ImageIcon size={11} className="text-accent" />
                      <span>Aperçu Image</span>
                    </>
                  ) : (
                    <>
                      <FileText size={11} className="text-accent" />
                      <span>Description & Stack</span>
                    </>
                  )}
                </span>
              </div>

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
                  className="rounded-lg border border-border p-2 text-text transition-colors hover:border-accent hover:text-accent"
                  title="Modifier"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.id)}
                  className="rounded-lg border border-border p-2 text-text transition-colors hover:border-red-500 hover:text-red-400"
                  title="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[#0d110e] p-6 text-text shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-text">
                  {editingProject.id && projectsList.some((p) => p.id === editingProject.id)
                    ? "Modifier le projet"
                    : "Nouveau Projet (Template)"}
                </h3>
                <p className="text-xs text-muted">
                  Configurez le comportement lors de l&apos;ouverture du cahier.
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
            <div className="rounded-xl border border-border/60 bg-surface/60 p-3 space-y-2">
              <span className="eyebrow text-[10px] text-muted block">
                Changer de template / style d&apos;animation :
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPreset("design")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                    editingProject.category === "design"
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border bg-surface text-muted hover:text-text"
                  }`}
                >
                  <Palette size={12} />
                  <span>Design (Sobre & Dynamique)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("ai-data")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                    editingProject.category === "ai-data"
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border bg-surface text-muted hover:text-text"
                  }`}
                >
                  <Terminal size={12} />
                  <span>IA / Data (Terminal & Code)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset("software")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${
                    editingProject.category === "software"
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border bg-surface text-muted hover:text-text"
                  }`}
                >
                  <Code2 size={12} />
                  <span>Software & Web</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow mb-1 block text-xs">Numéro du projet</label>
                  <input
                    type="text"
                    value={editingProject.number || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, number: e.target.value })
                    }
                    placeholder="01"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring"
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
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Sous-titre / Accroche (Tagline)</label>
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

              {/* PREVIEW MODE CHOOSER: DESCRIPTION VS IMAGE */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-3.5 space-y-3">
                <label className="eyebrow text-xs text-accent block font-bold">
                  Contenu à afficher à l&apos;ouverture du cahier *
                </label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject({ ...editingProject, previewMode: "description" })}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all ${
                      editingProject.previewMode === "description"
                        ? "border-accent bg-accent/20 text-text font-semibold shadow-sm"
                        : "border-border bg-surface text-muted hover:border-border/80"
                    }`}
                  >
                    <FileText size={16} className="text-accent" />
                    <div>
                      <div className="text-xs text-text font-bold">Description & Stack</div>
                      <div className="text-[10px] text-muted">Texte explicatif structuré</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProject({ ...editingProject, previewMode: "image" })}
                    className={`flex items-center gap-2 rounded-xl border p-3 text-left transition-all ${
                      editingProject.previewMode === "image"
                        ? "border-accent bg-accent/20 text-text font-semibold shadow-sm"
                        : "border-border bg-surface text-muted hover:border-border/80"
                    }`}
                  >
                    <ImageIcon size={16} className="text-accent" />
                    <div>
                      <div className="text-xs text-text font-bold">Aperçu Image / Maquette</div>
                      <div className="text-[10px] text-muted">Capture du site avant accès</div>
                    </div>
                  </button>
                </div>

                {editingProject.previewMode === "image" && (
                  <div className="pt-2 border-t border-accent/20 space-y-2">
                    <label className="eyebrow block text-xs">
                      URL de l&apos;image aperçu du site / maquette
                    </label>
                    <input
                      type="url"
                      value={editingProject.previewImage || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, previewImage: e.target.value })
                      }
                      placeholder="https://images.unsplash.com/... ou /screenshot.jpg"
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring"
                    />
                    {editingProject.previewImage && (
                      <div className="mt-2 aspect-[16/9] w-full max-w-[240px] overflow-hidden rounded-lg border border-border bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editingProject.previewImage}
                          alt="Aperçu miniature"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Description détaillée *</label>
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
                  placeholder="Plateforme d'orientation post-bac..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring"
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
                      technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Next.js, TypeScript, Tailwind"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Lien externe vers le site (optionnel)</label>
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
                  <span>Publier sur le portfolio</span>
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
                  className="rounded-xl bg-accent px-5 py-2 text-xs font-bold text-bg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
