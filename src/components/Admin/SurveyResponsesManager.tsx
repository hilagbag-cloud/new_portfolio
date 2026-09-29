"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  collection,
  doc,
  onSnapshot,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  GraduationCap,
  ExternalLink,
  Download,
  Trash2,
  Users,
  TrendingUp,
  BookOpen,
  CheckCircle,
  RefreshCw,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { ConfirmWriteModal, type PendingFirestoreWrite } from "./ConfirmWriteModal";

export interface SurveyResponseItem {
  id: string;
  q1_interest: string;
  q2_online_reading: string;
  q3_continue_learning: string;
  submittedAt: string;
}

const SCALE_LABELS = [
  "Tout à fait",
  "Plutôt oui",
  "Neutre / Moyennement",
  "Plutôt non",
  "Pas du tout",
];

interface Props {
  isEditingEnabled?: boolean;
}

export function SurveyResponsesManager({ isEditingEnabled = false }: Props) {
  const [responses, setResponses] = useState<SurveyResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Modal de confirmation de suppression
  const [pendingWrite, setPendingWrite] = useState<PendingFirestoreWrite | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "surveyResponses"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as SurveyResponseItem[];

        // Tri par date décroissante (plus récent d'abord)
        list.sort(
          (a, b) =>
            new Date(b.submittedAt || 0).getTime() -
            new Date(a.submittedAt || 0).getTime()
        );

        setResponses(list);
        setLoading(false);
      },
      (error) => {
        console.error("Erreur d'écoute Firestore sur surveyResponses :", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const total = responses.length;
    if (total === 0) {
      return {
        total: 0,
        highInterestPct: 0,
        regularReaderPct: 0,
        readyToLearnPct: 0,
        q1Distribution: {} as Record<string, number>,
        q2Distribution: {} as Record<string, number>,
        q3Distribution: {} as Record<string, number>,
      };
    }

    const calcDist = (key: keyof SurveyResponseItem) => {
      const counts: Record<string, number> = {};
      SCALE_LABELS.forEach((l) => (counts[l] = 0));
      responses.forEach((r) => {
        const val = (r[key] as string) || "Autre";
        counts[val] = (counts[val] || 0) + 1;
      });
      return counts;
    };

    const q1Dist = calcDist("q1_interest");
    const q2Dist = calcDist("q2_online_reading");
    const q3Dist = calcDist("q3_continue_learning");

    const highInterestCount =
      (q1Dist["Tout à fait"] || 0) + (q1Dist["Plutôt oui"] || 0);
    const regularReaderCount =
      (q2Dist["Tout à fait"] || 0) + (q2Dist["Plutôt oui"] || 0);
    const readyToLearnCount =
      (q3Dist["Tout à fait"] || 0) + (q3Dist["Plutôt oui"] || 0);

    return {
      total,
      highInterestPct: Math.round((highInterestCount / total) * 100),
      regularReaderPct: Math.round((regularReaderCount / total) * 100),
      readyToLearnPct: Math.round((readyToLearnCount / total) * 100),
      q1Distribution: q1Dist,
      q2Distribution: q2Dist,
      q3Distribution: q3Dist,
    };
  }, [responses]);

  // Filtrage du tableau
  const filteredResponses = useMemo(() => {
    if (selectedFilter === "all") return responses;
    if (selectedFilter === "high_interest") {
      return responses.filter(
        (r) => r.q1_interest === "Tout à fait" || r.q1_interest === "Plutôt oui"
      );
    }
    if (selectedFilter === "neutral") {
      return responses.filter((r) => r.q1_interest === "Neutre / Moyennement");
    }
    if (selectedFilter === "low_interest") {
      return responses.filter(
        (r) => r.q1_interest === "Plutôt non" || r.q1_interest === "Pas du tout"
      );
    }
    return responses;
  }, [responses, selectedFilter]);

  // Export CSV sécurisé sans données personnelles
  const handleExportCSV = () => {
    if (responses.length === 0) return;

    const headers = [
      "ID_Anonyme",
      "Date_Soumission",
      "Interet_Programme",
      "Lecture_Documents_En_Ligne",
      "Pret_Continuer_Apprentissage",
    ];

    const rows = responses.map((r, index) => [
      `Chercheur_${index + 1}`,
      r.submittedAt ? new Date(r.submittedAt).toLocaleString("fr-FR") : "N/A",
      `"${r.q1_interest || ""}"`,
      `"${r.q2_online_reading || ""}"`,
      `"${r.q3_continue_learning || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(";"), ...rows.map((e) => e.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `programme_apprentissage_reponses_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Suppression d'une entrée avec confirmation
  const handleDelete = (id: string, index: number) => {
    setPendingWrite({
      title: `Suppression de la réponse anonyme #${index + 1}`,
      description:
        "Validation requise. Cette action supprimera définitivement cette réponse de la base Firestore.",
      collection: "surveyResponses",
      docId: id,
      payload: { action: "delete_survey_response", id },
      actionType: "deleteDoc",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "surveyResponses", id));
        } catch (err) {
          console.error("Erreur lors de la suppression Firestore :", err);
          alert("Erreur lors de la suppression de la réponse sur Firestore.");
        }
      },
    });

    setIsConfirmModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-text">
              Programme Apprentissage Boosté
            </h2>
            <span className="rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent font-semibold">
              /form
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Retours d&apos;expérience et évaluation des chercheurs (100% anonyme, zéro donnée personnelle).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/form"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-medium text-text hover:border-accent hover:text-accent transition-colors shadow-sm"
          >
            <span>Voir la page /form</span>
            <ExternalLink size={13} />
          </Link>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={responses.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-medium text-text hover:border-accent hover:text-accent transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={13} />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted">
              Total Retours
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-text tabular-nums">
              {stats.total}
            </span>
            <span className="text-xs text-muted">chercheurs</span>
          </div>
          <p className="mt-1 text-[11px] text-muted">Soumissions complètes sans PII</p>
        </div>

        {/* Intérêt élevé */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted">
              Intérêt Positif
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-text tabular-nums">
              {stats.highInterestPct}%
            </span>
            <span className="text-xs text-muted">favorables</span>
          </div>
          <p className="mt-1 text-[11px] text-muted">Tout à fait ou Plutôt oui</p>
        </div>

        {/* Lecteurs en ligne */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted">
              Lecteurs En Ligne
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <BookOpen size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-text tabular-nums">
              {stats.regularReaderPct}%
            </span>
            <span className="text-xs text-muted">assidus</span>
          </div>
          <p className="mt-1 text-[11px] text-muted">Habitués aux ressources web</p>
        </div>

        {/* Prêts à continuer */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted">
              Prêts à Continuer
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <CheckCircle size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-text tabular-nums">
              {stats.readyToLearnPct}%
            </span>
            <span className="text-xs text-muted">motivés</span>
          </div>
          <p className="mt-1 text-[11px] text-muted">Désireux d&apos;approfondir</p>
        </div>
      </div>

      {/* Visual Percentage Breakdown Sections */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border/60 gap-2">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-text">
              Répartition des Réponses par Question (Échelle 1 à 5)
            </h3>
            <p className="text-xs text-muted">
              Distribution des avis et pourcentages calculés sur l&apos;ensemble des participations.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-1 self-start sm:self-auto">
            <ShieldCheck size={14} />
            <span>Données Anonymisées</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question 1 breakdown */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-bg/50 p-4">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted">
              <span className="font-bold text-accent">Q1.</span>
              <span>Intérêt pour le programme</span>
            </div>
            <div className="space-y-2 mt-1">
              {SCALE_LABELS.map((label) => {
                const count = stats.q1Distribution[label] || 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={`q1-${label}`} className="text-xs space-y-1">
                    <div className="flex justify-between text-muted">
                      <span className="text-text font-medium">{label}</span>
                      <span className="font-mono tabular-nums">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question 2 breakdown */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-bg/50 p-4">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted">
              <span className="font-bold text-accent">Q2.</span>
              <span>Lecture de documents en ligne</span>
            </div>
            <div className="space-y-2 mt-1">
              {SCALE_LABELS.map((label) => {
                const count = stats.q2Distribution[label] || 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={`q2-${label}`} className="text-xs space-y-1">
                    <div className="flex justify-between text-muted">
                      <span className="text-text font-medium">{label}</span>
                      <span className="font-mono tabular-nums">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question 3 breakdown */}
          <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-bg/50 p-4">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted">
              <span className="font-bold text-accent">Q3.</span>
              <span>Prêt à continuer l&apos;apprentissage</span>
            </div>
            <div className="space-y-2 mt-1">
              {SCALE_LABELS.map((label) => {
                const count = stats.q3Distribution[label] || 0;
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={`q3-${label}`} className="text-xs space-y-1">
                    <div className="flex justify-between text-muted">
                      <span className="text-text font-medium">{label}</span>
                      <span className="font-mono tabular-nums">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-border/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chronological Table View */}
      <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 border-b border-border/60 gap-3">
          <div>
            <h3 className="font-display text-base font-bold text-text">
              Journal des Réponses Reçues ({filteredResponses.length})
            </h3>
            <p className="text-xs text-muted">
              Historique des soumissions anonymes par ordre chronologique.
            </p>
          </div>

          {/* Filter segment */}
          <div className="flex items-center gap-1 rounded-xl border border-border bg-bg p-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilter("all")}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                selectedFilter === "all"
                  ? "bg-surface text-accent shadow-sm font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Tous ({responses.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("high_interest")}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                selectedFilter === "high_interest"
                  ? "bg-surface text-accent shadow-sm font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Positifs
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("neutral")}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                selectedFilter === "neutral"
                  ? "bg-surface text-accent shadow-sm font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Neutres
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter("low_interest")}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                selectedFilter === "low_interest"
                  ? "bg-surface text-accent shadow-sm font-semibold"
                  : "text-muted hover:text-text"
              }`}
            >
              Réservés
            </button>
          </div>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="py-16 text-center text-xs text-muted flex flex-col items-center gap-2">
            <RefreshCw size={18} className="animate-spin text-accent" />
            <span>Chargement des réponses Firestore...</span>
          </div>
        ) : filteredResponses.length === 0 ? (
          <div className="py-16 px-4 text-center flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface border border-border text-muted">
              <GraduationCap size={22} />
            </div>
            <h4 className="text-sm font-semibold text-text">Aucune réponse pour le moment</h4>
            <p className="text-xs text-muted max-w-sm">
              Partagez le lien de votre formulaire public aux chercheurs ou testez vous-même la saisie.
            </p>
            <Link
              href="/form"
              target="_blank"
              className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-accent text-black font-bold px-4 py-2 text-xs hover:brightness-105 transition-all shadow-sm"
            >
              <span>Accéder à /form</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg/60 border-b border-border text-muted uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Date de Réception</th>
                  <th className="py-3 px-4">Intérêt (Q1)</th>
                  <th className="py-3 px-4">Lecture en Ligne (Q2)</th>
                  <th className="py-3 px-4">Prêt à Continuer (Q3)</th>
                  {isEditingEnabled && (
                    <th className="py-3 px-4 text-right">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredResponses.map((r, idx) => {
                  const dateStr = r.submittedAt
                    ? new Date(r.submittedAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Date inconnue";

                  const isHigh =
                    r.q1_interest === "Tout à fait" || r.q1_interest === "Plutôt oui";

                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-bg/40 transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono text-muted tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            isHigh
                              ? "bg-accent/15 text-accent border border-accent/30"
                              : "bg-surface border border-border text-text"
                          }`}
                        >
                          {r.q1_interest || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text font-medium">
                        {r.q2_online_reading || "—"}
                      </td>
                      <td className="py-3 px-4 text-text font-medium">
                        {r.q3_continue_learning || "—"}
                      </td>
                      {isEditingEnabled && (
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id, idx)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Supprimer cette réponse de test"
                          >
                            <Trash2 size={12} />
                            <span>Supprimer</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmWriteModal
        isOpen={isConfirmModalOpen}
        pendingWrite={pendingWrite}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPendingWrite(null);
        }}
      />
    </div>
  );
}
