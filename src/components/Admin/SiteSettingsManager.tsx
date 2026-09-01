"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, resolvedFirebaseConfig } from "@/lib/firebase";
import {
  sanitizeForFirestore,
  saveLocalDraft,
  loadLocalDraft,
  getFirestoreErrorMessage,
  parseFirestoreError,
  type DetailedFirestoreErrorInfo,
} from "@/lib/firestore-utils";
import {
  defaultSiteMetadata,
  type SiteMetadataConfig,
  type SocialVisibilityConfig,
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
  Maximize2,
  Palette,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Youtube,
  MessageSquare,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Send,
  MessageCircle,
  Phone,
  Calendar,
  Mail,
} from "lucide-react";
import { seedInitialCmsData } from "@/lib/cms-seed";
import { ImageUploader } from "./ImageUploader";
import { HeroImageStudioModal } from "./HeroImageStudioModal";
import { ConfirmWriteModal, type PendingFirestoreWrite } from "./ConfirmWriteModal";
import { FirestoreErrorModal } from "./FirestoreErrorModal";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";

export function SiteSettingsManager({
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
  const [siteLogo, setSiteLogo] = useState(defaultSiteMetadata.siteLogo || "");
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
    defaultSiteMetadata.alumniOf || ""
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
  const [aboutSummary, setAboutSummary] = useState(
    defaultSiteMetadata.aboutSummary || ""
  );
  const [heroOfficialSync, setHeroOfficialSync] = useState(
    defaultSiteMetadata.heroOfficialSync ?? true
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
  const [youtubeUrl, setYoutubeUrl] = useState(
    defaultSiteMetadata.socials?.youtube || ""
  );
  const [tiktokUrl, setTiktokUrl] = useState(
    defaultSiteMetadata.socials?.tiktok || ""
  );
  const [discordUrl, setDiscordUrl] = useState(
    defaultSiteMetadata.socials?.discord || ""
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

  // Socials Visibility State (Public vs Hidden checkboxes)
  const [socialVisibility, setSocialVisibility] = useState<SocialVisibilityConfig>({
    linkedin: true,
    github: true,
    twitter: true,
    instagram: true,
    facebook: true,
    threads: true,
    whatsapp: true,
    telegram: true,
    dribbble: true,
    behance: true,
    youtube: false,
    tiktok: false,
    discord: false,
    email: true,
    phone: true,
    calendly: true,
  });

  const toggleSocialVisibility = (key: string) => {
    setSocialVisibility((prev) => ({
      ...prev,
      [key]: prev[key] !== undefined ? !prev[key] : false,
    }));
  };

  const setAllSocialVisibility = (visible: boolean) => {
    setSocialVisibility((prev) => {
      const updated: SocialVisibilityConfig = {};
      Object.keys(prev).forEach((k) => {
        updated[k] = visible;
      });
      return updated;
    });
  };

  // Studio modal for hero image
  const [isHeroStudioOpen, setIsHeroStudioOpen] = useState(false);

  // Hero Image custom width & scaling parameters
  const [heroImageWidth, setHeroImageWidth] = useState(
    defaultSiteMetadata.heroImageWidth || 560
  );
  const [heroImageScale, setHeroImageScale] = useState(
    defaultSiteMetadata.heroImageScale || 1.05
  );
  const [heroImageFit, setHeroImageFit] = useState<"contain" | "cover" | "natural">(
    defaultSiteMetadata.heroImageFit || "contain"
  );

  // Status state
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedJsonLd, setCopiedJsonLd] = useState(false);
  const [copiedDns, setCopiedDns] = useState<string | null>(null);

  // Manual Confirmation State
  const [pendingWrite, setPendingWrite] = useState<PendingFirestoreWrite | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Detailed Error Modal State
  const [errorModalInfo, setErrorModalInfo] = useState<DetailedFirestoreErrorInfo | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        // Check local draft first
        const localDraft = loadLocalDraft<SiteMetadataConfig>("site_settings");

        const docSnap = await getDoc(doc(db, "siteConfig", "global"));
        let data: Partial<SiteMetadataConfig> = {};
        if (docSnap.exists()) {
          data = docSnap.data() as SiteMetadataConfig;
        }

        // If local draft exists, merge with preference to local draft so user edits are not lost
        if (localDraft && localDraft.data) {
          data = { ...data, ...localDraft.data };
        }

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
        if (data.siteLogo) setSiteLogo(data.siteLogo);
        if (data.twitterCard) setTwitterCard(data.twitterCard);
        if (data.siteUrl) setSiteUrl(data.siteUrl);
        if (data.author) setAuthor(data.author);
        if (data.positioning) setPositioning(data.positioning);
        if (data.profileImage && data.profileImage !== "/hilarus.png") {
          setProfileImage(data.profileImage);
        } else if (data.profileImage === "") {
          setProfileImage("");
        }
        if (data.heroImageWidth !== undefined) setHeroImageWidth(data.heroImageWidth);
        if (data.heroImageScale !== undefined) setHeroImageScale(data.heroImageScale);
        if (data.heroImageFit) setHeroImageFit(data.heroImageFit);
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
        if (data.aboutSummary) setAboutSummary(data.aboutSummary);
        if (data.heroOfficialSync !== undefined) setHeroOfficialSync(data.heroOfficialSync);

        if (data.socialVisibility) {
          setSocialVisibility((prev) => ({
            ...prev,
            ...data.socialVisibility,
          }));
        }

        if (data.socials) {
          if (data.socials.dribbble !== undefined) setDribbbleUrl(data.socials.dribbble);
          if (data.socials.behance !== undefined) setBehanceUrl(data.socials.behance);
          if (data.socials.linkedin !== undefined) setLinkedinUrl(data.socials.linkedin);
          if (data.socials.twitter !== undefined) setTwitterUrl(data.socials.twitter);
          if (data.socials.github !== undefined) setGithubUrl(data.socials.github);
          if (data.socials.instagram !== undefined) setInstagramUrl(data.socials.instagram);
          if (data.socials.facebook !== undefined) setFacebookUrl(data.socials.facebook);
          if (data.socials.threads !== undefined) setThreadsUrl(data.socials.threads);
          if (data.socials.telegram !== undefined) setTelegramUrl(data.socials.telegram);
          if (data.socials.youtube !== undefined) setYoutubeUrl(data.socials.youtube);
          if (data.socials.tiktok !== undefined) setTiktokUrl(data.socials.tiktok);
          if (data.socials.discord !== undefined) setDiscordUrl(data.socials.discord);
        }

        if (data.contactChannels) {
          if (data.contactChannels.whatsapp !== undefined)
            setWhatsappUrl(data.contactChannels.whatsapp);
          if (data.contactChannels.telegram !== undefined)
            setTelegramUrl(data.contactChannels.telegram);
          if (data.contactChannels.phone !== undefined)
            setPhoneVal(data.contactChannels.phone);
          if (data.contactChannels.calendly !== undefined)
            setCalendlyUrl(data.contactChannels.calendly);
          if (data.contactChannels.email !== undefined)
            setContactEmail(data.contactChannels.email);
          if (data.contactChannels.youtube !== undefined)
            setYoutubeUrl(data.contactChannels.youtube);
          if (data.contactChannels.tiktok !== undefined)
            setTiktokUrl(data.contactChannels.tiktok);
          if (data.contactChannels.discord !== undefined)
            setDiscordUrl(data.contactChannels.discord);
        }
      } catch (err) {
        console.error("Error loading site config:", err);
      }
    }
    loadConfig();
  }, []);

  const [savedSection, setSavedSection] = useState<string | null>(null);

  const handleProfileImageUpdate = (val: string) => {
    setProfileImage(val);
    if (heroOfficialSync) {
      if (!ogImage || ogImage === profileImage) {
        setOgImage(val);
      }
      if (!siteLogo || siteLogo === profileImage) {
        setSiteLogo(val);
      }
    }
    if (typeof window !== "undefined") {
      try {
        if (val) {
          localStorage.setItem("cms_profile_image", val);
        } else {
          localStorage.removeItem("cms_profile_image");
        }
      } catch {
        // ignore
      }
    }
  };

  const handleSave = (e?: React.FormEvent, sectionLabel?: string) => {
    if (e) e.preventDefault();
    setSaveError(null);

    const payload: SiteMetadataConfig = {
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      keywords: (keywords || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      ogTitle: ogTitle || metaTitle || "",
      ogDescription: ogDescription || metaDescription || "",
      ogImage: ogImage || "",
      siteLogo: siteLogo || "",
      profileImage: profileImage || "",
      heroOfficialSync: Boolean(heroOfficialSync),
      heroImageWidth: Number(heroImageWidth) || 560,
      heroImageScale: Number(heroImageScale) || 1.0,
      heroImageFit: heroImageFit || "contain",
      twitterCard: twitterCard || "summary_large_image",
      siteUrl: siteUrl || "https://hilarus.dev",
      author: author || "Hilarus Gbagoule",
      positioning: positioning || "",
      tags: (tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      contactText: contactText || "",
      contactEmail: contactEmail || "",

      // Search Engine & Google Controls
      googleSiteVerification: googleSiteVerification || "",
      bingSiteVerification: bingSiteVerification || "",
      canonicalUrl: canonicalUrl || siteUrl || "https://hilarus.dev",
      robotsIndex: Boolean(robotsIndex),
      robotsFollow: Boolean(robotsFollow),
      allowAiCrawlers: Boolean(allowAiCrawlers),

      // Personal Identity & Knowledge Graph
      givenName: givenName || "Hilarus",
      familyName: familyName || "Gbagoule",
      additionalName: additionalName || "Kazak",
      alternateNames: (alternateNames || "")
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
      jobTitle: jobTitle || "",
      nationality: nationality || "Bénin",
      addressLocality: addressLocality || "Cotonou",
      addressCountry: nationality || "Bénin",
      alumniOf: alumniOf || "",
      companyOrOrg: companyOrOrg || "GB Labs",
      orgDescription: orgDescription || "",
      knowsAbout: (knowsAbout || "")
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
      bioLong: bioLong || "",
      aboutSummary: aboutSummary || "",

      socialVisibility: socialVisibility || {},
      socials: {
        dribbble: dribbbleUrl || "",
        behance: behanceUrl || "",
        linkedin: linkedinUrl || "",
        twitter: twitterUrl || "",
        github: githubUrl || "",
        instagram: instagramUrl || "",
        facebook: facebookUrl || "",
        threads: threadsUrl || "",
        whatsapp: whatsappUrl || "",
        telegram: telegramUrl || "",
        youtube: youtubeUrl || "",
        tiktok: tiktokUrl || "",
        discord: discordUrl || "",
      },
      contactChannels: {
        email: contactEmail || "",
        whatsapp: whatsappUrl || "",
        telegram: telegramUrl || "",
        linkedin: linkedinUrl || "",
        instagram: instagramUrl || "",
        facebook: facebookUrl || "",
        threads: threadsUrl || "",
        twitter: twitterUrl || "",
        github: githubUrl || "",
        youtube: youtubeUrl || "",
        tiktok: tiktokUrl || "",
        discord: discordUrl || "",
        phone: phoneVal || "",
        calendly: calendlyUrl || "",
      },
    };

    // 1. Immediately backup to local draft so user never loses their changes
    saveLocalDraft("site_settings", payload);

    if (typeof window !== "undefined" && profileImage) {
      try {
        localStorage.setItem("cms_profile_image", profileImage);
      } catch {
        // ignore
      }
    }

    // 2. Sanitize deeply to strip out empty strings and empty objects
    const sanitizedPayload = sanitizeForFirestore(payload, {
      removeEmptyStrings: true,
      removeEmptyArrays: false,
      removeEmptyObjects: true,
    }) as Record<string, unknown>;

    // 3. Require manual confirmation modal before writing to Firestore
    setPendingWrite({
      title: `Enregistrement des paramètres globaux ${sectionLabel ? `(${sectionLabel})` : ""}`,
      description: "Validation requise avant écriture dans Firestore. Les champs vides ont été purgés pour garder la base de données optimisée.",
      collection: "siteConfig",
      docId: "global",
      payload: sanitizedPayload,
      actionType: "setDoc",
      onConfirm: async () => {
        try {
          setLoading(true);
          await setDoc(
            doc(db, "siteConfig", "global"),
            {
              ...sanitizedPayload,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );

          setSaved(true);
          if (sectionLabel) {
            setSavedSection(sectionLabel);
            setTimeout(() => setSavedSection(null), 4000);
          }
          setTimeout(() => setSaved(false), 3500);
        } catch (err: unknown) {
          console.error("Error saving site config to Firestore:", err);
          const detailedErr = parseFirestoreError(err, {
            collection: "siteConfig",
            docId: "global",
            payload: sanitizedPayload,
          });
          setErrorModalInfo(detailedErr);
          setIsErrorModalOpen(true);
          setSaveError(detailedErr.title);
        } finally {
          setLoading(false);
        }
      },
      onReject: () => {
        // User explicitly rejected write
      },
    });

    setIsConfirmModalOpen(true);
  };

  const handleSeedDatabase = () => {
    setPendingWrite({
      title: "Synchronisation globale des données initiales",
      description: "Cette action va initialiser ou synchroniser les collections 'siteConfig', 'projects' et 'milestones' sur votre base Firestore.",
      collection: "multi-collections (siteConfig, projects, milestones)",
      payload: { action: "seed_initial_defaults", timestamp: new Date().toISOString() },
      actionType: "batchWrite",
      onConfirm: async () => {
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
      },
    });
    setIsConfirmModalOpen(true);
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
    siteLogo,
    ogImage,
    socialVisibility,
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
      telegram: telegramUrl,
      youtube: youtubeUrl,
      tiktok: tiktokUrl,
      discord: discordUrl,
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
                ? "bg-accent text-accent-contrast"
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
                ? "bg-accent text-accent-contrast"
                : "text-muted hover:text-text"
            }`}
          >
            <Palette size={14} />
            <span>Thème & Couleurs</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("content")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSubTab === "content"
                ? "bg-accent text-accent-contrast"
                : "text-muted hover:text-text"
            }`}
          >
            <Sliders size={14} />
            <span>Textes, Photo Hero & Réseaux</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("dns")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeSubTab === "dns"
                ? "bg-accent text-accent-contrast"
                : "text-muted hover:text-text"
            }`}
          >
            <Server size={14} />
            <span>DNS & Vercel</span>
          </button>
        </div>
      </div>

      {/* Global Edit Lock Status Banner */}
      {!isEditingEnabled ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-300">
                Mode Consultation Sécurisé (Édition Verrouillée)
              </h4>
              <p className="text-[11px] text-amber-200/80">
                Les champs, descriptions, photos et réseaux sont protégés contre toute modification accidentelle. Cliquez sur Activer pour modifier.
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
                Vous pouvez modifier toutes les sections. Cliquez sur &quot;Valider et Appliquer cette section&quot; pour enregistrer définitivement sur Firebase.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(undefined, "Toutes les configurations")}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-300 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
              <span>Tout Sauvegarder Définitivement</span>
            </button>
            <button
              type="button"
              onClick={toggleEditing}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-surface px-3 py-2 text-xs font-semibold text-text hover:bg-white/5"
            >
              <span>🔒 Verrouiller</span>
            </button>
          </div>
        </div>
      )}

      {/* Section validation feedback banner */}
      {savedSection && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 p-3 text-xs text-emerald-300">
          <Check size={16} />
          <span>Section <strong>{savedSection}</strong> validée et enregistrée avec succès sur Firestore !</span>
        </div>
      )}

      {/* Safety alert banner when Firestore sync faces an issue */}
      {saveError && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-200 shadow-sm">
          <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">
              Progression sécurisée localement dans votre navigateur (0 perte de données)
            </p>
            <p className="text-amber-200/80 text-[11px] leading-relaxed">
              Vos modifications et saisies sont conservées en mémoire et en cache local. {saveError}
            </p>
          </div>
        </div>
      )}

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
                      label="Logo Officiel du Site & Icône Google Search (Favicon)"
                      sublabel="Logo carré (recommandé min. 48×48 ou 512×512 px) utilisé par Google Search, la balise Schema.org et les favoris."
                      value={siteLogo}
                      onChange={(val) => setSiteLogo(val)}
                      aspectRatio="1/1"
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

                <div className="rounded-xl border border-border/80 bg-[#161a17] p-4 font-sans text-xs space-y-1.5 shadow-inner">
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    {/* Google Search Favicon display */}
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#202722] border border-white/10 overflow-hidden shrink-0">
                      {siteLogo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={siteLogo}
                          alt="Logo Google"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-mono text-[10px] font-bold text-accent">H.</span>
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[12px] text-white font-medium truncate">{author || "Hilarus Gbagoule"}</span>
                      <span className="text-[10px] text-[#bdc1c6] truncate">{siteUrl || "https://hilarus.dev"}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-[#8ab4f8] line-clamp-1 hover:underline cursor-pointer">
                    {metaTitle || "Hilarus Gbagoule — Digital Builder"}
                  </h4>
                  <p className="text-[12px] text-[#bdc1c6] line-clamp-2 leading-relaxed">
                    {metaDescription ||
                      "Design × Software × AI. Hilarus Gbagoule transforme des problèmes réels en produits numériques..."}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px] font-mono text-muted border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <span>Sitemap XML (Standard) :</span>
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline flex items-center gap-1"
                    >
                      <span>/sitemap.xml</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Sitemap Dynamique :</span>
                    <a
                      href="/api/sitemap"
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline flex items-center gap-1"
                    >
                      <span>/api/sitemap</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
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
              className="btn-skew !py-2.5 !px-6 !text-xs !bg-accent !text-accent-contrast !border-accent hover:!bg-accent/90 focus-ring font-bold shadow-lg"
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
                  className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-accent-contrast transition-colors focus-ring"
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
              onChange={handleProfileImageUpdate}
              aspectRatio="1/1"
              showCropTool={true}
            />

            {/* Hero & Official Sync Option */}
            <div className="mt-3">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-accent/30 bg-accent/10 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={heroOfficialSync}
                  onChange={(e) => {
                    setHeroOfficialSync(e.target.checked);
                    if (e.target.checked && profileImage) {
                      setOgImage(profileImage);
                      setSiteLogo(profileImage);
                    }
                  }}
                  className="accent-accent h-4 w-4 rounded cursor-pointer"
                />
                <div>
                  <span className="font-bold text-text block">
                    Synchroniser avec l&apos;Image Officielle & OpenGraph (Partage Réseaux)
                  </span>
                  <span className="text-muted text-[11px]">
                    Applique automatiquement la photo du Hero à la balise OpenGraph (partage Facebook, LinkedIn, Twitter) et à l&apos;image officielle du schéma de données.
                  </span>
                </div>
              </label>
            </div>

            {/* Custom Width & Scaling Controls for Hero */}
            <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Maximize2 size={16} className="text-accent" />
                  <span className="text-xs font-bold text-text uppercase tracking-wider font-mono">
                    Largeur & Dimensions de la photo Hero
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-md border border-accent/30">
                  {heroImageWidth}px • {Math.round(heroImageScale * 100)}%
                </span>
              </div>

              {/* Width Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Largeur max (Bureau / Desktop)</span>
                  <span className="text-accent font-semibold">{heroImageWidth} px</span>
                </div>
                <input
                  type="range"
                  min="320"
                  max="850"
                  step="10"
                  value={heroImageWidth}
                  onChange={(e) => setHeroImageWidth(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer h-2 bg-surface rounded-lg"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { label: "Compact", width: 420 },
                    { label: "Standard", width: 500 },
                    { label: "Large (Recommandé)", width: 580 },
                    { label: "Très Large", width: 680 },
                    { label: "Plein Écran", width: 820 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setHeroImageWidth(preset.width)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors ${
                        heroImageWidth === preset.width
                          ? "bg-accent text-bg font-bold shadow-sm"
                          : "bg-surface border border-border text-muted hover:text-text hover:border-accent/40"
                      }`}
                    >
                      {preset.label} ({preset.width}px)
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale / Zoom Slider */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Échelle visuelle / Zoom</span>
                  <span className="text-accent font-semibold">{Math.round(heroImageScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.6"
                  step="0.05"
                  value={heroImageScale}
                  onChange={(e) => setHeroImageScale(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer h-2 bg-surface rounded-lg"
                />
              </div>

              {/* Fit Mode */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <label className="text-xs font-mono text-muted block">Mode d&apos;ajustement</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setHeroImageFit("contain")}
                    className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border ${
                      heroImageFit === "contain"
                        ? "border-accent bg-accent/20 text-accent font-bold"
                        : "border-border bg-surface text-muted hover:text-text"
                    }`}
                  >
                    <span>Naturel / Proportions réelles (Contain)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroImageFit("cover")}
                    className={`px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border ${
                      heroImageFit === "cover"
                        ? "border-accent bg-accent/20 text-accent font-bold"
                        : "border-border bg-surface text-muted hover:text-text"
                    }`}
                  >
                    <span>Remplir le cadre (Cover)</span>
                  </button>
                </div>
              </div>
            </div>
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

          {/* Social Profiles & Visibility Control Section */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface/70 border border-border/70 p-3.5 rounded-xl">
              <div>
                <h4 className="font-display text-sm font-bold text-text uppercase tracking-wider flex items-center gap-2">
                  <Share2 size={16} className="text-accent" />
                  <span>Réseaux Sociaux & Visibilité Publique</span>
                </h4>
                <p className="text-xs text-muted mt-0.5">
                  Cochez ou décochez les cases pour choisir exactement quels profils sont <strong>publics sur le site</strong> (Hero, Footer, Contact et Balises SEO).
                </p>
              </div>

              {/* Quick actions: Show all / Hide all */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setAllSocialVisibility(true)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-accent/40 bg-accent/10 text-accent hover:bg-accent/20 transition-colors flex items-center gap-1"
                >
                  <Eye size={12} />
                  <span>Tout afficher</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAllSocialVisibility(false)}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-border bg-surface text-muted hover:text-text transition-colors flex items-center gap-1"
                >
                  <EyeOff size={12} />
                  <span>Tout masquer</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LinkedIn */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Linkedin size={14} className="text-[#0A66C2]" />
                    <span>LinkedIn</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("linkedin")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.linkedin !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.linkedin !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/votre-profil"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* GitHub */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Github size={14} className="text-white" />
                    <span>GitHub</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("github")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.github !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.github !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/votre-pseudo"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Facebook */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Facebook size={14} className="text-[#1877F2]" />
                    <span>Facebook</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("facebook")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.facebook !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.facebook !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/votre-page"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Instagram */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Instagram size={14} className="text-[#E4405F]" />
                    <span>Instagram</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("instagram")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.instagram !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.instagram !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/votre-pseudo"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Twitter / X */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Twitter size={14} className="text-white" />
                    <span>Twitter / X</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("twitter")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.twitter !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.twitter !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://twitter.com/votre-handle"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Threads */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Globe size={14} className="text-white" />
                    <span>Threads</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("threads")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.threads !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.threads !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={threadsUrl}
                  onChange={(e) => setThreadsUrl(e.target.value)}
                  placeholder="https://threads.net/@votre-pseudo"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Dribbble */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Globe size={14} className="text-[#ea4c89]" />
                    <span>Dribbble</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("dribbble")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.dribbble !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.dribbble !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={dribbbleUrl}
                  onChange={(e) => setDribbbleUrl(e.target.value)}
                  placeholder="https://dribbble.com/votre-portfolio"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Behance */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Globe size={14} className="text-[#1769ff]" />
                    <span>Behance</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("behance")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.behance !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.behance !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={behanceUrl}
                  onChange={(e) => setBehanceUrl(e.target.value)}
                  placeholder="https://behance.net/votre-profil"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* YouTube */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Youtube size={14} className="text-[#FF0000]" />
                    <span>YouTube</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("youtube")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.youtube
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.youtube ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/@votre-chaine"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* TikTok */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Globe size={14} className="text-[#00f2fe]" />
                    <span>TikTok</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("tiktok")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.tiktok
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.tiktok ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://tiktok.com/@votre-pseudo"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Discord */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <MessageSquare size={14} className="text-[#5865F2]" />
                    <span>Discord</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("discord")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.discord
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.discord ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={discordUrl}
                  onChange={(e) => setDiscordUrl(e.target.value)}
                  placeholder="https://discord.gg/... ou pseudo#0000"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Telegram */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Send size={14} className="text-[#0088cc]" />
                    <span>Telegram</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("telegram")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.telegram !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.telegram !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={telegramUrl}
                  onChange={(e) => setTelegramUrl(e.target.value)}
                  placeholder="https://t.me/username ou @username"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>
            </div>
          </div>

          {/* Direct Messaging & Contact Channels Section */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="bg-surface/70 border border-border/70 p-3.5 rounded-xl">
              <h4 className="font-display text-sm font-bold text-text uppercase tracking-wider flex items-center gap-2">
                <MessageCircle size={16} className="text-accent" />
                <span>Canaux de Contact Direct (Section Contact)</span>
              </h4>
              <p className="text-xs text-muted mt-0.5">
                Boutons d&apos;action 1-clic pour discuter sur WhatsApp, appel téléphonique ou prise de rendez-vous avec gestion de la visibilité publique.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <MessageCircle size={14} className="text-[#25D366]" />
                    <span>WhatsApp</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("whatsapp")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.whatsapp !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.whatsapp !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  value={whatsappUrl}
                  onChange={(e) => setWhatsappUrl(e.target.value)}
                  placeholder="https://wa.me/22900000000 ou +229..."
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Phone */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Phone size={14} className="text-accent" />
                    <span>Numéro de Téléphone</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("phone")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.phone !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.phone !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="tel"
                  value={phoneVal}
                  onChange={(e) => setPhoneVal(e.target.value)}
                  placeholder="+229 00 00 00 00"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>

              {/* Calendly */}
              <div className="p-3.5 rounded-xl border border-border bg-surface/60 space-y-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 font-display text-xs font-bold text-text">
                    <Calendar size={14} className="text-[#006BFF]" />
                    <span>Calendly / Cal.com (Réservation d&apos;appel)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleSocialVisibility("calendly")}
                    className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      socialVisibility.calendly !== false
                        ? "bg-accent/15 border-accent text-accent shadow-sm"
                        : "bg-surface border-border text-muted opacity-70"
                    }`}
                  >
                    {socialVisibility.calendly !== false ? (
                      <>
                        <Eye size={11} />
                        <span>Public (Visible)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} />
                        <span>Masqué</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="url"
                  value={calendlyUrl}
                  onChange={(e) => setCalendlyUrl(e.target.value)}
                  placeholder="https://calendly.com/votrenom/30min"
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-text focus-ring"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-skew !py-2.5 !px-6 !text-xs !bg-accent !text-accent-contrast !border-accent hover:!bg-accent/90 focus-ring font-bold shadow-lg"
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
                className="flex items-center gap-1.5 rounded-xl border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-mono font-bold text-accent hover:bg-accent hover:text-accent-contrast transition-colors"
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

      {/* Manual Confirmation Modal before any Firestore write */}
      <ConfirmWriteModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPendingWrite(null);
        }}
        pendingWrite={pendingWrite}
      />

      {/* Detailed Firestore Diagnostic & Error Modal */}
      <FirestoreErrorModal
        isOpen={isErrorModalOpen}
        errorInfo={errorModalInfo}
        onClose={() => setIsErrorModalOpen(false)}
        onRetry={() => handleSave()}
      />
    </div>
  );
}
