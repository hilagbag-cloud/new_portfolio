"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  X,
  RefreshCw,
  HelpCircle,
  HardDrive,
  UserCheck,
  FileCode2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import type { DetailedFirestoreErrorInfo } from "@/lib/firestore-utils";
import { auth } from "@/lib/firebase";

interface FirestoreErrorModalProps {
  errorInfo: DetailedFirestoreErrorInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

export function FirestoreErrorModal({
  errorInfo,
  isOpen,
  onClose,
  onRetry,
}: FirestoreErrorModalProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!isOpen || !errorInfo) return null;

  const currentUser = auth.currentUser;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-red-500/50 bg-[#0e0a0a] text-text shadow-2xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-red-500/30 bg-red-950/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-red-200">
                  Diagnostic d&apos;Erreur Firebase
                </h3>
                <span className="rounded-md border border-red-500/40 bg-red-500/15 px-2 py-0.5 font-mono text-[10px] text-red-300">
                  Code: {errorInfo.code}
                </span>
              </div>
              <p className="text-xs text-red-300/70">
                Détails complets de l&apos;incident • Données préservées localement
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-white/10 hover:text-text transition-colors"
            title="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Main Error Announcement */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 space-y-2">
            <h4 className="font-bold text-sm text-red-200">{errorInfo.title}</h4>
            <p className="text-red-100/90 leading-relaxed text-xs">
              {errorInfo.explanation}
            </p>
          </div>

          {/* Context Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
            {/* Payload Size Meter */}
            <div className="rounded-xl border border-border/70 bg-surface/50 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-muted">
                <span className="flex items-center gap-1.5 text-text">
                  <HardDrive size={13} className="text-accent" />
                  <span>Poids du Document</span>
                </span>
                <span
                  className={`font-bold ${
                    errorInfo.isPayloadTooLarge ? "text-red-400" : "text-emerald-300"
                  }`}
                >
                  {errorInfo.payloadSizeFormatted} / 1.00 Mo
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-border/40">
                <div
                  className={`h-full rounded-full transition-all ${
                    errorInfo.isPayloadTooLarge
                      ? "bg-red-500"
                      : errorInfo.payloadSizeBytes > 700 * 1024
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      (errorInfo.payloadSizeBytes / (1024 * 1024)) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted block">
                {errorInfo.isPayloadTooLarge
                  ? "⚠️ Dépassement de la limite Firestore (1 Mo)"
                  : "Taille dans les normes requises"}
              </span>
            </div>

            {/* Auth status */}
            <div className="rounded-xl border border-border/70 bg-surface/50 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-muted">
                <span className="flex items-center gap-1.5 text-text">
                  <UserCheck size={13} className="text-accent" />
                  <span>Session Utilisateur</span>
                </span>
                <span className="font-semibold text-text">
                  {currentUser ? "Connecté" : "Non connecté"}
                </span>
              </div>
              <p className="text-[10px] text-muted truncate">
                {currentUser?.email || "Aucun compte actif"}
              </p>
              {currentUser && (
                <span className="text-[10px] text-muted block truncate">
                  UID: {currentUser.uid}
                </span>
              )}
            </div>
          </div>

          {/* Actionable Suggestions & Solutions */}
          <div className="rounded-xl border border-border/80 bg-surface/60 p-4 space-y-2.5">
            <h5 className="font-semibold text-xs text-text flex items-center gap-1.5">
              <HelpCircle size={14} className="text-accent" />
              <span>Actions Recommandées pour Résoudre ce Problème :</span>
            </h5>
            <ul className="space-y-1.5 text-muted pl-1">
              {errorInfo.solutions.map((sol, index) => (
                <li key={index} className="flex items-start gap-2 text-xs">
                  <CheckCircle2 size={13} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-text/90">{sol}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Details Accordion */}
          <div className="rounded-xl border border-border/70 bg-black/40 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-xs text-muted hover:text-text hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-mono">
                <FileCode2 size={14} className="text-red-400" />
                <span>Message technique brut Firebase</span>
              </span>
              {showTechnicalDetails ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
            </button>

            {showTechnicalDetails && (
              <div className="border-t border-border/60 p-3 space-y-2 bg-[#060807]">
                <div className="font-mono text-[11px] text-red-300/90 whitespace-pre-wrap break-all">
                  {errorInfo.technicalMessage}
                </div>
                {errorInfo.targetPath && (
                  <div className="text-[10px] font-mono text-muted border-t border-border/40 pt-2">
                    Chemin cible : <strong>{errorInfo.targetPath}</strong> | Heure : {errorInfo.timestamp}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 bg-surface/80 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text hover:bg-white/5 transition-colors"
          >
            <span>Fermer & Garder en Brouillon</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onRetry && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRetry();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-xs font-bold text-accent-contrast hover:scale-105 transition-transform shadow-lg"
              >
                <RefreshCw size={13} />
                <span>Réessayer l&apos;écriture</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
