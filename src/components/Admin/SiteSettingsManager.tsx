"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, resolvedFirebaseConfig } from "@/lib/firebase";
import {
  defaultSiteMetadata,
  type SiteMetadataConfig,
  buildJsonLdSchema,
} from "@/lib/cms-meta";
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
  Sparkles,
  Search,
  UserCheck,
  Code2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Crop,
  Palette,
  Sun,
  Moon,
} from "lucide-react";
import { seedInitialCmsData } from "@/lib/cms-seed";
import { ImageUploader } from "./ImageUploader";
import { HeroImageStudioModal } from "./HeroImageStudioModal";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";

export function SiteSettingsManager() {
  const [activeSubTab, setActiveSubTab] = useState<
    "seo" | "identity" | "appearance" | "content" | "dns"
  >("seo");

  // Metadata & SEO state
  const [metaTitle, setMetaTitle] = useState(defaultSiteMetadata.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    defaultSiteMetadata.metaDescription || ""
  );
  const [keywords, setKeywords] = useState(
    defaultSiteMetadata.keywords?.join(", ") || ""
  );
  const [ogTitle, setOgTitle] = useState(defaultSiteMetadata.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(
    defaultSiteMetadata.ogDescription || ""
  );
  const [ogImage, setOgImage] = useState(defaultSiteMetadata.ogImage || "");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image">(
    "summary_large_image"
  );
  const [siteUrl, setSiteUrl] = useState(
    defaultSiteMetadata.siteUrl || "https://hilarus.dev"
  );
  const [author, setAuthor] = useState(
    defaultSiteMetadata.author || "Hilarus Gbagoule"
  );

  // Google & Search Indexation Specifics
  const [googleSiteVerification, setGoogleSiteVerification] = useState(
    defaultSiteMetadata.googleSiteVerification || ""
  );
  const [bingSiteVerification, setBingSiteVerification] = useState(
    defaultSiteMetadata.bingSiteVerification || ""
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    defaultSiteMetadata.canonicalUrl || "https://hilarus.dev"
  );
  const [robotsIndex, setRobotsIndex] = useState(
    defaultSiteMetadata.robotsIndex ?? true
  );
  const [robotsFollow, setRobotsFollow] = useState(
    defaultSiteMetadata.robotsFollow ?? true
  );
  const [allowAiCrawlers, setAllowAiCrawlers] = useState(
    defaultSiteMetadata.allowAiCrawlers ?? true
  );

  // Personal Identity & Google Knowledge Graph
  const [givenName, setGivenName] = useState(
    defaultSiteMetadata.givenName || "Hilarus"
  );
  const [familyName, setFamilyName] = useState(
    defaultSiteMetadata.familyName || "Gbagoule"
  );
  const [additionalName, setAdditionalName] = useState(
    defaultSiteMetadata.additionalName || "Kazak"
  );
  const [alternateNames, setAlternateNames] = useState(
    defaultSiteMetadata.alternateNames?.join(", ") ||
      "Hilarus Gbagoule, Hilarus, Hilarus Kazak"
  );
  const [jobTitle, setJobTitle] = useState(
    defaultSiteMetadata.jobTitle || "Digital Builder & Product Engineer"
  );
  const [nationality, setNationality] = useState(
    defaultSiteMetadata.nationality || "Bénin"
  );
  const [addressLocality, setAddressLocality] = useState(
    defaultSiteMetadata.addressLocality || "Cotonou"
  );
  const [alumniOf, setAlumniOf] = useState(
    defaultSiteMetadata.alumniOf ||
      "EPITA — École pour l'informatique et les techniques avancées"
  );
  const [companyOrOrg, setCompanyOrOrg] = useState(
    defaultSiteMetadata.companyOrOrg || "GB Labs"
  );
  const [orgDescription, setOrgDescription] = useState(
    defaultSiteMetadata.orgDescription ||
      "Laboratoire d'ingénierie logicielle et intelligence artificielle."
  );
  const [knowsAbout, setKnowsAbout] = useState(
    defaultSiteMetadata.knowsAbout?.join(", ") ||
      "Artificial Intelligence, Machine Learning, Generative AI & LLMs, UI/UX Design Systems, Fullstack Software Engineering, Next.js & React, TypeScript, Multimodal Data Pipelines, Progressive Web Apps (PWA), Vector Embeddings"
  );
  const [bioLong, setBioLong] = useState(
    defaultSiteMetadata.bioLong ||
      "Digital Builder & Product Engineer spécialisé dans la convergence du design d'expérience (UI/UX), de l'ingénierie logicielle (Next.js, TypeScript) et de l'intelligence artificielle (Gemini, pipelines de données multimodaux)."
  );

  // Content state
  const [positioning, setPositioning] = useState(
    defaultSiteMetadata.positioning || ""
  );
  const [tags, setTags] = useState(defaultSiteMetadata.tags?.join(", ") || "");
  const [contactText, setContactText] = useState(
    defaultSiteMetadata.contactText || ""
  );
  const [contactEmail, setContactEmail] = useState(
    defaultSiteMetadata.contactEmail || "hilaruskazak@gmail.com"
  );
  const [profileImage, setProfileImage] = useState(
    defaultSiteMetadata.profileImage || ""
  );

  // Socials & Direct Channels state
  const [dribbbleUrl, setDribbbleUrl] = useState(
    defaultSiteMetadata.socials?.dribbble || ""
  );
  const [behanceUrl, setBehanceUrl] = useState(
    defaultSiteMetadata.socials?.behance || ""
  );
  const [linkedinUrl, setLinkedinUrl] = useState(
    defaultSiteMetadata.socials?.linkedin || ""
  );
  const [twitterUrl, setTwitterUrl] = useState(
    defaultSiteMetadata.socials?.twitter || ""
  );
  const [githubUrl, setGithubUrl] = useState(
    defaultSiteMetadata.socials?.github || ""
  );
  const [instagramUrl, setInstagramUrl] = useState(
    defaultSiteMetadata.socials?.instagram || ""
  );
  const [facebookUrl, setFacebookUrl] = useState(
    defaultSiteMetadata.socials?.facebook || ""
  );
  const [threadsUrl, setThreadsUrl] = useState(
    defaultSiteMetadata.socials?.threads || ""
  );
  const [telegramUrl, setTelegramUrl] = useState(
    defaultSiteMetadata.socials?.telegram || ""
  );
  const [whatsappUrl, setWhatsappUrl] = useState(
    defaultSiteMetadata.contactChannels?.whatsapp || ""
  );
  const [phoneVal, setPhoneVal] = useState(
    defaultSiteMetadata.contactChannels?.phone || ""
  );
  const [calendlyUrl, setCalendlyUrl] = useState(
    defaultSiteMetadata.contactChannels?.calendly || ""
  );

  // Studio modal for hero image
  const [isHeroStudioOpen, setIsHeroStudioOpen] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);
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
            setKeywords(
              Array.isArray(data.keywords)
                ? data.keywords.join(", ")
                : data.keywords
            );
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
            setTags(
              Array.isArray(data.tags) ? data.tags.join(", ") : data.tags
            );
          }
          if (data.contactText) setContactText(data.contactText);
          if (data.contactEmail) setContactEmail(data.contactEmail);

          // Google & Indexation
          if (data.googleSiteVerification !== undefined)
            setGoogleSiteVerification(data.googleSiteVerification);
          if (data.bingSiteVerification !== undefined)
            setBingSiteVerification(data.bingSiteVerification);
          if (data.canonicalUrl) setCanonicalUrl(data.canonicalUrl);
          if (data.robotsIndex !== undefined) setRobotsIndex(data.robotsIndex);
          if (data.robotsFollow !== undefined) setRobotsFollow(data.robotsFollow);
          if (data.allowAiCrawlers !== undefined)
            setAllowAiCrawlers(data.allowAiCrawlers);

          // Identity
          if (data.givenName) setGivenName(data.givenName);
          if (data.familyName) setFamilyName(data.familyName);
          if (data.additionalName) setAdditionalName(data.additionalName);
          if (data.alternateNames) {
            setAlternateNames(
              Array.isArray(data.alternateNames)
                ? data.alternateNames.join(", ")
                : data.alternateNames
            );
          }
          if (data.jobTitle) setJobTitle(data.jobTitle);
          if (data.nationality) setNationality(data.nationality);
          if (data.addressLocality) setAddressLocality(data.addressLocality);
          if (data.alumniOf) setAlumniOf(data.alumniOf);
          if (data.companyOrOrg) setCompanyOrOrg(data.companyOrOrg);
          if (data.orgDescription) setOrgDescription(data.orgDescription);
          if (data.knowsAbout) {
            setKnowsAbout(
              Array.isArray(data.knowsAbout)
                ? data.knowsAbout.join(", ")
                : data.knowsAbout
            );
          }
          if (data.bioLong) setBioLong(data.bioLong);

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
            if (data.contactChannels.whatsapp)
              setWhatsappUrl(data.contactChannels.whatsapp);
            if (data.contactChannels.telegram)
              setTelegramUrl(data.contactChannels.telegram);
            if (data.contactChannels.phone)
              setPhoneVal(data.contactChannels.phone);
            if (data.contactChannels.calendly)
              setCalendlyUrl(data.contactChannels.calendly);
            if (data.contactChannels.email)
              setContactEmail(data.contactChannels.email);
          }
        }
      } catch (err) {
        console.error("Error loading site config:", err);
      }
    }
    loadConfig();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const payload: SiteMetadataConfig = {
        metaTitle,
        metaDescription,
        keywords: keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        ogTitle: ogTitle || metaTitle,
        ogDescription: ogDescription || metaDescription,
        ogImage,
        profileImage,
        twitterCard,
        siteUrl,
        author,
        positioning,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        contactText,
        contactEmail,

        // Search Engine & Google Controls
        googleSiteVerification,
        bingSiteVerification,
        canonicalUrl: canonicalUrl || siteUrl,
        robotsIndex,
        robotsFollow,
        allowAiCrawlers,

        // Personal Identity & Knowledge Graph
        givenName,
        familyName,
        additionalName,
        alternateNames: alternateNames
          .split(",")
          .map((n) => n.trim())
          .filter(Boolean),
        jobTitle,
        nationality,
        addressLocality,
        addressCountry: nationality,
        alumniOf,
        companyOrOrg,
        orgDescription,
        knowsAbout: knowsAbout
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        bioLong,

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

      await setDoc(
        doc(db, "siteConfig", "global"),
        {
          ...payload,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

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
    if (
      !confirm(
        "Synchroniser la base Firestore avec les données par défaut du portfolio ?"
      )
    )
      return;
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

  const copyToClipboard = (text: string, type: "env" | "jsonld" | string) => {
    navigator.clipboard.writeText(text);
    if (type === "env") {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 3000);
    } else if (type === "jsonld") {
      setCopiedJsonLd(true);
      setTimeout(() => setCopiedJsonLd(false), 3000);
    } else {
      setCopiedDns(type);
      setTimeout(() => setCopiedDns(null), 2500);
    }
  };

  // Live JSON-LD Preview object
  const currentJsonLd = buildJsonLdSchema({
    author,
    siteUrl,
    givenName,
    familyName,
    additionalName,
    alternateNames: alternateNames
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean),
    jobTitle,
    nationality,
    addressLocality,
    alumniOf,
    companyOrOrg,
    orgDescription,
    knowsAbout: knowsAbout
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    bioLong,
    profileImage,
    ogImage,
    socials: {
      linkedin: linkedinUrl,
      github: githubUrl,
      twitter: twitterUrl,
      dribbble: dribbbleUrl,
      behance: behanceUrl,
      instagram: instagramUrl,
      facebook: facebookUrl,
      threads: threadsUrl,
      whatsapp: whatsappUrl,
    },
  });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-text">
            Configuration Globale, SEO & Identité Google
          </h2>
          <p className="text-xs text-muted">
            Contrôlez l&apos;indexation Google Search, le schéma Person Schema.org,
            l&apos;image du Hero et les paramètres de production.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border bg-surface p-1">
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
            <span>SEO & Indexation</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("identity")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSubTab === "identity"
                ? "bg-accent text-bg"
                : "text-muted hover:text-text"
            }`}
          >
            <UserCheck size={14} />
            <span>Identité & Google Schema</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("appearance")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSubTab === "appearance"
                ? "bg-accent text-bg"
                : "text-muted hover:text-text"
            }`}
          >
            <Palette size={14} />
            <span>Thème & Couleurs (Vert/Noir vs Blanc/Noir)</span>
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
            <span>Textes & Photo Hero</span>
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

      {/* Tab 1: SEO, Google Verification & Robots */}
      {activeSubTab === "seo" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-5 rounded-2xl border border-border bg-surface/60 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-accent" />
                  <h3 className="font-display text-base font-bold text-text">
                    Balises Meta & Contrôles Google Search
                  </h3>
                </div>
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-mono text-accent border border-accent/30 font-semibold">
                  Google Search Console
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="eyebrow block text-xs">
                    Titre de la page (Meta Title) *
                  </label>
                  <span
                    className={`font-mono text-[10px] ${
                      metaTitle.length > 60 ? "text-amber-400" : "text-muted"
                    }`}
                  >
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
                  <label className="eyebrow block text-xs">
                    Description SEO (Meta Description) *
                  </label>
                  <span
                    className={`font-mono text-[10px] ${
                      metaDescription.length > 160
                        ? "text-amber-400"
                        : "text-muted"
                    }`}
                  >
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
                  <label className="eyebrow mb-1 block text-xs">
                    Domaine Principal (Site URL)
                  </label>
                  <input
                    type="url"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    placeholder="https://hilarus.dev"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">
                    URL Canonique (Canonical URL)
                  </label>
                  <input
                    type="url"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://hilarus.dev"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
              </div>

              {/* Google Verification Token & Bing */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-text">
                  <Shield size={14} className="text-accent" />
                  <span>Vérification de Propriété Google Search Console</span>
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">
                    Code de validation Google (google-site-verification)
                  </label>
                  <input
                    type="text"
                    value={googleSiteVerification}
                    onChange={(e) => setGoogleSiteVerification(e.target.value)}
                    placeholder="ex: AbCdEfGhIjKlMnOpQrStUvWxYz1234567890"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs font-mono text-text focus-ring"
                  />
                  <p className="mt-1 text-[11px] text-muted">
                    Collez le code HTML / token fourni par Google Search Console pour certifier instantanément votre domaine.
                  </p>
                </div>

                <div>
                  <label className="eyebrow mb-1 block text-xs">
                    Validation Bing Webmaster (msvalidate.01 - optionnel)
                  </label>
                  <input
                    type="text"
                    value={bingSiteVerification}
                    onChange={(e) => setBingSiteVerification(e.target.value)}
                    placeholder="ex: 1234567890ABCDEF1234567890ABCDEF"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs font-mono text-text focus-ring"
                  />
                </div>
              </div>

              {/* Robots & Indexing Rules */}
              <div className="rounded-xl border border-border bg-surface/40 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-text">
                  <FileCheck size={14} className="text-accent" />
                  <span>Directives d&apos;indexation des robots (Robots Meta)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer bg-surface/60 p-2.5 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      checked={robotsIndex}
                      onChange={(e) => setRobotsIndex(e.target.checked)}
                      className="accent-accent h-4 w-4 rounded"
                    />
                    <div>
                      <span className="font-semibold block text-text">Indexation</span>
                      <span className="text-[10px] text-muted">Autoriser Google</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-surface/60 p-2.5 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      checked={robotsFollow}
                      onChange={(e) => setRobotsFollow(e.target.checked)}
                      className="accent-accent h-4 w-4 rounded"
                    />
                    <div>
                      <span className="font-semibold block text-text">Follow</span>
                      <span className="text-[10px] text-muted">Suivre les liens</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer bg-surface/60 p-2.5 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      checked={allowAiCrawlers}
                      onChange={(e) => setAllowAiCrawlers(e.target.checked)}
                      className="accent-accent h-4 w-4 rounded"
                    />
                    <div>
                      <span className="font-semibold block text-text">Robots IA</span>
                      <span className="text-[10px] text-muted">Google Gemini / GPT</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">
                  Mots-clés SEO (séparés par une virgule)
                </label>
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
                    Réseaux Sociaux & Open Graph (LinkedIn, Twitter, WhatsApp)
                  </h4>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="eyebrow mb-1 block text-xs">
                      Titre Open Graph (OG Title)
                    </label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      placeholder="Laissez vide pour utiliser le titre Meta"
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                    />
                  </div>

                  <div>
                    <label className="eyebrow mb-1 block text-xs">
                      Description Open Graph (OG Description)
                    </label>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text">
                    <Search size={14} className="text-accent" />
                    <span>Aperçu Recherche Google (SERP)</span>
                  </div>
                  <span className="font-mono text-[10px] text-accent">En direct</span>
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
                    {metaDescription ||
                      "Design × Software × AI. Hilarus Gbagoule transforme des problèmes réels en produits numériques..."}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-1">
                  <span>Sitemap XML :</span>
                  <a
                    href={`${siteUrl.replace(/\/$/, "")}/sitemap.xml`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline flex items-center gap-1"
                  >
                    <span>/sitemap.xml</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              {/* Social Card Preview */}
              <div className="rounded-2xl border border-border bg-surface/80 p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-text">
                  <Share2 size={14} className="text-accent" />
                  <span>Aperçu Réseaux Sociaux (Social Share Card)</span>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-[#0d110e] text-xs">
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
                        <span className="text-[11px]">
                          Ajoutez une image pour voir l&apos;aperçu
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 space-y-1 border-t border-border/60">
                    <span className="font-mono text-[10px] uppercase text-muted truncate block">
                      {new URL(
                        siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`
                      ).hostname}
                    </span>
                    <h5 className="font-bold text-text line-clamp-1">
                      {ogTitle || metaTitle || "Hilarus Gbagoule"}
                    </h5>
                    <p className="text-muted line-clamp-2 text-[11px]">
                      {ogDescription ||
                        metaDescription ||
                        "Digital Builder & Product Engineer"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Search Tools Direct Links */}
              <div className="rounded-2xl border border-border bg-surface/80 p-5 space-y-3">
                <h4 className="font-display text-xs font-bold text-text uppercase tracking-wider">
                  Outils Officiels Google
                </h4>
                <div className="space-y-2 text-xs">
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-surface hover:border-accent/50 hover:bg-surface/80 transition-colors"
                  >
                    <span className="text-text font-medium">Google Search Console</span>
                    <ExternalLink size={13} className="text-accent" />
                  </a>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-surface hover:border-accent/50 hover:bg-surface/80 transition-colors"
                  >
                    <span className="text-text font-medium">
                      Google Rich Results Test (Schema)
                    </span>
                    <ExternalLink size={13} className="text-accent" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Save Bar */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-accent/40 bg-surface/95 p-4 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Sparkles size={14} className="text-accent" />
              <span>
                Les balises SEO, tokens Google et robots sont mis à jour en temps réel.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-skew !py-2.5 !px-6 !text-xs !bg-accent !text-bg !border-accent hover:!bg-accent/90 focus-ring font-bold shadow-lg"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : saved ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                <Save size={14} />
              )}
              <span>
                {saved
                  ? "Paramètres SEO synchronisés !"
                  : "Enregistrer les métadonnées SEO"}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Identity & Google Knowledge Graph (Schema.org / JSON-LD) */}
      {activeSubTab === "identity" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Fields (7 cols) */}
            <div className="lg:col-span-7 space-y-5 rounded-2xl border border-border bg-surface/60 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck size={18} className="text-accent" />
                  <h3 className="font-display text-base font-bold text-text">
                    Identité Personnelle & Google Knowledge Graph
                  </h3>
                </div>
                <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-mono text-accent border border-accent/30 font-semibold">
                  Schema.org / JSON-LD
                </span>
              </div>

              <p className="text-xs text-muted">
                Ces informations alimentent la balise structurée Schema.org de type{" "}
                <code className="text-accent font-mono">Person</code> reconnue par
                Google, Bing et les intelligences artificielles (Gemini, Claude, Perplexity)
                pour établir votre fiche de connaissances officielle.
              </p>

              {/* Name Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="eyebrow mb-1 block text-xs">Prénom (Given Name) *</label>
                  <input
                    type="text"
                    required
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                    placeholder="Hilarus"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">Nom de Famille (Family Name) *</label>
                  <input
                    type="text"
                    required
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    placeholder="Gbagoule"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">2ème Prénom / Pseudo</label>
                  <input
                    type="text"
                    value={additionalName}
                    onChange={(e) => setAdditionalName(e.target.value)}
                    placeholder="Kazak"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">
                  Noms alternatifs (alternateName - pour recherche Google)
                </label>
                <input
                  type="text"
                  value={alternateNames}
                  onChange={(e) => setAlternateNames(e.target.value)}
                  placeholder="Hilarus Gbagoule, Hilarus, Hilarus Kazak"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                />
                <p className="mt-1 text-[11px] text-muted">
                  Variantes de votre nom tapées par les utilisateurs sur Google.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow mb-1 block text-xs">
                    Titre Professionnel (Job Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Digital Builder & Product Engineer"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">
                    Formation / Diplôme (Alumni Of)
                  </label>
                  <input
                    type="text"
                    value={alumniOf}
                    onChange={(e) => setAlumniOf(e.target.value)}
                    placeholder="EPITA — École pour l'informatique et les techniques avancées"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="eyebrow mb-1 block text-xs">
                    Entreprise / Laboratoire (Works For)
                  </label>
                  <input
                    type="text"
                    value={companyOrOrg}
                    onChange={(e) => setCompanyOrOrg(e.target.value)}
                    placeholder="GB Labs"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                  />
                </div>
                <div>
                  <label className="eyebrow mb-1 block text-xs">
                    Localisation (Ville / Pays)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={addressLocality}
                      onChange={(e) => setAddressLocality(e.target.value)}
                      placeholder="Cotonou"
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text focus-ring"
                    />
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="Bénin"
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-text focus-ring"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">
                  Description Organisation / Activité
                </label>
                <input
                  type="text"
                  value={orgDescription}
                  onChange={(e) => setOrgDescription(e.target.value)}
                  placeholder="Laboratoire d'ingénierie de données multimodales et IA."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">
                  Domaines d&apos;expertise IA & Moteurs (knowsAbout - séparés par des virgules)
                </label>
                <textarea
                  rows={2}
                  value={knowsAbout}
                  onChange={(e) => setKnowsAbout(e.target.value)}
                  placeholder="Artificial Intelligence, Machine Learning, UI/UX Design Systems, Next.js & React, TypeScript..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-xs font-mono text-text focus-ring"
                />
              </div>

              <div>
                <label className="eyebrow mb-1 block text-xs">
                  Biographie complète pour l&apos;Indexation & les Crawlers IA
                </label>
                <textarea
                  rows={4}
                  value={bioLong}
                  onChange={(e) => setBioLong(e.target.value)}
                  placeholder="Rédigez un paragraphe biographique détaillé..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text focus-ring leading-relaxed"
                />
              </div>
            </div>

            {/* Live Schema.org / JSON-LD Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-border bg-surface/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text">
                    <Code2 size={14} className="text-accent" />
                    <span>Schéma JSON-LD généré (Temps réel)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(currentJsonLd, null, 2),
                        "jsonld"
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-mono text-accent hover:underline"
                  >
                    {copiedJsonLd ? (
                      <>
                        <Check size={12} />
                        <span>Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copier</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto rounded-xl border border-border/80 bg-[#0d110e] p-3 text-[11px] font-mono text-[#a6d189] leading-relaxed select-all">
                  <pre>{JSON.stringify(currentJsonLd, null, 2)}</pre>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-muted text-[11px]">Validé pour Google & IA</span>
                  <a
                    href="https://validator.schema.org/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline flex items-center gap-1 text-[11px] font-semibold"
                  >
                    <span>Tester sur Schema.org</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              {/* Info box on Person knowledge graph */}
              <div className="rounded-2xl border border-white/5 bg-surface/40 p-5 space-y-2 text-xs text-muted">
                <h4 className="font-display text-text font-bold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent" />
                  <span>Impact sur votre indexation Google</span>
                </h4>
                <p>
                  Les entités structurées permettent à Google d&apos;associer votre nom,
                  vos profils réseaux (LinkedIn, GitHub, Twitter), votre formation EPITA
                  et votre entreprise GB Labs dans un graphe de connaissances unifié.
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Save Bar */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between rounded-2xl border border-accent/40 bg-surface/95 p-4 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Sparkles size={14} className="text-accent" />
              <span>
                Schéma Person & ProfilePage synchronisés instantanément avec le site.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-skew !py-2.5 !px-6 !text-xs !bg-accent !text-bg !border-accent hover:!bg-accent/90 focus-ring font-bold shadow-lg"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : saved ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                <Save size={14} />
              )}
              <span>
                {saved ? "Identité synchronisée !" : "Enregistrer l'Identité Google"}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Appearance & Theme Selector (Vert/Noir vs Blanc/Noir) */}
      {activeSubTab === "appearance" && (
        <div className="space-y-6 rounded-2xl border border-border bg-surface/60 p-6 sm:p-7">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-accent" />
              <h3 className="font-display text-base font-bold text-text">
                Palette & Thèmes Visuels (Vert/Noir vs Blanc/Noir)
              </h3>
            </div>
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-mono text-accent border border-accent/30 font-semibold">
              Live Theme Engine
            </span>
          </div>

          <p className="text-xs text-muted leading-relaxed max-w-2xl">
            Sélectionnez et testez en direct l&apos;ambiance visuelle du site. Le choix est mémorisé instantanément et s&apos;applique à l&apos;ensemble de l&apos;application (portfolio public et interface administrateur).
          </p>

          {/* Interactive Card Selection Component */}
          <div className="pt-2">
            <ThemeToggle variant="settings-card" />
          </div>

          {/* Detailed Color Scheme & Accessibility Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/60">
            {/* Dark Details */}
            <div className="rounded-xl border border-border/60 bg-surface/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-text">
                <Moon size={14} className="text-accent" />
                <span>Thème Vert / Noir (Sombre)</span>
              </div>
              <ul className="text-[11px] text-muted space-y-1 font-mono">
                <li>• Fond d&apos;écran : <code className="text-text">#080a09</code> (Noir profond cyber)</li>
                <li>• Cartes & Boîtes : <code className="text-text">#101411</code> (Charcoal olive)</li>
                <li>• Accent interactif : <code className="text-accent font-bold">#a8f35a</code> (Vert Lime Radiant)</li>
                <li>• Typographie : <code className="text-text">#f1f3ee</code> (Blanc cassé haute lisibilité)</li>
              </ul>
            </div>

            {/* Light Details */}
            <div className="rounded-xl border border-border/60 bg-surface/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-text">
                <Sun size={14} className="text-amber-500" />
                <span>Thème Blanc / Noir (Clair)</span>
              </div>
              <ul className="text-[11px] text-muted space-y-1 font-mono">
                <li>• Fond d&apos;écran : <code className="text-text">#fafafa</code> (Blanc pur soyeux)</li>
                <li>• Cartes & Boîtes : <code className="text-text">#ffffff</code> (Blanc albâtre & bordures douces)</li>
                <li>• Accent interactif : <code className="text-text font-bold">#09090b</code> (Noir Profond & Contrasté)</li>
                <li>• Typographie : <code className="text-text">#09090b</code> (Noir ébène haute précision)</li>
              </ul>
            </div>
          </div>

          {/* Visitor Footnote Notice */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5 flex items-start gap-2.5">
            <Sparkles size={16} className="text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              <strong className="text-text">Pied de page visiteur :</strong> Les visiteurs de votre portfolio disposent également du sélecteur en bas de page pour basculer facilement entre les modes Vert/Noir et Blanc/Noir selon leurs préférences de lecture.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Content, Hero Image & Studio */}
      {activeSubTab === "content" && (
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-2xl border border-border bg-surface/60 p-6"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-accent" />
              <h3 className="font-display text-base font-bold text-text">
                Photo Hero & Textes de présentation
              </h3>
            </div>
            <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-mono text-accent border border-accent/30 font-semibold">
              Studio Recadrage & Zoom
            </span>
          </div>

          {/* Hero Profile Photo with Studio */}
          <div className="rounded-2xl border border-border/80 bg-surface/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-sm font-bold text-text">
                  Photo de Profil Hero (Halo Lumineux Accueil)
                </h4>
                <p className="text-xs text-muted">
                  Importez votre photo personnelle. Utilisez le bouton{" "}
                  <strong className="text-accent">Recadrer & Zoomer</strong> pour ajuster
                  précisément le centrage et la taille avant publication.
                </p>
              </div>
              {profileImage && (
                <button
                  type="button"
                  onClick={() => setIsHeroStudioOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-bg transition-colors focus-ring"
                >
                  <Crop size={14} />
                  <span>Ouvrir Studio Hero</span>
                </button>
              )}
            </div>

            <ImageUploader
              label="Visuel Hero Principal"
              sublabel="PNG, JPG ou WEBP. Compression et optimisation automatique."
              value={profileImage}
              onChange={(val) => setProfileImage(val)}
              aspectRatio="1/1"
              showCropTool={true}
            />
          </div>

          {/* Positioning */}
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
                  Ces liens s&apos;affichent sous votre nom dans le Hero et dans le pied de
                  page.
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
                <label className="eyebrow mb-1.5 block text-xs">
                  Telegram URL / Pseudo
                </label>
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
                Boutons d&apos;action 1-clic pour discuter sur WhatsApp, appel téléphonique
                ou prise de rendez-vous.
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

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-skew !py-2.5 !px-6 !text-xs !bg-accent !text-bg !border-accent hover:!bg-accent/90 focus-ring font-bold shadow-lg"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : saved ? (
                <Check size={14} strokeWidth={2.5} />
              ) : (
                <Save size={14} />
              )}
              <span>
                {saved ? "Modifications enregistrées !" : "Enregistrer les textes & photo"}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: DNS, Vercel & Production */}
      {activeSubTab === "dns" && (
        <div className="space-y-6">
          {/* Guide Vercel */}
          <div className="rounded-2xl border border-border bg-surface/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Server size={18} className="text-accent" />
                <h3 className="font-display text-base font-bold text-text">
                  Configuration DNS pour Domaine Personnalisé (ex: hilarus.dev)
                </h3>
              </div>
              <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-mono text-accent border border-accent/30 font-semibold">
                Vercel Ready
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Pour connecter votre nom de domaine chez votre registrar (Namecheap,
              OVH, Google Domains, Cloudflare, etc.), créez les enregistrements DNS
              suivants pointant vers Vercel :
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border text-muted uppercase text-[10px]">
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Nom (Host)</th>
                    <th className="py-2.5 px-3">Valeur (Cible)</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-3 px-3 font-bold text-accent">A</td>
                    <td className="py-3 px-3 text-text">@ (ou racine)</td>
                    <td className="py-3 px-3 text-text font-bold">76.76.21.21</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => copyToClipboard("76.76.21.21", "A")}
                        className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[10px] text-muted hover:text-text hover:border-accent/40"
                      >
                        {copiedDns === "A" ? "Copié !" : "Copier"}
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-accent">CNAME</td>
                    <td className="py-3 px-3 text-text">www</td>
                    <td className="py-3 px-3 text-text font-bold">
                      cname.vercel-dns.com
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard("cname.vercel-dns.com", "CNAME")
                        }
                        className="rounded-lg border border-border bg-surface px-2.5 py-1 text-[10px] text-muted hover:text-text hover:border-accent/40"
                      >
                        {copiedDns === "CNAME" ? "Copié !" : "Copier"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Vercel Environment Variables ready to copy */}
          <div className="rounded-2xl border border-border bg-surface/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-accent" />
                <h3 className="font-display text-base font-bold text-text">
                  Variables d&apos;Environnement de Production (Vercel)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(envVariablesString, "env")}
                className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-mono font-bold text-accent hover:bg-accent hover:text-bg transition-colors"
              >
                {copiedEnv ? (
                  <>
                    <Check size={12} />
                    <span>Copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Tout Copier (.env)</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-muted">
              Collez ce bloc dans{" "}
              <strong className="text-text">
                Vercel Dashboard › Settings › Environment Variables
              </strong>{" "}
              pour connecter Firebase en production.
            </p>

            <div className="rounded-xl border border-border/80 bg-[#0d110e] p-4 font-mono text-xs text-[#a6d189] max-h-56 overflow-y-auto leading-relaxed select-all">
              <pre>{envVariablesString}</pre>
            </div>
          </div>

          {/* Reset / Seed Database */}
          <div className="rounded-2xl border border-white/10 bg-surface/30 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-display text-sm font-bold text-text flex items-center gap-2">
                <Database size={16} className="text-accent" />
                <span>Réinitialiser / Réinjecter les données par défaut</span>
              </h4>
              <p className="text-xs text-muted">
                Permet de restaurer les projets initiaux (GB Labs, BacPilot, etc.) ou de
                synchroniser la base Firestore.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-mono text-text hover:border-accent/40 hover:text-accent focus-ring"
            >
              {seeding ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Database size={14} />
              )}
              <span>Synchroniser Firestore</span>
            </button>
          </div>
        </div>
      )}

      {/* Standalone Hero Studio Modal if opened from top button */}
      {isHeroStudioOpen && profileImage && (
        <HeroImageStudioModal
          isOpen={isHeroStudioOpen}
          onClose={() => setIsHeroStudioOpen(false)}
          imageUrl={profileImage}
          onSave={(cropped) => {
            setProfileImage(cropped);
            handleSave();
          }}
        />
      )}
    </div>
  );
}
