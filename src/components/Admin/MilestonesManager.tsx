"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  milestones as initialMilestones,
  type Milestone,
  type MilestoneGalleryItem,
} from "@/data/milestones";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  ExternalLink,
  X,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Image as ImageIcon,
  Check,
  FolderArchive,
} from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { seedInitialCmsData } from "@/lib/cms-seed";
import { ConfirmWriteModal, type PendingFirestoreWrite } from "./ConfirmWriteModal";
import {
  sanitizeForFirestore,
  saveLocalDraft,
  loadLocalDraft,
  getFirestoreErrorMessage,
} from "@/lib/firestore-utils";

function mergeMilestones(firestoreList: Milestone[]): Milestone[] {
  const mergedMap = new Map<string, Milestone>();
  initialMilestones.forEach((m) => {
    mergedMap.set(m.id, { ...m });
  });
  firestoreList.forEach((m) => {
    const existing = mergedMap.get(m.id);
    mergedMap.set(m.id, { ...existing, ...m });
  });
  const list = Array.from(mergedMap.values());
  list.sort((a, b) => (a.progress || 0) - (b.progress || 0));
  return list;
}

export function MilestonesManager({
  isEditingEnabled: globalEditingEnabled,
  setIsEditingEnabled: setGlobalEditingEnabled,
}: {
  isEditingEnabled?: boolean;
  setIsEditingEnabled?: (enabled: boolean) => void;
} = {}) {
  const [localEditingEnabled, setLocalEditingEnabled] = useState(false);
  const isEditingEnabled =
    globalEditingEnabled !== undefined ? globalEditingEnabled : localEditingEnabled;
  const toggleEditing = () => {
    if (setGlobalEditingEnabled) {
      setGlobalEditingEnabled(!isEditingEnabled);
    } else {
      setLocalEditingEnabled(!isEditingEnabled);
    }
  };

  const [milestonesList, setMilestonesList] = useState<Milestone[]>(initialMilestones);
  const [editingMilestone, setEditingMilestone] = useState<Partial<Milestone> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [saveAllSuccess, setSaveAllSuccess] = useState(false);

  // Manual Confirmation State
  const [pendingWrite, setPendingWrite] = useState<PendingFirestoreWrite | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "milestones"),
      (snap) => {
        if (!snap.empty) {
          const items = snap.docs.map((d) => ({ ...d.data(), id: d.id })) as Milestone[];
          setMilestonesList(mergeMilestones(items));
        } else {
          setMilestonesList(initialMilestones);
        }
      },
      (err) => {
        console.error("Milestones snapshot error:", err);
      }
    );
    return () => unsub();
  }, []);

  /**
   * Save all milestones to Firestore in a single batch
   */
  const handleSaveAllMilestonesToFirestore = () => {
    // Backup all milestones to local storage
    saveLocalDraft("milestones_list", milestonesList);

    const cleanBatchPayload = milestonesList.map((m) =>
      sanitizeForFirestore(
        {
          ...m,
          updatedAt: new Date().toISOString(),
        },
        { removeEmptyStrings: true, removeEmptyObjects: true }
      )
    );

    setPendingWrite({
      title: `Sauvegarde groupée du parcours (${milestonesList.length} jalons)`,
      description: "Validation requise pour enregistrer tous les jalons dans la collection 'milestones' de Firestore. Les champs vides ont été supprimés.",
      collection: "milestones",
      payload: cleanBatchPayload,
      actionType: "batchWrite",
      onConfirm: async () => {
        try {
          setLoading(true);
          const batch = writeBatch(db);
          cleanBatchPayload.forEach((cleanM) => {
            if (cleanM && (cleanM as Milestone).id) {
              const docRef = doc(db, "milestones", (cleanM as Milestone).id);
              batch.set(docRef, cleanM as Record<string, unknown>, { merge: true });
            }
          });

          await batch.commit();
          setSaveAllSuccess(true);
          setTimeout(() => setSaveAllSuccess(false), 4000);
        } catch (err: unknown) {
          console.error("Error saving all milestones:", err);
          const msg = getFirestoreErrorMessage(err);
          alert(`Parcours conservé dans votre navigateur (0 perte).\n\nNote Firestore : ${msg}`);
        } finally {
          setLoading(false);
        }
      },
    });

    setIsConfirmModalOpen(true);
  };

  const handleSyncDefaults = () => {
    setPendingWrite({
      title: "Synchronisation du parcours par défaut",
      description: "Cette action va initialiser les jalons prédéfinis du parcours dans Firestore.",
      collection: "milestones",
      payload: { action: "sync_default_milestones", count: initialMilestones.length },
      actionType: "batchWrite",
      onConfirm: async () => {
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
      },
    });

    setIsConfirmModalOpen(true);
  };

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
    setEditingMilestone({
      ...m,
      gallery: Array.isArray(m.gallery) ? [...m.gallery] : [],
    });
    setIsModalOpen(true);
  };

  // Helper to add image to editing milestone
  const handleAddGalleryItem = () => {
    if (!editingMilestone) return;
    const currentGallery = editingMilestone.gallery || [];
    setEditingMilestone({
      ...editingMilestone,
      gallery: [
        ...currentGallery,
        {
          url: "",
          caption: "Aperçu de la réalisation",
          tag: "PROJET",
          alt: "Illustration étape de parcours",
        },
      ],
    });
  };

  // Helper to update gallery item
  const handleUpdateGalleryItem = (
    index: number,
    field: keyof MilestoneGalleryItem,
    value: string
  ) => {
    if (!editingMilestone || !editingMilestone.gallery) return;
    const nextGallery = [...editingMilestone.gallery];
    nextGallery[index] = {
      ...nextGallery[index],
      [field]: value,
    };
    setEditingMilestone({
      ...editingMilestone,
      gallery: nextGallery,
    });
  };

  // Helper to remove gallery item
  const handleRemoveGalleryItem = (index: number) => {
    if (!editingMilestone || !editingMilestone.gallery) return;
    const nextGallery = editingMilestone.gallery.filter((_, i) => i !== index);
    setEditingMilestone({
      ...editingMilestone,
      gallery: nextGallery,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || !editingMilestone.title || !editingMilestone.shortTitle) return;

    const mId = editingMilestone.id || `milestone-${Date.now()}`;
    const clean = sanitizeForFirestore(
      {
        ...editingMilestone,
        id: mId,
        updatedAt: new Date().toISOString(),
      },
      { removeEmptyStrings: true, removeEmptyObjects: true }
    ) as Record<string, unknown>;

    setPendingWrite({
      title: `Enregistrement du jalon : ${editingMilestone.title}`,
      description: "Validation requise avant écriture dans Firestore. Les champs vides ont été purgés pour préserver la qualité des données.",
      collection: "milestones",
      docId: mId,
      payload: clean,
      actionType: "setDoc",
      onConfirm: async () => {
        try {
          setLoading(true);
          await setDoc(doc(db, "milestones", mId), clean, { merge: true });
          setIsModalOpen(false);
          setEditingMilestone(null);
        } catch (err: unknown) {
          console.error("Error saving milestone:", err);
          const msg = getFirestoreErrorMessage(err);
          alert(`Données du parcours conservées en mémoire.\n\nNote Firestore : ${msg}`);
        } finally {
          setLoading(false);
        }
      },
    });

    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    const targetId = deleteConfirmId;

    setPendingWrite({
      title: `Suppression du jalon (ID: ${targetId})`,
      description: "Validation requise. Cette action va retirer ce jalon de votre base Firestore.",
      collection: "milestones",
      docId: targetId,
      payload: { action: "delete_milestone", id: targetId },
      actionType: "deleteDoc",
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteDoc(doc(db, "milestones", targetId));
          setDeleteConfirmId(null);
        } catch (err) {
          console.error("Error deleting milestone:", err);
          alert("Erreur lors de la suppression sur Firestore.");
        } finally {
          setLoading(false);
        }
      },
    });

    setIsConfirmModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold text-text">
              Trajectoire & Jalons ({milestonesList.length})
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Temps Réel Actif</span>
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Pilotez les étapes du parcours, leurs descriptions, photos multiples importées et métriques en direct.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Save All Milestones Batch button */}
          <button
            type="button"
            onClick={handleSaveAllMilestonesToFirestore}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-400 px-3.5 py-2 text-xs font-bold text-black hover:bg-emerald-300 transition-colors shadow-sm disabled:opacity-50"
            title="Enregistre définitivement toutes les étapes du parcours sur Firestore"
          >
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <FolderArchive size={13} />}
            <span>{saveAllSuccess ? "Parcours complet sauvegardé !" : "Sauvegarder Tout le Parcours"}</span>
          </button>

          <button
            type="button"
            onClick={handleSyncDefaults}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface/70 px-3 py-2 text-xs font-semibold text-text hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
            title="S'assure que toutes les étapes originelles sont présentes dans Firestore"
          >
            <RefreshCw size={13} className={syncing ? "animate-spin text-accent" : ""} />
            <span>{syncSuccess ? "Synchronisé !" : "Sync Base"}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={!isEditingEnabled}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs sm:text-sm font-bold text-bg transition-transform hover:scale-105 focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            <span>Nouvelle Étape</span>
          </button>
        </div>
      </div>

      {/* Global Edit Lock Status Banner */}
      {!isEditingEnabled ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-300">
                Mode Consultation Sécurisé — Parcours Verrouillé
              </h4>
              <p className="text-[11px] text-amber-200/80">
                L&apos;ajout, la suppression et la modification des étapes et photos du parcours nécessitent d&apos;activer le mode édition.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleEditing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-black hover:bg-amber-300 transition-colors shrink-0 shadow-md"
          >
            <span>🔓 Activer le Mode Édition</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Check size={18} />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-emerald-300">
                Mode Édition Déverrouillé
              </h4>
              <p className="text-[11px] text-emerald-200/80">
                Vous pouvez ajouter des photos multiples, éditer les descriptions et valider chaque étape du parcours.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleEditing}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-surface px-3 py-2 text-xs font-semibold text-text hover:bg-white/5 shrink-0"
          >
            <span>🔒 Verrouiller</span>
          </button>
        </div>
      )}

      {/* Save all feedback */}
      {saveAllSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 text-xs text-emerald-300">
          <Check size={16} />
          <span>L&apos;intégralité des {milestonesList.length} étapes et photos de parcours ont été enregistrées avec succès sur Firebase !</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {milestonesList.map((m) => (
          <div
            key={m.id}
            className="flex flex-col justify-between rounded-2xl border border-border/80 bg-surface/60 p-5 space-y-4 hover:border-accent/40 transition-colors"
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

              {/* Gallery summary count */}
              <div className="flex items-center gap-1.5 text-[11px] text-accent/80 pt-1">
                <ImageIcon size={12} />
                <span>{m.gallery?.length || 0} photo(s) dans la galerie</span>
              </div>
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
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-text hover:border-accent hover:text-accent transition-colors"
                >
                  <Edit2 size={13} />
                  <span>{isEditingEnabled ? "Éditer & Photos" : "Voir Détails"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(m.id)}
                  disabled={!isEditingEnabled}
                  className="rounded-lg border border-red-500/20 bg-red-500/5 p-1.5 text-red-400 hover:bg-red-500/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Supprimer l'étape"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-red-500/40 bg-[#0e110f] p-6 text-text shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/30">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-text">
                  Supprimer l&apos;étape de parcours
                </h3>
                <p className="text-xs text-muted">Cette action est irréversible.</p>
              </div>
            </div>

            <p className="text-xs text-text/80 leading-relaxed font-sans">
              Êtes-vous sûr de vouloir supprimer cette étape ?
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

      {/* Edit modal */}
      {isModalOpen && editingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-[#0d110e] p-6 sm:p-8 text-text shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-text">
                  {editingMilestone.id && milestonesList.some((m) => m.id === editingMilestone.id)
                    ? `Modifier : ${editingMilestone.shortTitle || "Étape"}`
                    : "Nouvelle Étape"}
                </h3>
                <p className="text-xs text-muted">
                  Éditez les détails du parcours et ajoutez plusieurs photos pour illustrer vos réalisations.
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

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="eyebrow mb-1 block text-xs">Numéro Étape</label>
                  <input
                    type="text"
                    disabled={!isEditingEnabled}
                    value={editingMilestone.stepNumber || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, stepNumber: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring font-mono disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Badge / Label</label>
                  <input
                    type="text"
                    disabled={!isEditingEnabled}
                    value={editingMilestone.badge || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, badge: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Date / Année</label>
                  <input
                    type="text"
                    disabled={!isEditingEnabled}
                    value={editingMilestone.date || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, date: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring font-mono disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="eyebrow mb-1 block text-xs">Titre Court *</label>
                  <input
                    type="text"
                    required
                    disabled={!isEditingEnabled}
                    value={editingMilestone.shortTitle || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, shortTitle: e.target.value })
                    }
                    placeholder="BACCALAURÉAT"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Titre Complet *</label>
                  <input
                    type="text"
                    required
                    disabled={!isEditingEnabled}
                    value={editingMilestone.title || ""}
                    onChange={(e) =>
                      setEditingMilestone({ ...editingMilestone, title: e.target.value })
                    }
                    placeholder="Baccalauréat Scientifique & Déclic Numérique"
                    className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Phrase d&apos;accroche (Headline)</label>
                <input
                  type="text"
                  disabled={!isEditingEnabled}
                  value={editingMilestone.headline || ""}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, headline: e.target.value })
                  }
                  placeholder="La naissance d'une curiosité sans limite..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring disabled:opacity-60"
                />
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Description de synthèse (Accueil)</label>
                <textarea
                  rows={2}
                  disabled={!isEditingEnabled}
                  value={editingMilestone.description || ""}
                  onChange={(e) =>
                    setEditingMilestone({ ...editingMilestone, description: e.target.value })
                  }
                  placeholder="Synthèse affichée sur la chronologie principale."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring leading-relaxed disabled:opacity-60"
                />
              </div>

              {/* Multi-Image Gallery Manager for Parcours */}
              <div className="rounded-2xl border border-border/80 bg-surface/40 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-text flex items-center gap-2">
                      <ImageIcon size={16} className="text-accent" />
                      <span>Photos & Galerie de cette étape ({editingMilestone.gallery?.length || 0})</span>
                    </h4>
                    <p className="text-[11px] text-muted">
                      Importez et ordonnez les photos qui illustrent vos projets, diplômes, captures d&apos;écrans ou architectures.
                    </p>
                  </div>
                  {isEditingEnabled && (
                    <button
                      type="button"
                      onClick={handleAddGalleryItem}
                      className="inline-flex items-center gap-1 rounded-xl bg-accent/15 border border-accent/30 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/25 transition-colors"
                    >
                      <Plus size={14} />
                      <span>Ajouter une photo</span>
                    </button>
                  )}
                </div>

                {(!editingMilestone.gallery || editingMilestone.gallery.length === 0) ? (
                  <div className="rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted space-y-2">
                    <ImageIcon size={28} className="mx-auto opacity-30 text-accent" />
                    <p>Aucune photo dans la galerie de cette étape.</p>
                    {isEditingEnabled && (
                      <button
                        type="button"
                        onClick={handleAddGalleryItem}
                        className="text-accent hover:underline font-semibold"
                      >
                        + Cliquez ici pour ajouter la première photo
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {editingMilestone.gallery.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border/80 bg-surface/80 p-4 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="font-mono text-xs font-bold text-accent">
                            Photo #{idx + 1}
                          </span>
                          {isEditingEnabled && (
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryItem(idx)}
                              className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 font-semibold"
                            >
                              <Trash2 size={13} />
                              <span>Supprimer</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <ImageUploader
                              label={`URL Photo #${idx + 1}`}
                              value={item.url}
                              onChange={(newUrl) => handleUpdateGalleryItem(idx, "url", newUrl)}
                              showCropTool={true}
                            />
                          </div>

                          <div className="space-y-2.5">
                            <div>
                              <label className="eyebrow mb-1 block text-[11px]">
                                Légende / Titre de la photo
                              </label>
                              <input
                                type="text"
                                disabled={!isEditingEnabled}
                                value={item.caption || ""}
                                onChange={(e) =>
                                  handleUpdateGalleryItem(idx, "caption", e.target.value)
                                }
                                placeholder="Ex: Prototype d'architecture sur Figma"
                                className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-text focus-ring disabled:opacity-60"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="eyebrow mb-1 block text-[11px]">
                                  Badge / Tag
                                </label>
                                <input
                                  type="text"
                                  disabled={!isEditingEnabled}
                                  value={item.tag || ""}
                                  onChange={(e) =>
                                    handleUpdateGalleryItem(idx, "tag", e.target.value)
                                  }
                                  placeholder="PROTOTYPE"
                                  className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-text focus-ring font-mono disabled:opacity-60"
                                />
                              </div>

                              <div>
                                <label className="eyebrow mb-1 block text-[11px]">
                                  Texte Alternatif (Alt)
                                </label>
                                <input
                                  type="text"
                                  disabled={!isEditingEnabled}
                                  value={item.alt || ""}
                                  onChange={(e) =>
                                    handleUpdateGalleryItem(idx, "alt", e.target.value)
                                  }
                                  placeholder="Capture d'écran..."
                                  className="w-full rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-text focus-ring disabled:opacity-60"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">
                  Technologies / Mots-clés (séparés par virgules)
                </label>
                <input
                  type="text"
                  disabled={!isEditingEnabled}
                  value={editingMilestone.technologies?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      technologies: e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-text focus-ring font-mono disabled:opacity-60"
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
                  disabled={loading || !isEditingEnabled}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-bold text-bg hover:scale-105 transition-transform disabled:opacity-50"
                >
                  {loading && <RefreshCw size={14} className="animate-spin" />}
                  <span>{loading ? "Sauvegarde..." : "Valider et Appliquer cette étape"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Confirmation Modal before any Firestore write */}
      <ConfirmWriteModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPendingWrite(null);
        }}
        pendingWrite={pendingWrite}
      />
    </div>
  );
}
