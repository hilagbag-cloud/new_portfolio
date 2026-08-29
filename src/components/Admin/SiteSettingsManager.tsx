"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, resolvedFirebaseConfig } from "@/lib/firebase";
import { defaultSiteMetadata, type SiteMetadataConfig } from "@/lib/cms-meta";
import {
  Save,
  Check,
  Database,
  RefreshCw,
  Globe,
  Share2,
  Sliders,
  Copy,
  ExternalLink,
  Shield,
  Server,
  Layers,
  Sparkles,
  Search,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { seedInitialCmsData } from "@/lib/cms-seed";
import { ImageUploader } from "./ImageUploader";

export function SiteSettingsManager() {
  const [activeSubTab, setActiveSubTab] = useState<"seo" | "content" | "dns">("seo");

  // Metadata & SEO state
  const [metaTitle, setMetaTitle] = useState(defaultSiteMetadata.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(defaultSiteMetadata.metaDescription || "");
  const [keywords, setKeywords] = useState(defaultSiteMetadata.keywords?.join(", ") || "");
  const [ogTitle, setOgTitle] = useState(defaultSiteMetadata.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(defaultSiteMetadata.ogDescription || "");
  const [ogImage, setOgImage] = useState(defaultSiteMetadata.ogImage || "");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image">("summary_large_image");
  const [siteUrl, setSiteUrl] = useState(defaultSiteMetadata.siteUrl || "https://hilarus.dev");
  const [author, setAuthor] = useState(defaultSiteMetadata.author || "Hilarus Gbagoule");

  // Content state
  const [positioning, setPositioning] = useState(defaultSiteMetadata.positioning || "");
  const [tags, setTags] = useState(defaultSiteMetadata.tags?.join(", ") || "");
  const [contactText, setContactText] = useState(defaultSiteMetadata.contactText || "");
  const [contactEmail, setContactEmail] = useState(defaultSiteMetadata.contactEmail || "hilaruskazak@gmail.com");
  const [profileImage, setProfileImage] = useState(defaultSiteMetadata.profileImage || "");

  // Socials & Direct Channels state
  const [dribbbleUrl, setDribbbleUrl] = useState(defaultSiteMetadata.socials?.dribbble || "");
  const [behanceUrl, setBehanceUrl] = useState(defaultSiteMetadata.socials?.behance || "");
  const [linkedinUrl, setLinkedinUrl] = useState(defaultSiteMetadata.socials?.linkedin || "");
  const [twitterUrl, setTwitterUrl] = useState(defaultSiteMetadata.socials?.twitter || "");
  const [githubUrl, setGithubUrl] = useState(defaultSiteMetadata.socials?.github || "");
  const [instagramUrl, setInstagramUrl] = useState(defaultSiteMetadata.socials?.instagram || "");
  const [facebookUrl, setFacebookUrl] = useState(defaultSiteMetadata.socials?.facebook || "");
  const [threadsUrl, setThreadsUrl] = useState(defaultSiteMetadata.socials?.threads || "");
  const [telegramUrl, setTelegramUrl] = useState(defaultSiteMetadata.socials?.telegram || "");
  const [whatsappUrl, setWhatsappUrl] = useState(defaultSiteMetadata.contactChannels?.whatsapp || "");
  const [phoneVal, setPhoneVal] = useState(defaultSiteMetadata.contactChannels?.phone || "");
  const [calendlyUrl, setCalendlyUrl] = useState(defaultSiteMetadata.contactChannels?.calendly || "");

  // Status state
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedDns, setCopiedDns] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const docSnap = await getDoc(doc(db, "siteConfig", "global"));
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteMetadataConfig;
          if (data.metaTitle) setMetaTitle(data.metaTitle);
          if (data.metaDescription) setMetaDescription(data.metaDescription);
          if (data.keywords) {
            setKeywords(Array.isArray(data.keywords) ? data.keywords.join(", ") : data.keywords);
          }
          if (data.ogTitle) setOgTitle(data.ogTitle);
          if (data.ogDescription) setOgDescription(data.ogDescription);
          if (data.ogImage) setOgImage(data.ogImage);
          if (data.twitterCard) setTwitterCard(data.twitterCard);
          if (data.siteUrl) setSiteUrl(data.siteUrl);
          if (data.author) setAuthor(data.author);
          if (data.positioning) setPositioning(data.positioning);
          if (data.profileImage) setProfileImage(data.profileImage);
          if (data.tags) {
            setTags(Array.isArray(data.tags) ? data.tags.join(", ") : data.tags);
          }
          if (data.contactText) setContactText(data.contactText);
          if (data.contactEmail) setContactEmail(data.contactEmail);

          if (data.socials) {
            if (data.socials.dribbble) setDribbbleUrl(data.socials.dribbble);
            if (data.socials.behance) setBehanceUrl(data.socials.behance);
            if (data.socials.linkedin) setLinkedinUrl(data.socials.linkedin);
            if (data.socials.twitter) setTwitterUrl(data.socials.twitter);
            if (data.socials.github) setGithubUrl(data.socials.github);
            if (data.socials.instagram) setInstagramUrl(data.socials.instagram);
            if (data.socials.facebook) setFacebookUrl(data.socials.facebook);
            if (data.socials.threads) setThreadsUrl(data.socials.threads);
            if (data.socials.telegram) setTelegramUrl(data.socials.telegram);
          }

          if (data.contactChannels) {
            if (data.contactChannels.whatsapp) setWhatsappUrl(data.contactChannels.whatsapp);
            if (data.contactChannels.telegram) setTelegramUrl(data.contactChannels.telegram);
            if (data.contactChannels.phone) setPhoneVal(data.contactChannels.phone);
            if (data.contactChannels.calendly) setCalendlyUrl(data.contactChannels.calendly);
            if (data.contactChannels.email) setContactEmail(data.contactChannels.email);
          }
        }
      } catch (err) {
        console.error("Error loading site config:", err);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload: SiteMetadataConfig = {
        metaTitle,
        metaDescription,
        keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        ogTitle: ogTitle || metaTitle,
        ogDescription: ogDescription || metaDescription,
        ogImage,
        profileImage,
        twitterCard,
        siteUrl,
        author,
        positioning,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        contactText,
        contactEmail,
        socials: {
          dribbble: dribbbleUrl,
          behance: behanceUrl,
          linkedin: linkedinUrl,
          twitter: twitterUrl,
          github: githubUrl,
          instagram: instagramUrl,
          facebook: facebookUrl,
          threads: threadsUrl,
          whatsapp: whatsappUrl,
          telegram: telegramUrl,
        },
        contactChannels: {
          email: contactEmail,
          whatsapp: whatsappUrl,
          telegram: telegramUrl,
          linkedin: linkedinUrl,
          instagram: instagramUrl,
          facebook: facebookUrl,
          threads: threadsUrl,
          twitter: twitterUrl,
          github: githubUrl,
          phone: phoneVal,
          calendly: calendlyUrl,
        },
      };

      await setDoc(doc(db, "siteConfig", "global"), {
        ...payload,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error("Error saving site config to Firestore:", err);
      alert("Erreur lors de la sauvegarde sur Firebase.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!confirm("Synchroniser la base Firestore avec les données par défaut du portfolio ?")) return;
    try {
      setSeeding(true);
      await seedInitialCmsData();
      alert("Données Firestore synchronisées avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la synchronisation");
    } finally {
      setSeeding(false);
    }
  };

  const envVariablesString = `# === VERCEL / NEXT.JS PRODUCTION ENV ===
NEXT_PUBLIC_SITE_URL=${siteUrl || "https://hilarus.dev"}
NEXT_PUBLIC_FIREBASE_API_KEY=${resolvedFirebaseConfig.apiKey || ""}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${resolvedFirebaseConfig.authDomain || ""}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${resolvedFirebaseConfig.projectId || ""}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${resolvedFirebaseConfig.storageBucket || ""}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${resolvedFirebaseConfig.messagingSenderId || ""}
NEXT_PUBLIC_FIREBASE_APP_ID=${resolvedFirebaseConfig.appId || ""}
NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID=${resolvedFirebaseConfig.firestoreDatabaseId || ""}`;

  const copyToClipboard = (text: string, type: "env" | string) => {
    navigator.clipboard.writeText(text);
    if (type === "env") {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 3000);
    } else {
      setCopiedDns(type);
      setTimeout(() => setCopiedDns(null), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-text">
            Configuration Globale, SEO & Déploiement
          </h2>
          <p className="text-xs text-muted">
            Pilotez les balises Open Graph, méta-titres, contenus clés et paramètres DNS pour Vercel.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface p-1">
          <button
            type="button"
            onClick={() => setActiveSubTab("seo")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSubTab === "seo"
                ? "bg-accent text-bg"
                : "text-muted hover:text-text"
            }`}
          >
            <Globe size={14} />
            <span>Méta-données & OG</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("content")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSubTab === "content"
                ? "bg-accent text-bg"
                : "text-muted hover:text-text"
            }`}
          >
            <Sliders size={14} />
            <span>Textes & Présentation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("dns")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSubTab === "dns"
                ? "bg-accent text-bg"
                : "text-muted hover:text-text"
            }`}
          >
            <Server size={14} />
            <span>DNS & Vercel</span>
          </button>
        </div>
      </div>

      {/* Tab 1: SEO & Open Graph */}
      {activeSubTab === "seo" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-5 rounded-2xl border border-border bg-surface/60 p-5 sm:p-6">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Globe size={18} className="text-accent" />
                <h3 className="font-display text-base font-bold text-text">
                  Balises Meta & Référencement (SEO)
                </h3>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="eyebrow block text-xs">Titre de la page (Meta Title) *</label>
                  <span className={`font-mono text-[10px] ${metaTitle.length > 60 ? "text-amber-400" : "text-muted"}`}>
                    {metaTitle.length}/60 car.
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Hilarus Gbagoule — Digital Builder | Design × Software × AI"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="eyebrow block text-xs">Description SEO (Meta Description) *</label>
                  <span className={`font-mono text-[10px] ${metaDescription.length > 160 ? "text-amber-400" : "text-muted"}`}>
                    {metaDescription.length}/160 car.
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Portfolio & réalisations d'Hilarus Gbagoule. Ingénierie logicielle, design d'interfaces et intelligence artificielle."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow mb-1 block text-xs">Domaine du site (Canonical URL)</label>
                  <input
                    type="url"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    placeholder="https://hilarus.dev"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Auteur / Créateur</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Hilarus Gbagoule"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">Mots-clés SEO (séparés par une virgule)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Hilarus Gbagoule, Digital Builder, AI Engineer, Fullstack Developer, Next.js"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                />
              </div>

              <div className="pt-2 border-t border-border/60">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 size={16} className="text-accent" />
                  <h4 className="font-display text-sm font-bold text-text">
                    Réseaux Sociaux & Open Graph (LinkedIn, Twitter/X, WhatsApp)
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="eyebrow mb-1 block text-xs">Titre Open Graph (OG Title)</label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Laissez vide pour utiliser le titre Meta"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                    />
                  </div>

                  <div>
                    <label className="eyebrow mb-1 block text-xs">Description Open Graph (OG Description)</label>
                    <textarea
                      rows={2}
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      placeholder="Laissez vide pour utiliser la description Meta"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                    />
                  </div>

                  <div className="pt-2">
                    <ImageUploader
                      label="Bannière de Partage Open Graph (OG Image)"
                      sublabel="Glissez-déposez ou importez votre visuel de partage (format 1200×630 recommandé)."
                      value={ogImage}
                      onChange={(val) => setOgImage(val)}
                      aspectRatio="16/9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Previews & Snippets (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Google Search Preview */}
              <div className="rounded-2xl border border-border bg-surface/80 p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-text">
                  <Search size={14} className="text-accent" />
                  <span>Aperçu Recherche Google (SERP)</span>
                </div>

                <div className="rounded-xl border border-border/80 bg-[#161a17] p-4 font-sans text-xs space-y-1 shadow-inner">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="truncate">{siteUrl || "https://hilarus.dev"}</span>
                    <span>›</span>
                  </div>
                  <h4 className="text-sm font-medium text-[#8ab4f8] line-clamp-1 hover:underline cursor-pointer">
                    {metaTitle || "Hilarus Gbagoule — Digital Builder"}
                  </h4>
                  <p className="text-[12px] text-[#bdc1c6] line-clamp-2 leading-relaxed">
                    {metaDescription || "Design × Software × AI. Hilarus Gbagoule transforme des problèmes réels en produits numériques..."}
                  </p>
                </div>
              </div>

              {/* Social Card Preview (LinkedIn / Twitter / Facebook) */}
              <div className="rounded-2xl border border-border bg-surface/80 p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-text">
                  <Share2 size={14} className="text-accent" />
                  <span>Aperçu Réseaux Sociaux (Social Share Card)</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-[#0d110e] text-xs">
                  {/* Image container */}
                  <div className="relative aspect-[1.91/1] w-full bg-[#1b221d] flex items-center justify-center overflow-hidden">
                    {ogImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={ogImage}
                        alt="OG Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="p-4 text-center text-muted">
                        <Share2 size={24} className="mx-auto mb-1 opacity-40" />
                        <span className="text-[11px]">Ajoutez une URL d&apos;image pour voir l&apos;aperçu</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 space-y-1 border-t border-border/60">
                    <span className="font-mono text-[10px] uppercase text-muted truncate block">
                      {new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).hostname}
                    </span>
                    <h5 className="font-display font-bold text-sm text-text line-clamp-1">
                      {ogTitle || metaTitle}
                    </h5>
                    <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                      {ogDescription || metaDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sitemap & Robots Status */}
              <div className="rounded-2xl border border-border/70 bg-surface/40 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text">Sitemap XML public</span>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline"
                  >
                    <span>/sitemap.xml</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text">Robots.txt & Sécurité Admin</span>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline"
                  >
                    <span>/robots.txt</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <p className="text-[11px] text-muted pt-1 border-t border-border/40">
                  Le panneau d&apos;administration (/admin) est automatiquement protégé contre l&apos;indexation des moteurs de recherche (noindex, nofollow).
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs sm:text-sm font-bold text-bg hover:scale-105 transition-transform disabled:opacity-50"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              <span>{saved ? "Méta-données synchronisées avec Firebase !" : "Enregistrer les métadonnées"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Content & Bio */}
      {activeSubTab === "content" && (
        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-border bg-surface/60 p-6">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Sliders size={18} className="text-accent" />
            <h3 className="font-display text-base font-bold text-text">
              Phrases d&apos;accroche & Textes de présentation
            </h3>
          </div>

          <div className="rounded-2xl border border-border/80 bg-surface/40 p-4">
            <ImageUploader
              label="Photo de Profil Hero (Halo d'Accueil)"
              sublabel="Importez votre photo personnelle (format carré ou rond recommandé). Elle sera affichée dans le cercle lumineux du Hero."
              value={profileImage}
              onChange={(val) => setProfileImage(val)}
              aspectRatio="1/1"
            />
          </div>

          <div>
            <label className="eyebrow mb-1.5 block text-xs">
              Phrase de positionnement Hero (Accueil)
            </label>
            <textarea
              rows={3}
              value={positioning}
              onChange={(e) => setPositioning(e.target.value)}
              placeholder="Je transforme des problèmes réels en expériences numériques, produits et expérimentations."
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
            />
          </div>

          <div>
            <label className="eyebrow mb-1.5 block text-xs">
              Piliers d&apos;expertise (Mots-clés séparés par des virgules)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="DESIGN, SOFTWARE, AI"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow mb-1.5 block text-xs">
                Texte d&apos;accroche Contact
              </label>
              <textarea
                rows={3}
                value={contactText}
                onChange={(e) => setContactText(e.target.value)}
                placeholder="Tu as une idée, un problème ou un projet ? Parlons-en."
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
              />
            </div>

            <div>
              <label className="eyebrow mb-1.5 block text-xs">
                Email de réception direct & Affichage
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hilaruskazak@gmail.com"
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
              />
              <p className="mt-1 text-[11px] text-muted">
                Email affiché sur le site avec bouton copier et redirection mailto.
              </p>
            </div>
          </div>

          {/* Social Profiles Section */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-bold text-text uppercase tracking-wider">
                  Liens Sociaux Hero & Footer
                </h4>
                <p className="text-xs text-muted">
                  Ces liens s&apos;affichent sous votre nom dans le Hero et dans le pied de page.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow mb-1.5 block text-xs">LinkedIn URL</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">GitHub URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">Dribbble URL</label>
                <input
                  type="url"
                  value={dribbbleUrl}
                  onChange={(e) => setDribbbleUrl(e.target.value)}
                  placeholder="https://dribbble.com/..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">Behance URL</label>
                <input
                  type="url"
                  value={behanceUrl}
                  onChange={(e) => setBehanceUrl(e.target.value)}
                  placeholder="https://behance.net/..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">Twitter / X URL</label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">Instagram URL</label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">Facebook URL</label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">Threads URL</label>
                <input
                  type="url"
                  value={threadsUrl}
                  onChange={(e) => setThreadsUrl(e.target.value)}
                  placeholder="https://threads.net/@..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">Telegram URL / Pseudo</label>
                <input
                  type="text"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  placeholder="https://t.me/username ou @username"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>
            </div>
          </div>

          {/* Direct Messaging & Contact Channels Section */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div>
              <h4 className="font-display text-sm font-bold text-text uppercase tracking-wider">
                Canaux de Contact Direct (Section Contact)
              </h4>
              <p className="text-xs text-muted">
                Boutons d&apos;action 1-clic pour discuter sur WhatsApp, appel téléphonique ou prise de rendez-vous.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="eyebrow mb-1.5 block text-xs">
                  WhatsApp (Lien wa.me ou numéro avec indicatif)
                </label>
                <input
                  type="text"
                  value={whatsappUrl}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                  placeholder="https://wa.me/22900000000 ou +229..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block text-xs">
                  Numéro de Téléphone (Appel direct)
                </label>
                <input
                  type="tel"
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value)}
                  placeholder="+229 00 00 00 00"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="eyebrow mb-1.5 block text-xs">
                  Lien Calendly / Cal.com (Réservation d&apos;appel)
                </label>
                <input
                  type="url"
                  value={calendlyUrl}
                  onChange={(e) => setCalendlyUrl(e.target.value)}
                  placeholder="https://calendly.com/votrenom/30min"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-border/60">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs sm:text-sm font-bold text-bg hover:scale-105 transition-transform disabled:opacity-50"
            >
              {saved ? <Check size={16} /> : <Save size={16} />}
              <span>{saved ? "Modifications appliquées !" : "Enregistrer les modifications"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: DNS & Vercel Deployment */}
      {activeSubTab === "dns" && (
        <div className="space-y-6">
          {/* DNS Configuration Table */}
          <div className="rounded-2xl border border-border bg-surface/70 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-accent" />
              <h3 className="font-display text-base font-bold text-text">
                Configuration DNS pour Vercel & Sous-domaine CMS (my.votredomaine.site)
              </h3>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Pour connecter votre domaine principal et votre sous-domaine dédié au CMS <code className="text-accent bg-accent/10 px-1 py-0.5 rounded font-mono">my.domainname.site</code> sur Vercel, ajoutez ces 3 enregistrements dans la zone DNS de votre registrar (Namecheap, Cloudflare, OVH, Hostinger, etc.) :
            </p>

            <div className="overflow-x-auto rounded-xl border border-border bg-[#070908]">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-border bg-surface/80 text-muted">
                  <tr>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Nom / Hôte</th>
                    <th className="px-4 py-2.5">Valeur / Cible</th>
                    <th className="px-4 py-2.5">Usage</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-text/90">
                  <tr className="hover:bg-white/5">
                    <td className="px-4 py-3 text-accent font-bold">A</td>
                    <td className="px-4 py-3">@ (domaine racine)</td>
                    <td className="px-4 py-3 text-text">76.76.21.21</td>
                    <td className="px-4 py-3 text-muted text-[11px]">Site Public Vercel</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => copyToClipboard("76.76.21.21", "a-record")}
                        className="rounded-lg border border-border px-2.5 py-1 text-[10px] text-muted hover:border-accent hover:text-accent"
                      >
                        {copiedDns === "a-record" ? "Copié !" : "Copier IP"}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="px-4 py-3 text-accent font-bold">CNAME</td>
                    <td className="px-4 py-3">www</td>
                    <td className="px-4 py-3 text-text">cname.vercel-dns.com.</td>
                    <td className="px-4 py-3 text-muted text-[11px]">Redirection www</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => copyToClipboard("cname.vercel-dns.com.", "cname-www")}
                        className="rounded-lg border border-border px-2.5 py-1 text-[10px] text-muted hover:border-accent hover:text-accent"
                      >
                        {copiedDns === "cname-www" ? "Copié !" : "Copier CNAME"}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-accent/5 bg-accent/5">
                    <td className="px-4 py-3 text-accent font-bold">CNAME</td>
                    <td className="px-4 py-3 text-accent font-bold">my</td>
                    <td className="px-4 py-3 text-text">cname.vercel-dns.com.</td>
                    <td className="px-4 py-3 text-accent font-semibold text-[11px]">Accès Direct CMS Studio</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => copyToClipboard("cname.vercel-dns.com.", "cname-my")}
                        className="rounded-lg border border-accent bg-accent/20 px-2.5 py-1 text-[10px] text-accent font-bold hover:bg-accent hover:text-bg"
                      >
                        {copiedDns === "cname-my" ? "Copié !" : "Copier CNAME"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Vercel Environment Variables ready to copy */}
          <div className="rounded-2xl border border-border bg-surface/70 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-accent" />
                <h3 className="font-display text-base font-bold text-text">
                  Variables d&apos;Environnement Vercel (.env.production)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(envVariablesString, "env")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3 py-1.5 text-xs font-bold text-bg hover:scale-105 transition-transform"
              >
                {copiedEnv ? <CheckCircle2 size={13} /> : <Copy size={13} />}
                <span>{copiedEnv ? "Copié dans le presse-papier !" : "Copier toutes les variables"}</span>
              </button>
            </div>

            <p className="text-xs text-muted">
              Collez ces variables dans les paramètres de votre projet Vercel (<strong>Project Settings → Environment Variables</strong>) :
            </p>

            <pre className="overflow-x-auto rounded-xl border border-border/80 bg-[#070908] p-4 font-mono text-[11px] text-text/90 leading-relaxed scrollbar-none">
              {envVariablesString}
            </pre>
          </div>

          {/* Firebase Authentication Authorized Domains */}
          <div className="rounded-2xl border border-border/70 bg-surface/30 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-accent" />
              <h3 className="font-display text-base font-bold text-text">
                Domaines Autorisés Firebase Authentication
              </h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Pour vous connecter avec Google sur votre propre domaine, rendez-vous dans la <strong>Console Firebase → Authentication → Settings → Authorized domains</strong> et ajoutez :
            </p>
            <ul className="list-disc list-inside space-y-1 font-mono text-xs text-accent/90">
              <li>{new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).hostname}</li>
              <li>my.{new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`).hostname}</li>
              <li>*.vercel.app</li>
            </ul>

            <div className="pt-3 border-t border-border/40">
              <button
                type="button"
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-semibold text-text hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={seeding ? "animate-spin" : ""} />
                <span>{seeding ? "Synchronisation..." : "Réinitialiser / Synchroniser données initiales Firestore"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
