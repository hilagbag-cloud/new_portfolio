export type ProjectCategory = "design" | "ai-data" | "software";
export type ProjectPreviewMode = "description" | "image";

export type Project = {
  id: string;
  number: string;
  name: string;
  tagline?: string;
  shortDescription: string;
  category?: ProjectCategory;
  previewMode?: ProjectPreviewMode;
  previewImage?: string;
  technologies: string[];
  coverImage?: string;
  externalUrl?: string;
  caseStudy?: boolean;
  published: boolean;
};

export const projects: Project[] = [
  {
    id: "bacpilot",
    number: "01",
    name: "BacPilot",
    tagline: "Orientation universitaire intelligente",
    shortDescription:
      "Plateforme d'orientation post-bac et d'accompagnement académique guidée pour les nouveaux bacheliers.",
    category: "software",
    previewMode: "description",
    previewImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    technologies: ["Next.js 14", "TypeScript", "Tailwind CSS", "Firebase"],
    externalUrl: "https://bacpilot.site",
    caseStudy: true,
    published: true,
  },
  {
    id: "gb-labs",
    number: "02",
    name: "GB Labs",
    tagline: "Data Pipeline & Multimodal AI Hub",
    shortDescription:
      "Laboratoire d'ingénierie de données, collecte et labellisation multimodale (Vision, Audio, NLP) pour modèles d'IA.",
    category: "ai-data",
    previewMode: "description",
    previewImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
    technologies: ["Python", "PyTorch", "FastAPI", "Vector Search"],
    externalUrl: "",
    caseStudy: true,
    published: true,
  },
  {
    id: "adjastream",
    number: "03",
    name: "AdjaStream",
    tagline: "Plateforme culturelle & Streaming",
    shortDescription:
      "Écosystème numérique et streaming haute-fidélité dédié à la préservation et diffusion de la musique Hadja.",
    category: "design",
    previewMode: "image",
    previewImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    technologies: ["Design System", "Figma", "Web Audio API", "React"],
    externalUrl: "",
    caseStudy: true,
    published: true,
  },
];

