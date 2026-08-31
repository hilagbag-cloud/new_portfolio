import type { Metadata } from "next";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface SocialLinksConfig {
  dribbble?: string;
  behance?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  facebook?: string;
  threads?: string;
  whatsapp?: string;
  telegram?: string;
  youtube?: string;
  tiktok?: string;
  discord?: string;
}

export interface ContactChannelsConfig {
  email?: string;
  whatsapp?: string;
  telegram?: string;
  phone?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  threads?: string;
  twitter?: string;
  github?: string;
  youtube?: string;
  tiktok?: string;
  discord?: string;
  calendly?: string;
}

export interface SocialVisibilityConfig {
  linkedin?: boolean;
  github?: boolean;
  twitter?: boolean;
  instagram?: boolean;
  facebook?: boolean;
  threads?: boolean;
  whatsapp?: boolean;
  telegram?: boolean;
  dribbble?: boolean;
  behance?: boolean;
  youtube?: boolean;
  tiktok?: boolean;
  discord?: boolean;
  email?: boolean;
  phone?: boolean;
  calendly?: boolean;
  [key: string]: boolean | undefined;
}

export interface SiteMetadataConfig {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  profileImage?: string;
  siteLogo?: string;
  heroImageWidth?: number;
  heroImageScale?: number;
  heroImageFit?: "contain" | "cover" | "natural";
  heroImageAspect?: "auto" | "portrait" | "square" | "tall";
  twitterCard?: "summary" | "summary_large_image";
  siteUrl?: string;
  author?: string;
  positioning?: string;
  tags?: string[];
  contactText?: string;
  contactEmail?: string;
  socials?: SocialLinksConfig;
  contactChannels?: ContactChannelsConfig;
  socialVisibility?: SocialVisibilityConfig;

  // Personal Identity & Google Knowledge Graph
  givenName?: string;
  familyName?: string;
  additionalName?: string;
  alternateNames?: string[];
  jobTitle?: string;
  companyOrOrg?: string;
  orgDescription?: string;
  bioLong?: string;
  nationality?: string;
  addressLocality?: string;
  addressCountry?: string;
  alumniOf?: string;
  knowsAbout?: string[];

  // Google Indexation & Search Verification
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  allowAiCrawlers?: boolean;
}

export const defaultSiteMetadata: SiteMetadataConfig = {
  metaTitle: "Hilarus Gbagoule — Digital Builder | Design × Software × AI",
  metaDescription:
    "Portfolio et profil officiel d'Hilarus Gbagoule, Digital Builder & Product Engineer. Créateur de BacPilot et GB Labs, combinant design d'expérience d'exception (UI/UX), architectures logicielles modernes (Next.js, TypeScript) et solutions d'intelligence artificielle sur mesure.",
  keywords: [
    "Hilarus Gbagoule",
    "Hilarus",
    "Gbagoule",
    "Hilarus Gbagoule portfolio",
    "Hilarus Gbagoule développeur",
    "Hilarus Gbagoule designer",
    "Hilarus Gbagoule ingénieur IA",
    "Hilarus Gbagoule EPITA",
    "Digital Builder",
    "Product Engineer",
    "Fullstack Engineer",
    "AI Technologist",
    "UI/UX Architect",
    "BacPilot",
    "BacPilot fondateur",
    "GB Labs",
    "AdjaStream",
    "Next.js 14",
    "TypeScript",
    "Gemini API",
    "Bénin Tech",
    "Développeur Afrique de l'Ouest",
    "Design System",
    "PWA Developer",
  ],
  ogTitle: "Hilarus Gbagoule — Digital Builder & Product Engineer",
  ogDescription:
    "Profil officiel de Hilarus Gbagoule. Design d'interfaces haute fidélité, ingénierie logicielle robuste et intégrations d'intelligence artificielle multimodale.",
  ogImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  profileImage: "",
  siteLogo: "",
  heroImageWidth: 540,
  heroImageScale: 1.05,
  heroImageFit: "contain",
  heroImageAspect: "auto",
  twitterCard: "summary_large_image",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://hilarus.dev",
  author: "Hilarus Gbagoule",
  positioning: "Je transforme des problèmes réels en expériences numériques, produits et expérimentations.",
  tags: ["DESIGN", "SOFTWARE", "AI"],
  contactText: "Tu as une idée, un problème ou un projet ?\nParlons-en directement ou via le formulaire.",
  contactEmail: "hilaruskazak@gmail.com",

  // Personal Info defaults
  givenName: "Hilarus",
  familyName: "Gbagoule",
  additionalName: "Kazak",
  alternateNames: ["Hilarus Gbagoule", "Hilarus", "Hilarus Kazak"],
  jobTitle: "Digital Builder & Product Engineer",
  companyOrOrg: "GB Labs",
  orgDescription: "Laboratoire d'ingénierie de données multimodales et IA.",
  nationality: "Bénin",
  addressLocality: "Cotonou",
  addressCountry: "Bénin",
  alumniOf: "EPITA — École pour l'informatique et les techniques avancées",
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Generative AI & LLMs",
    "UI/UX Design Systems",
    "Fullstack Software Engineering",
    "Next.js & React",
    "TypeScript",
    "Multimodal Data Pipelines",
    "Progressive Web Apps (PWA)",
    "Vector Embeddings",
  ],
  bioLong:
    "Digital Builder & Product Engineer spécialisé dans la convergence du design d'expérience (UI/UX), de l'ingénierie logicielle (Next.js, TypeScript) et de l'intelligence artificielle (Gemini, pipelines de données multimodaux).",

  // Indexation defaults
  googleSiteVerification: "",
  bingSiteVerification: "",
  canonicalUrl: "https://hilarus.dev",
  robotsIndex: true,
  robotsFollow: true,
  allowAiCrawlers: true,

  socials: {
    dribbble: "https://dribbble.com",
    behance: "https://behance.net",
    linkedin: "https://linkedin.com/in/hilarus-gbagoule-6a926b426",
    twitter: "https://twitter.com",
    github: "https://github.com",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    threads: "https://threads.net",
    whatsapp: "https://wa.me/22900000000",
    telegram: "",
    youtube: "",
    tiktok: "",
    discord: "",
  },
  contactChannels: {
    email: "hilaruskazak@gmail.com",
    whatsapp: "https://wa.me/22900000000",
    linkedin: "https://linkedin.com/in/hilarus-gbagoule-6a926b426",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    threads: "https://threads.net",
    twitter: "https://twitter.com",
    github: "https://github.com",
    phone: "",
    calendly: "",
    telegram: "",
    youtube: "",
    tiktok: "",
    discord: "",
  },
  socialVisibility: {
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
  },
};

/**
 * Fetch dynamic site metadata from Firestore with fallback to defaults
 */
export async function getDynamicSiteMetadata(): Promise<SiteMetadataConfig> {
  try {
    const docSnap = await getDoc(doc(db, "siteConfig", "global"));
    if (docSnap.exists()) {
      return {
        ...defaultSiteMetadata,
        ...docSnap.data(),
      };
    }
  } catch (error) {
    console.warn("Could not fetch dynamic siteConfig from Firestore, using defaults:", error);
  }
  return defaultSiteMetadata;
}

/**
 * Build rich JSON-LD Schema (Person + ProfilePage + WebSite) for Search Engines & AI Agents
 */
export function buildJsonLdSchema(config: SiteMetadataConfig) {
  const siteUrl = (config.siteUrl || defaultSiteMetadata.siteUrl!).replace(/\/$/, "");
  const authorName = config.author || defaultSiteMetadata.author || "Hilarus Gbagoule";
  const bio =
    config.bioLong ||
    config.metaDescription ||
    defaultSiteMetadata.bioLong!;

  const givenName = config.givenName || "Hilarus";
  const familyName = config.familyName || "Gbagoule";
  const additionalName = config.additionalName || "Kazak";
  const alternateNames = config.alternateNames?.length
    ? config.alternateNames
    : [authorName, givenName, `${givenName} ${additionalName}`];
  const jobTitle = config.jobTitle || "Digital Builder & Product Engineer";
  const nationality = config.nationality || "Bénin";
  const alumni = config.alumniOf || "EPITA — École pour l'informatique et les techniques avancées";
  const knowsAbout = config.knowsAbout?.length ? config.knowsAbout : defaultSiteMetadata.knowsAbout!;

  const visibility = config.socialVisibility || defaultSiteMetadata.socialVisibility || {};
  const socialsMap = config.socials || defaultSiteMetadata.socials || {};
  const sameAsLinks = Object.entries(socialsMap)
    .filter(([key, url]) => {
      const isVisible = visibility[key] !== false;
      return isVisible && typeof url === "string" && url.trim().startsWith("http");
    })
    .map(([, url]) => url as string);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: authorName,
        givenName,
        familyName,
        additionalName,
        alternateName: alternateNames,
        url: siteUrl,
        image: config.siteLogo || config.profileImage || config.ogImage || `${siteUrl}/icon`,
        description: bio,
        jobTitle,
        nationality: {
          "@type": "Country",
          name: nationality,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: config.addressLocality || "Cotonou",
          addressCountry: config.addressCountry || nationality,
        },
        alumniOf: [
          {
            "@type": "EducationalOrganization",
            name: alumni,
          },
        ],
        knowsAbout,
        sameAs: sameAsLinks,
        worksFor: [
          {
            "@type": "Organization",
            name: config.companyOrOrg || "GB Labs",
            logo: config.siteLogo || `${siteUrl}/icon`,
            description: config.orgDescription || "Laboratoire d'ingénierie logicielle et intelligence artificielle.",
          },
          {
            "@type": "Organization",
            name: "BacPilot",
            url: "https://bacpilot.site",
            logo: `${siteUrl}/icon`,
            description: "Plateforme d'orientation académique intelligente.",
          },
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: `${authorName} — ${jobTitle} | Portfolio & Profil`,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        mainEntity: {
          "@id": `${siteUrl}/#person`,
        },
        about: {
          "@id": `${siteUrl}/#person`,
        },
        description: bio,
        inLanguage: "fr-FR",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${authorName} Portfolio`,
        description: bio,
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
        author: {
          "@id": `${siteUrl}/#person`,
        },
        inLanguage: "fr-FR",
      },
    ],
  };
}

/**
 * Convert site metadata config into Next.js Metadata object
 */
export function buildNextMetadata(config: SiteMetadataConfig): Metadata {
  const title = config.metaTitle || defaultSiteMetadata.metaTitle!;
  const description = config.metaDescription || defaultSiteMetadata.metaDescription!;
  const siteUrl = config.siteUrl || defaultSiteMetadata.siteUrl!;
  const cleanUrl = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  const ogTitle = config.ogTitle || title;
  const ogDesc = config.ogDescription || description;
  const ogImg = config.ogImage || defaultSiteMetadata.ogImage!;
  const authorName = config.author || defaultSiteMetadata.author!;

  const shouldIndex = config.robotsIndex !== false;
  const shouldFollow = config.robotsFollow !== false;

  const verification: Metadata["verification"] = {};
  if (config.googleSiteVerification) {
    verification.google = config.googleSiteVerification;
  }
  if (config.bingSiteVerification) {
    verification.other = { "msvalidate.01": config.bingSiteVerification };
  }

  const siteLogoIcon = config.siteLogo || "/icon";
  const appleIcon = config.siteLogo || "/apple-icon";

  return {
    title: {
      default: title,
      template: `%s | ${authorName}`,
    },
    description,
    keywords: config.keywords || defaultSiteMetadata.keywords,
    authors: [
      { name: authorName, url: cleanUrl },
    ],
    creator: authorName,
    publisher: authorName,
    applicationName: `${authorName} Portfolio`,
    generator: "Next.js",
    metadataBase: new URL(cleanUrl),
    alternates: {
      canonical: config.canonicalUrl || cleanUrl,
    },
    icons: {
      icon: [
        { url: siteLogoIcon, type: "image/png", sizes: "48x48" },
        { url: siteLogoIcon, type: "image/png", sizes: "192x192" },
      ],
      shortcut: [siteLogoIcon],
      apple: [
        { url: appleIcon, sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.webmanifest",
    verification,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: cleanUrl,
      siteName: `${authorName} — Digital Builder`,
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: `${authorName} — Digital Builder | Design × Software × AI`,
        },
      ],
      type: "profile",
      locale: "fr_FR",
      countryName: config.nationality || "Bénin",
    },
    twitter: {
      card: config.twitterCard || "summary_large_image",
      title: ogTitle,
      description: ogDesc,
      images: [ogImg],
      creator: "@hilarus",
      site: "@hilarus",
    },
    robots: {
      index: shouldIndex,
      follow: shouldFollow,
      googleBot: {
        index: shouldIndex,
        follow: shouldFollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "technology",
    classification: "Portfolio, Software Engineering, AI & Design",
    other: {
      "profile:first_name": config.givenName || "Hilarus",
      "profile:last_name": config.familyName || "Gbagoule",
      "profile:username": "hilarus",
      "profile:gender": "male",
      "ai-content-declaration": "portfolio-profile",
      "llms-txt": `${cleanUrl}/llms.txt`,
    },
  };
}
