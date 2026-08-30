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
  // --- Brouillons importés depuis l'ancien portfolio (hilarusblog.vercel.app/projets) ---
  {
    id: "ramadan",
    number: "04",
    name: "Ramadan Kareem — Lumina Agency",
    tagline: "Landing Page · Design",
    shortDescription:
      "Page événementielle élégante pour le mois sacré du Ramadan avec animations et design doré.",
    category: "design",
    previewMode: "image",
    previewImage: "/projects/ramadan.png",
    technologies: ["HTML/CSS", "JavaScript", "Animation", "Landing Page"],
    externalUrl: "https://melx7078-hub.github.io/Ramadan/",
    caseStudy: false,
    published: false,
  },
  {
    id: "kids",
    number: "05",
    name: "Wonderbloom — Plateforme éducative",
    tagline: "Landing Page · Éducation",
    shortDescription:
      "Site coloré pour une agence éducative pour enfants de 3 à 10 ans. Design ludique et engageant.",
    category: "design",
    previewMode: "image",
    previewImage: "/projects/kids.png",
    technologies: ["UI/UX", "JavaScript", "Responsive", "Education"],
    externalUrl: "https://melx7078-hub.github.io/Kids/",
    caseStudy: false,
    published: false,
  },
  {
    id: "digital-store",
    number: "06",
    name: "DigitalStore — Boutique digitale",
    tagline: "E-commerce · Design",
    shortDescription:
      "Boutique de produits digitaux premium : UI kits, templates, icônes. Design éditorial soigné.",
    category: "design",
    previewMode: "image",
    previewImage: "/projects/digital-store.png",
    technologies: ["E-commerce", "Design System", "HTML/CSS", "UI Kit"],
    externalUrl: "https://melx7078-hub.github.io/digital-store/",
    caseStudy: false,
    published: false,
  },
  {
    id: "try-it",
    number: "07",
    name: "Wen. — Agence de branding",
    tagline: "Landing Page · Branding",
    shortDescription:
      "Site vitrine pour une agence de branding. Design sombre avec accents colorés et typographie forte.",
    category: "design",
    previewMode: "image",
    previewImage: "/projects/try-it.png",
    technologies: ["Branding", "Dark Mode", "Typography", "CSS Grid"],
    externalUrl: "https://melx7078-hub.github.io/Try-it/",
    caseStudy: false,
    published: false,
  },
  {
    id: "php",
    number: "08",
    name: "Nova Lenha — E-commerce pellets",
    tagline: "Landing Page · E-commerce",
    shortDescription:
      "Landing page e-commerce pour une entreprise de pellets de bois. Design chaleureux et professionnel.",
    category: "software",
    previewMode: "image",
    previewImage: "/projects/php.png",
    technologies: ["E-commerce", "PHP", "Landing Page", "Web"],
    externalUrl: "https://melx7078-hub.github.io/Php",
    caseStudy: false,
    published: false,
  },
  {
    id: "my-landing",
    number: "09",
    name: "Wen. Studio — Design créatif",
    tagline: "Landing Page · Branding",
    shortDescription:
      "Studio de design avec une esthétique dark mode épurée et une typographie impactante.",
    category: "design",
    previewMode: "image",
    previewImage: "/projects/my-landing.png",
    technologies: ["Creative Studio", "Design", "CSS3", "Branding"],
    externalUrl: "https://melx7078-hub.github.io/my-landingg/",
    caseStudy: false,
    published: false,
  },
  {
    id: "php-intro",
    number: "10",
    name: "PHXCore — Studio PHP",
    tagline: "Landing Page · Dev",
    shortDescription:
      "Site vitrine pour un studio de développement PHP avec un design tech futuriste.",
    category: "software",
    previewMode: "image",
    previewImage: "/projects/php-intro.png",
    technologies: ["PHP", "Dev Studio", "Tech UI", "JavaScript"],
    externalUrl: "https://melx7078-hub.github.io/php-introduction/",
    caseStudy: false,
    published: false,
  },
  {
    id: "hilarus-blog",
    number: "11",
    name: "Hilarus Blog — Portfolio v1",
    tagline: "Portfolio · Personnel",
    shortDescription:
      "Première version de mon portfolio personnel déployé sur Vercel.",
    category: "software",
    previewMode: "image",
    previewImage: "/projects/hilarus-blog.png",
    technologies: ["React", "Vite", "Tailwind CSS", "Supabase"],
    externalUrl: "https://hilarusblog.vercel.app/",
    caseStudy: false,
    published: false,
  },
  {
    id: "tailla",
    number: "12",
    name: "TAILLA — Gestion pour tailleurs",
    tagline: "Web App · Gestion",
    shortDescription:
      "Application de gestion de commandes, clients et modèles pour tailleurs et couturiers.",
    category: "software",
    previewMode: "image",
    previewImage: "/projects/tailla.png",
    technologies: ["Next.js", "Tailwind CSS", "Web App", "SaaS"],
    externalUrl: "https://v0-tailleur-application.vercel.app/",
    caseStudy: false,
    published: false,
  },
  {
    id: "wordsx",
    number: "13",
    name: "WordsX — Éditeur de texte",
    tagline: "Web App · Outil",
    shortDescription:
      "Éditeur de texte en ligne minimaliste avec export et mise en forme.",
    category: "software",
    previewMode: "image",
    previewImage: "/projects/wordsx.png",
    technologies: ["React", "Text Editor", "Productivity", "Web Tool"],
    externalUrl: "https://wordsx.lovable.app",
    caseStudy: false,
    published: false,
  },
  {
    id: "oneclick",
    number: "14",
    name: "OneClick — Déploiement en un clic",
    tagline: "Web App · Outil Dev",
    shortDescription:
      "Plateforme pour écrire du HTML et déployer instantanément sur GitHub Pages.",
    category: "software",
    previewMode: "image",
    previewImage: "/projects/oneclick.png",
    technologies: ["Web App", "Developer Tools", "GitHub API", "React"],
    externalUrl: "https://one-click2live.lovable.app/",
    caseStudy: false,
    published: false,
  },
];

