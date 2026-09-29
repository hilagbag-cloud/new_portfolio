"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Sparkles,
  FileText,
} from "lucide-react";
import type { LearningResource } from "@/data/learningResources";
import { trackResourceDownload } from "@/lib/learning-analytics";

interface Props {
  resource: LearningResource | null;
  onClose: () => void;
  onDownloaded?: () => void;
}

export function ResourceViewerModal({ resource, onClose, onDownloaded }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  if (!resource) return null;

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSelectQuiz = (quizId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [quizId]: optionKey }));
    setRevealedAnswers((prev) => ({ ...prev, [quizId]: true }));
  };

  const handleDownloadDocument = () => {
    trackResourceDownload(resource.id, resource.downloadCount);
    if (onDownloaded) onDownloaded();

    // Generate formatted printable HTML / Text file
    const docContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${resource.title} — Apprentissage Boosté by Hilarus</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 850px; margin: 40px auto; padding: 20px; color: #1f2937; }
    h1 { color: #0f172a; font-size: 26px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; }
    h2 { color: #1e3a8a; margin-top: 30px; font-size: 20px; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .quote { background: #f8fafc; border-left: 4px solid #38bdf8; padding: 12px 16px; margin: 16px 0; font-style: italic; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 13px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 6px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="badge">${resource.badge}</div>
  <h1>${resource.title}</h1>
  <p><strong>${resource.subtitle}</strong></p>
  <div class="quote">Crédits : Apprentissage Boosté — by Hilarus</div>
  <p>${resource.miniDescription}</p>

  ${
    resource.objectives
      ? `<h2>Objectifs du Support de Cours</h2><ul>${resource.objectives.map((o) => `<li>${o}</li>`).join("")}</ul>`
      : ""
  }

  ${resource.sections
    .map(
      (sec) => `
    <h2>${sec.themeNumber} : ${sec.title}</h2>
    <p>${sec.description}</p>
    ${sec.keyPoints ? `<ul>${sec.keyPoints.map((k) => `<li>${k}</li>`).join("")}</ul>` : ""}
    ${sec.codeSnippet ? `<pre><code>${sec.codeSnippet.code}</code></pre>` : ""}
  `
    )
    .join("")}

  <div class="footer">
    Ressource publiée sur la plateforme Apprentissage Boosté by Hilarus · Partage gratuit pour chercheurs et étudiants.
  </div>
</body>
</html>`;

    const blob = new Blob([docContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resource.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl border border-border bg-surface text-text shadow-2xl overflow-hidden"
        >
          {/* Top Bar inside modal */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent text-xs font-bold font-mono">
                {resource.type.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-muted hidden sm:inline">
                {resource.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadDocument}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent text-accent-contrast px-3.5 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
              >
                <Download size={14} />
                <span>Télécharger la ressource</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-border text-muted hover:text-text hover:border-accent transition-colors"
                title="Fermer"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Visual Cover Section with large title on chosen background color */}
            <div
              className="rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-lg border border-white/10"
              style={{ backgroundColor: resource.coverColor || "#0f2b48" }}
            >
              <div className="relative z-10 flex flex-col gap-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-white/20 px-2.5 py-1 text-xs font-mono font-bold tracking-wider uppercase text-white backdrop-blur-sm">
                    {resource.badge}
                  </span>
                  <span className="text-xs text-white/80 font-medium">
                    Apprentissage Boosté · by Hilarus
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-white drop-shadow-sm">
                  {resource.title}
                </h1>

                <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
                  {resource.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-white/80 font-mono">
                  <span>{resource.readTime}</span>
                  <span>·</span>
                  <span>Catégorie : {resource.category}</span>
                  <span>·</span>
                  <span>👁️ {resource.viewsCount} vues</span>
                  <span>·</span>
                  <span>⬇️ {resource.downloadCount} téléchargements</span>
                </div>
              </div>

              {/* Decorative background shape */}
              <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            </div>

            {/* Objectives block */}
            {resource.objectives && resource.objectives.length > 0 && (
              <div className="rounded-2xl border border-border bg-bg/60 p-5 sm:p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                  <Sparkles size={15} />
                  <span>Objectifs du Support de Cours</span>
                </div>
                <p className="text-xs sm:text-sm text-muted">
                  Ce document traite de manière approfondie des thématiques fondamentales du module :
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-text font-medium">
                  {resource.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent text-[11px] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Sections */}
            <div className="space-y-8">
              {resource.sections.map((sec, secIdx) => (
                <div
                  key={sec.id}
                  className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-accent font-semibold">
                    <span>{sec.themeNumber}</span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-text">
                    {sec.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-text/90 leading-relaxed">
                    {sec.description}
                  </p>

                  {/* Key Points */}
                  {sec.keyPoints && sec.keyPoints.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-muted font-semibold">
                        Concepts clés & Exigences :
                      </span>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-text/90">
                        {sec.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-accent mt-0.5">▪</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Code Snippet */}
                  {sec.codeSnippet && (
                    <div className="rounded-xl border border-border/80 bg-bg overflow-hidden mt-3">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface/50 text-xs text-muted font-mono">
                        <span>{sec.codeSnippet.title}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(sec.codeSnippet!.code, secIdx)}
                          className="inline-flex items-center gap-1 text-[11px] hover:text-accent transition-colors"
                        >
                          {copiedIndex === secIdx ? (
                            <>
                              <Check size={12} className="text-accent" />
                              <span className="text-accent">Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copier</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-text/90 overflow-x-auto leading-relaxed">
                        <code>{sec.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* External Links */}
                  {sec.links && sec.links.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-muted font-semibold block mb-2">
                        Ressources Externes & Vidéos Recommandées :
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sec.links.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-bg/40 hover:border-accent/80 hover:bg-surface transition-all text-xs group"
                          >
                            <div className="flex flex-col">
                              <span className="text-[10px] font-mono text-accent uppercase">
                                {link.type}
                              </span>
                              <span className="font-medium text-text group-hover:text-accent transition-colors">
                                {link.source}
                              </span>
                            </div>
                            <ExternalLink size={13} className="text-muted group-hover:text-accent shrink-0 ml-2" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Interactive QCM Quiz Section */}
            {resource.quiz && resource.quiz.length > 0 && (
              <div className="rounded-2xl border border-accent/40 bg-surface p-6 sm:p-7 space-y-6">
                <div className="flex items-center gap-2">
                  <HelpCircle className="text-accent" size={20} />
                  <div>
                    <h3 className="font-display text-lg font-bold text-text">
                      QCM de Validation & Exercices d&apos;Application
                    </h3>
                    <p className="text-xs text-muted">
                      Testez vos connaissances en temps réel sur les notions étudiées.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {resource.quiz.map((qcm, qIdx) => {
                    const selected = selectedAnswers[qcm.id];
                    const isRevealed = revealedAnswers[qcm.id];

                    return (
                      <div
                        key={qcm.id}
                        className="rounded-xl border border-border bg-bg/50 p-4 sm:p-5 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-accent font-bold">
                            Question {qIdx + 1}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-text">
                          {qcm.question}
                        </h4>

                        <div className="space-y-2">
                          {qcm.options.map((opt) => {
                            const isThisSelected = selected === opt.key;
                            const isCorrect = opt.key === qcm.correctKey;

                            let btnStyle = "border-border/80 bg-surface text-text hover:border-border";
                            if (isRevealed) {
                              if (isCorrect) {
                                btnStyle = "border-emerald-500 bg-emerald-500/15 text-emerald-400 font-semibold";
                              } else if (isThisSelected && !isCorrect) {
                                btnStyle = "border-red-500 bg-red-500/15 text-red-400";
                              }
                            } else if (isThisSelected) {
                              btnStyle = "border-accent bg-accent/15 text-accent font-semibold";
                            }

                            return (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => handleSelectQuiz(qcm.id, opt.key)}
                                className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                              >
                                <span className="flex items-center gap-2">
                                  <strong className="font-mono text-accent font-bold">
                                    {opt.key})
                                  </strong>
                                  <span>{opt.label}</span>
                                </span>
                                {isRevealed && isCorrect && (
                                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                                )}
                                {isRevealed && isThisSelected && !isCorrect && (
                                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {isRevealed && (
                          <div className="p-3 rounded-xl border border-border/80 bg-surface text-xs space-y-1">
                            <span className="font-mono font-bold text-accent">
                              Explication :
                            </span>
                            <p className="text-text/90">{qcm.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Modal Bottom Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface">
            <span className="text-xs text-muted">
              Apprentissage Boosté · Partage libre & gratuit
            </span>

            <button
              type="button"
              onClick={handleDownloadDocument}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent text-accent-contrast px-4 py-2 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Download size={14} />
              <span>Télécharger le support complet</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
