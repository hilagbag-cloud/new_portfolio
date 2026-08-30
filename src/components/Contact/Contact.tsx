"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Send,
} from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { site } from "@/data/site";
import { useCmsSiteConfig } from "@/lib/cms-hooks";
import { SocialFloatingTooltipList } from "@/components/Socials/SocialFloatingTooltipList";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "projectType" | "message", string>>;

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const cmsConfig = useCmsSiteConfig();

  function validate(formData: FormData): Errors {
    const next: Errors = {};
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const projectType = String(formData.get("projectType") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name) next.name = "Votre nom est requis.";
    if (!email) next.email = "Votre adresse email est requise.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Format d'email invalide.";
    if (!projectType) next.projectType = "Veuillez choisir un domaine.";
    if (!message) next.message = "Veuillez préciser votre message.";

    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const name = String(formData.get("name") ?? "").trim();
      const email = String(formData.get("email") ?? "").trim();
      const projectType = String(formData.get("projectType") ?? "").trim();
      const message = String(formData.get("message") ?? "").trim();

      await addDoc(collection(db, "messages"), {
        name,
        email,
        projectType,
        message,
        status: "unread",
        createdAt: new Date().toISOString(),
      });

      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("Error sending message:", err);
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-text placeholder:text-muted/60 focus-ring focus:border-accent transition-all text-sm";

  return (
    <section id="contact" className="section-shell py-24 md:py-32 relative">
      {/* Section Header */}
      <div className="mb-14 md:mb-18 max-w-2xl">
        <div className="eyebrow text-accent mb-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span>INITIALISATION & CONTACT</span>
        </div>
        <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-text tracking-tight uppercase">
          {cmsConfig?.contactText ? "PARLONS-EN." : site.contact.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
          Accédez directement à mes canaux en un clic ou remplissez le formulaire ci-contre pour transmettre votre projet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: 1-CLICK DIRECT INTERACTIVE REVEALING ICONS
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-border/80 bg-surface/50 p-6 md:p-8 backdrop-blur-sm shadow-xl space-y-6">
            <div className="space-y-2">
              <div className="eyebrow text-xs text-accent flex items-center gap-2">
                <Sparkles size={14} className="text-accent" />
                <span>Accès Direct & Réseaux</span>
              </div>
              <h3 className="font-display text-2xl text-text font-bold">
                Me contacter en direct
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Survolez chaque icône pour révéler le nom du réseau et cliquez pour y accéder immédiatement.
              </p>
            </div>

            {/* Revealing Floating Tooltip Social & Direct Channels List */}
            <div className="pt-2 pb-2">
              <SocialFloatingTooltipList className="!justify-start gap-4" />
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <span className="eyebrow text-[11px] text-muted block">
                Disponibilité
              </span>
              <p className="text-xs text-muted/80 leading-relaxed font-mono">
                Réponse sous 24 heures aux propositions de projets, opportunités d&apos;ingénierie et collaborations de design.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: COMPREHENSIVE PROJECT INQUIRY FORM
            ========================================================================= */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-border bg-surface p-7 md:p-9 shadow-xl">
            <div className="mb-6">
              <h3 className="font-display text-2xl text-text font-bold">
                Formulaire de projet détaillé
              </h3>
              <p className="text-xs text-muted mt-1">
                Idéal pour structurer votre besoin technique ou demander une estimation.
              </p>
            </div>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                role="status"
                className="flex items-center gap-4 rounded-2xl border border-accent/50 bg-surface p-7 text-text shadow-xl"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                  <CheckCircle2 size={28} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-display text-xl text-text">Message transmis avec succès</h4>
                  <p className="text-xs sm:text-sm text-muted mt-1">
                    Merci pour votre message ! Je vous répondrai sur votre email sous 24h.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="eyebrow mb-2 block text-xs">
                      Votre Nom / Entreprise *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Alexandre Dumas"
                      className={fieldClass}
                    />
                    {errors.name && (
                      <p role="alert" className="mt-1.5 text-xs text-red-500 font-medium">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="eyebrow mb-2 block text-xs">
                      Votre Email de réponse *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="alex@entreprise.com"
                      className={fieldClass}
                    />
                    {errors.email && (
                      <p role="alert" className="mt-1.5 text-xs text-accent">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="projectType" className="eyebrow mb-2 block text-xs">
                    Nature de votre projet *
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    defaultValue=""
                    className={fieldClass}
                  >
                    <option value="" disabled>
                      Sélectionner le domaine d&apos;intervention…
                    </option>
                    {site.contact.projectTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.projectType && (
                    <p role="alert" className="mt-1.5 text-xs text-accent">
                      {errors.projectType}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="eyebrow mb-2 block text-xs">
                    Détails du besoin & Objectifs *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Expliquez brièvement votre idée, les fonctionnalités clés, le calendrier ou le problème à résoudre..."
                    className={fieldClass}
                  />
                  {errors.message && (
                    <p role="alert" className="mt-1.5 text-xs text-accent">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn-learn-more group focus-ring !min-w-[14.5rem] !h-[3.25rem] w-full sm:w-auto"
                  >
                    <span className="circle !w-[3.25rem] !h-[3.25rem]" aria-hidden="true">
                      {status === "loading" ? (
                        <span className="flex h-full w-full items-center justify-center text-bg">
                          <Loader2 size={18} className="animate-spin" />
                        </span>
                      ) : (
                        <span className="icon arrow"></span>
                      )}
                    </span>
                    <span className="button-text !py-[1rem] !text-xs">
                      {status === "loading" ? "ENVOI EN COURS..." : "ENVOYER LE MESSAGE"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
