"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  ArrowLeft,
  Info,
  Send,
  Loader2,
  RotateCcw,
} from "lucide-react";

const SCALE_OPTIONS = [
  { value: "Pas du tout", score: 1, label: "Pas du tout", short: "1" },
  { value: "Plutôt non", score: 2, label: "Plutôt non", short: "2" },
  { value: "Neutre / Moyennement", score: 3, label: "Neutre / Moyennement", short: "3" },
  { value: "Plutôt oui", score: 4, label: "Plutôt oui", short: "4" },
  { value: "Tout à fait", score: 5, label: "Tout à fait", short: "5" },
];

export default function FormPage() {
  const [q1, setQ1] = useState<string>("");
  const [q2, setQ2] = useState<string>("");
  const [q3, setQ3] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute completion progress
  const answeredCount = [q1, q2, q3].filter(Boolean).length;
  const isFormComplete = answeredCount === 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Purely anonymous payload - zero PII (no name, no email, no IP)
      const payload = {
        q1_interest: q1,
        q2_online_reading: q2,
        q3_continue_learning: q3,
        submittedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "surveyResponses"), payload);
      setIsSuccess(true);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de la réponse :", err);
      setErrorMessage(
        "Une erreur est survenue lors de l'enregistrement. Merci de vérifier votre connexion et de réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setQ1("");
    setQ2("");
    setQ3("");
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col transition-colors selection:bg-accent selection:text-bg">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-semibold text-text hover:text-accent transition-colors"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1 text-muted group-hover:text-accent"
            />
            <span className="font-display">Hilarus</span>
            <span className="text-muted text-xs hidden sm:inline">· Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted font-mono hidden md:inline">
              Programme Recherche & Apprentissage
            </span>
            <ThemeToggle variant="compact" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form-view"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {/* Header & Welcome Banner */}
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 self-start rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-medium text-accent">
                  <BookOpen size={14} />
                  <span>Apprentissage Personnalisé & Recherche</span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text leading-tight">
                  Bienvenue au programme Apprentissage Boosté by Hilarus
                </h1>

                <p className="text-base sm:text-lg text-text/90 leading-relaxed">
                  Il s&apos;agit d&apos;un programme d&apos;apprentissage amélioré et personnalisé destiné aux chercheurs.
                </p>

                <div className="flex items-center gap-2 text-sm font-medium text-accent bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
                  <Sparkles size={18} className="shrink-0 text-accent" />
                  <span>
                    Si vous êtes ici c&apos;est que vous avez déjà profité d&apos;une ressource gratuite !
                  </span>
                </div>
              </div>

              {/* Humility & Transparency Card */}
              <div className="rounded-2xl border border-border/80 bg-surface/60 p-5 sm:p-6 backdrop-blur-sm relative overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-bg text-muted">
                    <Info size={16} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                      Note de partage en toute humilité
                    </span>
                    <blockquote className="text-sm sm:text-base italic text-text/90 leading-relaxed border-l-2 border-accent/60 pl-3 my-1">
                      « Ce programme ne signifie pas que je suis professionnel. Il s&apos;agit d&apos;une de mes
                      manières d&apos;apprendre que j&apos;ai décidé de partager avec vous gratuitement. »
                    </blockquote>
                    <p className="text-xs text-muted">
                      Votre avis m&apos;aide à comprendre vos besoins et à affiner ces ressources pour la communauté.
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex flex-col gap-2 bg-surface/30 border border-border/50 rounded-xl p-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted">Progression du questionnaire</span>
                  <span className="font-mono font-semibold text-accent">
                    {answeredCount} / 3 questions complétées
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/40">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(answeredCount / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Questionnaire Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* Question 1 */}
                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all hover:border-border/90">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/15 text-accent font-bold text-[11px]">
                      1
                    </span>
                    <span>Question 1 sur 3</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-text">
                    Êtes-vous intéressé par ce programme ?
                  </h3>

                  <p className="text-xs text-muted">
                    Indiquez votre niveau d&apos;intérêt pour un accompagnement d&apos;apprentissage adapté aux chercheurs.
                  </p>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {SCALE_OPTIONS.map((opt) => {
                      const isSelected = q1 === opt.value;
                      return (
                        <button
                          key={`q1-${opt.value}`}
                          type="button"
                          onClick={() => setQ1(opt.value)}
                          className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all text-xs font-medium cursor-pointer ${
                            isSelected
                              ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(168,243,90,0.15)] ring-1 ring-accent"
                              : "border-border/80 bg-bg/60 text-muted hover:border-border hover:text-text hover:bg-surface"
                          }`}
                        >
                          <span className="font-mono text-sm font-bold mb-1 opacity-70">
                            {opt.short}
                          </span>
                          <span className="leading-tight">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 2 */}
                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all hover:border-border/90">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/15 text-accent font-bold text-[11px]">
                      2
                    </span>
                    <span>Question 2 sur 3</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-text">
                    Lisez-vous souvent des documents en ligne ?
                  </h3>

                  <p className="text-xs text-muted">
                    Articles scientifiques, publications, documentations techniques ou cours ouverts.
                  </p>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {SCALE_OPTIONS.map((opt) => {
                      const isSelected = q2 === opt.value;
                      return (
                        <button
                          key={`q2-${opt.value}`}
                          type="button"
                          onClick={() => setQ2(opt.value)}
                          className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all text-xs font-medium cursor-pointer ${
                            isSelected
                              ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(168,243,90,0.15)] ring-1 ring-accent"
                              : "border-border/80 bg-bg/60 text-muted hover:border-border hover:text-text hover:bg-surface"
                          }`}
                        >
                          <span className="font-mono text-sm font-bold mb-1 opacity-70">
                            {opt.short}
                          </span>
                          <span className="leading-tight">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 3 */}
                <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all hover:border-border/90">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-wider">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-accent/15 text-accent font-bold text-[11px]">
                      3
                    </span>
                    <span>Question 3 sur 3</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-text">
                    Êtes-vous prêt à continuer l&apos;apprentissage ?
                  </h3>

                  <p className="text-xs text-muted">
                    Votre motivation à poursuivre le renforcement de vos compétences d&apos;investigation et d&apos;étude.
                  </p>

                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {SCALE_OPTIONS.map((opt) => {
                      const isSelected = q3 === opt.value;
                      return (
                        <button
                          key={`q3-${opt.value}`}
                          type="button"
                          onClick={() => setQ3(opt.value)}
                          className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all text-xs font-medium cursor-pointer ${
                            isSelected
                              ? "border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(168,243,90,0.15)] ring-1 ring-accent"
                              : "border-border/80 bg-bg/60 text-muted hover:border-border hover:text-text hover:bg-surface"
                          }`}
                        >
                          <span className="font-mono text-sm font-bold mb-1 opacity-70">
                            {opt.short}
                          </span>
                          <span className="leading-tight">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Privacy & Zero PII guarantee */}
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/40 px-4 py-3 text-xs text-muted">
                  <ShieldCheck size={18} className="shrink-0 text-accent" />
                  <span>
                    <strong className="text-text font-medium">Anonymat Garanti :</strong> Vos réponses
                    sont enregistrées de manière 100% anonyme. Aucune information personnelle (nom, email,
                    téléphone) n&apos;est demandée ni collectée.
                  </span>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-400">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors order-2 sm:order-1"
                  >
                    <ArrowLeft size={14} />
                    <span>Retour au site principal</span>
                  </Link>

                  <button
                    type="submit"
                    disabled={!isFormComplete || isSubmitting}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all order-1 sm:order-2 w-full sm:w-auto shadow-sm ${
                      isFormComplete && !isSubmitting
                        ? "bg-accent text-accent-contrast hover:opacity-90 cursor-pointer shadow-[0_0_16px_rgba(168,243,90,0.25)]"
                        : "bg-surface border border-border text-muted cursor-not-allowed opacity-60"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Envoi sécurisé...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Envoyer mes réponses</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            /* Success & Thank You Screen */
            <motion.div
              key="success-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center text-center py-12 px-4 gap-6 rounded-3xl border border-accent/30 bg-surface/80 backdrop-blur-md shadow-lg"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 text-accent shadow-[0_0_24px_rgba(168,243,90,0.25)]">
                <CheckCircle2 size={36} />
              </div>

              <div className="flex flex-col gap-2 max-w-lg">
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Réponse Enregistrée
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-text">
                  Merci beaucoup pour votre participation !
                </h2>
                <p className="text-sm sm:text-base text-muted leading-relaxed mt-1">
                  Votre retour a bien été pris en compte de manière strictement anonyme. Il nous aide à
                  adapter et faire évoluer les futures ressources gratuites pour la communauté des chercheurs.
                </p>
              </div>

              {/* Summary of submitted choices */}
              <div className="w-full max-w-md rounded-2xl border border-border bg-bg/80 p-4 text-left flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted">Intérêt pour le programme</span>
                  <span className="font-medium text-text">{q1}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="text-muted">Lecture en ligne</span>
                  <span className="font-medium text-text">{q2}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Prêt à continuer l&apos;apprentissage</span>
                  <span className="font-medium text-text">{q3}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-contrast px-6 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                >
                  <span>Retour à l&apos;accueil du portfolio</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-medium text-muted hover:text-text hover:border-accent transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Soumettre une autre réponse</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-surface/40 py-6 text-center text-xs text-muted">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Programme Apprentissage Boosté by Hilarus · Partage libre & gratuit</span>
          <span className="font-mono text-[11px]">Anonymat garanti sans collecte de données personnelles</span>
        </div>
      </footer>
    </div>
  );
}
