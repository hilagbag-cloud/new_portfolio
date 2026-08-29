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
import { milestones as initialMilestones, type Milestone } from "@/data/milestones";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";

export function MilestonesManager() {
  const [milestonesList, setMilestonesList] = useState<Milestone[]>(initialMilestones);
  const [editingMilestone, setEditingMilestone] = useState<Partial<Milestone> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "milestones"), (snap) => {
      if (!snap.empty) {
        const items = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Milestone[];
        items.sort((a, b) => (a.progress || 0) - (b.progress || 0));
        setMilestonesList(items);
      }
    });
    return () => unsub();
  }, []);

  const handleOpenAdd = () => {
    setEditingMilestone({
      id: `milestone-${Date.now()}`,
      stepNumber: String(milestonesList.length + 1).padStart(2, "0"),
      badge: "PROJET",
      category: "EXPÉRIMENTATION",
      date: new Date().getFullYear().toString(),
      location: "Cotonou, Bénin",
      title: "",
      shortTitle: "",
      headline: "",
      description: "",
      progress: 0.9,
      published: true,
      longStory: ["Description détaillée du contexte et des réalisations."],
      technologies: ["AI", "Web"],
      keyHighlights: [{ label: "Impact", value: "100+", detail: "utilisateurs" }],
      learnings: ["Acquis clé 1"],
      gallery: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: Milestone) => {
    setEditingMilestone({ ...m });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || !editingMilestone.title || !editingMilestone.shortTitle) return;

    try {
      setLoading(true);
      const mId = editingMilestone.id || `milestone-${Date.now()}`;
      await setDoc(doc(db, "milestones", mId), {
        ...editingMilestone,
        id: mId,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setIsModalOpen(false);
      setEditingMilestone(null);
    } catch (err) {
      console.error("Error saving milestone:", err);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette étape ?")) return;
    try {
      await deleteDoc(doc(db, "milestones", id));
      setMilestonesList((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting milestone:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-text">
            Trajectoire & Jalons ({milestonesList.length})
          </h2>
          <p className="text-xs text-muted">
            Pilotez les étapes du parcours, leurs descriptions, photos et métriques.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-bold text-bg transition-transform hover:scale-105 focus-ring"
        >
          <Plus size={16} />
          <span>Nouvelle Étape</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {milestonesList.map((m) => (
          <div
            key={m.id}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/60 p-5 space-y-4"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                    ÉTAPE {m.stepNumber}
                  </span>
                  <span className="eyebrow text-muted text-[11px] uppercase">
                    {m.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
                  <Calendar size={11} className="text-accent" />
                  <span>{m.date}</span>
                </div>
              </div>

              <h3 className="font-display text-lg font-bold text-text">
                {m.shortTitle} — {m.title}
              </h3>

              <p className="text-xs text-accent/90 italic line-clamp-1 border-l border-accent pl-2">
                &ldquo;{m.headline}&rdquo;
              </p>

              <p className="text-xs text-muted leading-relaxed line-clamp-2">
                {m.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <a
                href={`/journey/${m.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
              >
                <span>Voir la page publique</span>
                <ExternalLink size={12} />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(m)}
                  className="rounded-lg border border-border p-2 text-text hover:border-accent hover:text-accent"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(m.id)}
                  className="rounded-lg border border-border p-2 text-text hover:border-red-500 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {isModalOpen && editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[#0d110e] p-6 text-text shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold text-text">
                Modifier l&apos;étape de parcours
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-muted hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="eyebrow mb-1 block text-xs">Numéro Étape</label>
                  <input
                    type="text"
                    value={editingMilestone.stepNumber || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, stepNumber: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Badge / Label</label>
                  <input
                    type="text"
                    value={editingMilestone.badge || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, badge: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Date / Année</label>
                  <input
                    type="text"
                    value={editingMilestone.date || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow mb-1 block text-xs">Titre Court *</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.shortTitle || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, shortTitle: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Titre Complet *</label>
                  <input
                    type="text"
                    required
                    value={editingMilestone.title || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Phrase d&apos;accroche (Headline)</label>
                <input
                  type="text"
                  value={editingMilestone.headline || ""}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, headline: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Description de synthèse (Accueil)</label>
                <textarea
                  rows={2}
                  value={editingMilestone.description || ""}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus-ring"
                />
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
                  {loading ? "Enregistrement..." : "Sauvegarder l'étape"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
