import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects as defaultProjects, type Project } from "@/data/projects";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ProjectDetailClient } from "./ProjectDetailClient";

interface PageProps {
  params: {
    id: string;
  };
}

async function getProjectById(id: string): Promise<Project | null> {
  // 1. Try Firestore
  try {
    const snap = await getDoc(doc(db, "projects", id));
    if (snap.exists()) {
      return {
        ...(snap.data() as Project),
        id: snap.id,
      };
    }
  } catch {
    // ignore
  }

  // 2. Fallback to static
  const found = defaultProjects.find((p) => p.id === id);
  return found || null;
}

async function getAllProjects(): Promise<Project[]> {
  const list = [...defaultProjects];
  try {
    const snap = await getDocs(collection(db, "projects"));
    if (!snap.empty) {
      const dbList = snap.docs.map((d) => ({ ...(d.data() as Project), id: d.id }));
      const mergedMap = new Map<string, Project>();
      list.forEach((p) => mergedMap.set(p.id, p));
      dbList.forEach((p) => mergedMap.set(p.id, { ...mergedMap.get(p.id), ...p }));
      return Array.from(mergedMap.values());
    }
  } catch {
    // ignore
  }
  return list;
}

export async function generateStaticParams() {
  return defaultProjects.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectById(params.id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hilarus.dev";
  const cleanBase = baseUrl.replace(/\/$/, "");

  if (!project) {
    return {
      title: "Projet non trouvé — Hilarus Gbagoule",
      description: "Le projet demandé n'existe pas ou a été archivé.",
    };
  }

  const title = `${project.name} ${project.tagline ? `— ${project.tagline}` : ""} | Hilarus Gbagoule`;
  const description = `${project.shortDescription} Conçu & développé par Hilarus Gbagoule avec ${project.technologies.join(", ")}.`;
  const imageUrl = project.previewImage || project.coverImage || `${cleanBase}/icon`;

  return {
    title,
    description,
    keywords: [
      project.name,
      ...(project.tagline ? [project.tagline] : []),
      ...project.technologies,
      "Hilarus Gbagoule",
      "Digital Builder",
      "Portfolio Project",
      "Case Study",
      project.category || "software",
    ],
    alternates: {
      canonical: `${cleanBase}/projects/${project.id}`,
    },
    openGraph: {
      title,
      description,
      url: `${cleanBase}/projects/${project.id}`,
      siteName: "Hilarus Gbagoule — Digital Builder",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Aperçu du projet ${project.name}`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@hilarus",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  const all = await getAllProjects();
  const published = all.filter((p) => p.published !== false);
  const currentIndex = published.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? published[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < published.length - 1 ? published[currentIndex + 1] : null;
  const relatedProjects = published.filter((p) => p.id !== project.id).slice(0, 3);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hilarus.dev";
  const cleanBase = baseUrl.replace(/\/$/, "");
  const pageUrl = `${cleanBase}/projects/${project.id}`;
  const imageUrl = project.previewImage || project.coverImage || `${cleanBase}/icon`;

  // Schema.org SoftwareApplication / CreativeWork JSON-LD
  const isSoftware = project.category === "software" || project.category === "ai-data";
  const schemaType = isSoftware ? "SoftwareApplication" : "CreativeWork";

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${pageUrl}/#project`,
    name: project.name,
    headline: project.tagline || project.name,
    description: project.shortDescription,
    url: pageUrl,
    image: imageUrl,
    ...(project.externalUrl ? { sameAs: project.externalUrl } : {}),
    ...(isSoftware
      ? {
          applicationCategory:
            project.category === "ai-data"
              ? "Artificial Intelligence / Data Pipeline"
              : "WebApplication",
          operatingSystem: "All (Web, PWA)",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
          },
        }
      : {}),
    author: {
      "@type": "Person",
      name: "Hilarus Gbagoule",
      url: cleanBase,
      jobTitle: "Digital Builder & Product Engineer",
    },
    creator: {
      "@type": "Person",
      name: "Hilarus Gbagoule",
      url: cleanBase,
    },
    inLanguage: "fr-FR",
    keywords: project.technologies.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectDetailClient
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
        relatedProjects={relatedProjects}
        totalCount={published.length}
      />
    </>
  );
}
