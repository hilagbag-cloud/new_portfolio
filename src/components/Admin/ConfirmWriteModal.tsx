"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Check,
  X,
  Database,
  ChevronDown,
  ChevronUp,
  FileCode2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export interface PendingFirestoreWrite {
  title: string;
  description: string;
  collection: string;
  docId?: string;
  payload: Record<string, unknown> | unknown[];
  actionType: "setDoc" | "batchWrite" | "deleteDoc" | "updateDoc";
  onConfirm: () => Promise<void>;
  onReject?: () => void;
}

interface ConfirmWriteModalProps {
  pendingWrite: PendingFirestoreWrite | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfirmWriteModal({
  pendingWrite,
  isOpen,
  onClose,
}: ConfirmWriteModalProps) {
  const [showRawJson, setShowRawJson] = useState(false);
  const [executing, setExecuting] = useState(false);

  if (!isOpen || !pendingWrite) return null;

  const handleConfirm = async () => {
    try {
      setExecuting(true);
      await pendingWrite.onConfirm();
      onClose();
    } catch (err) {
      console.error("Confirmation execution error:", err);
    } finally {
      setExecuting(false);
    }
  };

  const handleReject = () => {
    if (pendingWrite.onReject) {
      pendingWrite.onReject();
    }
    onClose();
  };

  const isDelete = pendingWrite.actionType === "deleteDoc";
  const jsonPreview = JSON.stringify(pendingWrite.payload, null, 2);
  const keysCount =
    typeof pendingWrite.payload === "object" && !Array.isArray(pendingWrite.payload)
      ? Object.keys(pendingWrite.payload || {}).length
      : Array.isArray(pendingWrite.payload)
      ? pendingWrite.payload.length
      : 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-amber-500/40 bg-[#0c100d] text-text shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 bg-surface/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-text flex items-center gap-2">
                <span>Validation d&apos;Écriture Requise</span>
              </h3>
              <p className="text-xs text-muted">
                Aucune écriture automatique • Confirmation manuelle obligatoire
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReject}
            disabled={executing}
            className="rounded-lg p-1.5 text-muted hover:bg-white/5 hover:text-text transition-colors disabled:opacity-50"
            title="Rejeter et fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
          {/* Operation info banner */}
          <div className="rounded-xl border border-border/70 bg-surface/50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="eyebrow flex items-center gap-1.5 text-accent">
                <Database size={13} />
                <span>Action Firestore : {pendingWrite.actionType}</span>
              </span>
              <span className="font-mono text-[11px] text-muted">
                Collection: <strong className="text-text">{pendingWrite.collection}</strong>
                {pendingWrite.docId && <> / ID: <strong className="text-text">{pendingWrite.docId}</strong></>}
              </span>
            </div>

            <h4 className="font-bold text-text text-sm">
              {pendingWrite.title}
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              {pendingWrite.description}
            </p>
          </div>

          {/* Clean fields notice */}
          {!isDelete && (
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
              <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-emerald-300">
                  Nettoyage des champs vides appliqué :
                </span>{" "}
                {keysCount} champ(s) et propriétés non vides seront enregistrés. Les champs laissés vides ont été automatiquement retirés du document pour garder votre base saine.
              </div>
            </div>
          )}

          {/* JSON Payload Inspector Accordion */}
          <div className="rounded-xl border border-border/80 bg-black/40 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-xs text-muted hover:text-text hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-mono">
                <FileCode2 size={14} className="text-accent" />
                <span>Aperçu des données à envoyer ({keysCount} éléments)</span>
              </span>
              {showRawJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showRawJson && (
              <div className="max-h-52 overflow-auto border-t border-border/60 p-3 text-[11px] font-mono text-emerald-300/90 bg-[#070a08] whitespace-pre">
                {jsonPreview}
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 bg-surface/60 px-6 py-4">
          <button
            type="button"
            onClick={handleReject}
            disabled={executing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            <X size={14} />
            <span>Rejeter / Annuler</span>
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={executing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-xs font-bold text-bg hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
          >
            {executing ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Check size={14} />
            )}
            <span>
              {executing
                ? "Écriture en cours..."
                : isDelete
                ? "Confirmer la Suppression"
                : "Valider l'écriture Firestore"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
