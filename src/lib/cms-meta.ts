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
  calendly?: string;
}

export interface SiteMetadataConfig {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  profileImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  siteUrl?: string;
  author?: string;
  positioning?: string;
  tags?: string[];
  contactText?: string;
  contactEmail?: string;
  socials?: SocialLinksConfig;
  contactChannels?: ContactChannelsConfig;
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
  profileImage: "/me.jpg",
  twitterCard: "summary_large_image",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://hilarus.dev",
  author: "Hilarus Gbagoule",
  positioning: "Je transforme des problèmes réels en expériences numériques, produits et expérimentations.",
  tags: ["DESIGN", "SOFTWARE", "AI"],
  contactText: "Tu as une idée, un problème ou un projet ?\nParlons-en directement ou via le formulaire.",
  contactEmail: "hilaruskazak@gmail.com",
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
    config.metaDescription ||
    "Digital Builder & Product Engineer spécialisé dans la convergence du design d'expérience (UI/UX), de l'ingénierie logicielle (Next.js, TypeScript) et de l'intelligence artificielle (Gemini, pipelines de données multimodaux).";

  const sameAsLinks = Object.values(config.socials || defaultSiteMetadata.socials || {}).filter(
    (url) => Boolean(url) && url.startsWith("http")
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: authorName,
        givenName: "Hilarus",
        familyName: "Gbagoule",
        additionalName: "Kazak",
        alternateName: ["Hilarus Gbagoule", "Hilarus", "Hilarus Kazak"],
        url: siteUrl,
        image: config.ogImage || `${siteUrl}/me.jpg`,
        description: bio,
        jobTitle: "Digital Builder & Product Engineer",
        nationality: {
          "@type": "Country",
          name: "Bénin",
        },
        alumniOf: [
          {
            "@type": "EducationalOrganization",
            name: "EPITA",
            description: "École pour l'informatique et les techniques avancées",
          },
        ],
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
        sameAs: sameAsLinks,
        worksFor: [
          {
            "@type": "Organization",
            name: "GB Labs",
            description: "Laboratoire d'ingénierie de données multimodales et IA.",
          },
          {
            "@type": "Organization",
            name: "BacPilot",
            url: "https://bacpilot.site",
            description: "Plateforme d'orientation académique intelligente.",
          },
        ],
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: `${authorName} — Digital Builder | Portfolio & Profil`,
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

  return {
    title: {
      default: title,
      template: `%s | Hilarus Gbagoule`,
    },
    description,
    keywords: config.keywords || defaultSiteMetadata.keywords,
    authors: [
      { name: config.author || defaultSiteMetadata.author!, url: cleanUrl },
    ],
    creator: config.author || defaultSiteMetadata.author!,
    publisher: config.author || defaultSiteMetadata.author!,
    applicationName: "Hilarus Gbagoule Portfolio",
    generator: "Next.js",
    metadataBase: new URL(cleanUrl),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      url: cleanUrl,
      siteName: "Hilarus Gbagoule — Digital Builder",
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: "Hilarus Gbagoule — Digital Builder | Design × Software × AI",
        },
      ],
      type: "profile",
      locale: "fr_FR",
      countryName: "Bénin",
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
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "technology",
    classification: "Portfolio, Software Engineering, AI & Design",
    other: {
      "profile:first_name": "Hilarus",
      "profile:last_name": "Gbagoule",
      "profile:username": "hilarus",
      "profile:gender": "male",
      "ai-content-declaration": "portfolio-profile",
      "llms-txt": `${cleanUrl}/llms.txt`,
    },
  };
}
