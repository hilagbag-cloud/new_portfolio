export type MilestoneGalleryItem = {
  url: string;
  caption: string;
  tag: string;
  alt: string;
};

export type MilestoneHighlight = {
  label: string;
  value: string;
  detail?: string;
};

export type Milestone = {
  id: string;
  stepNumber: string;
  title: string;
  shortTitle: string;
  category: string;
  date: string;
  location?: string;
  badge: string;
  headline: string;
  description: string;
  longStory: string[];
  keyHighlights: MilestoneHighlight[];
  technologies: string[];
  gallery: MilestoneGalleryItem[];
  learnings: string[];
  externalUrl?: {
    label: string;
    href: string;
  };
  progress: number; // 0 -> 1 along the journey
  published: boolean;
};

export const milestones: Milestone[] = [
  {
    id: "bac",
    stepNumber: "01",
    shortTitle: "BAC",
    title: "Baccalauréat Scientifique & Premières Lignes de Code",
    category: "FONDATIONS & DÉCLIC",
    date: "2022 — 2023",
    location: "Cotonou, Bénin",
    badge: "Mention & Fondation",
    headline: "De la curiosité mathématique à la passion du code et des interfaces.",
    description:
      "Obtention du Baccalauréat Scientifique, point de départ d'une immersion autodidacte intensive dans l'ingénierie logicielle, les mathématiques appliquées et le design d'interfaces utilisateur.",
    longStory: [
      "Le baccalauréat scientifique a été le catalyseur d'une passion grandissante pour la création numérique. Entre rigueur mathématique et soif de concrétiser des idées, j'ai commencé à coder mes premiers scripts en Python, à concevoir des maquettes Figma et à explorer l'architecture web moderne.",
      "Cette période a forgé une discipline d'apprentissage autonome : comprendre les algorithmes fondamentaux, explorer les frameworks frontend et concevoir des applications utiles pour résoudre des défis du quotidien étudiant.",
      "C'est ici qu'est née la conviction centrale de mon travail : la meilleure technologie est celle qui allie une ergonomie impeccable à une ingénierie logicielle robuste."
    ],
    keyHighlights: [
      { label: "Spécialité", value: "Série Scientifique", detail: "Mathématiques & Physique" },
      { label: "Focus Initial", value: "Python & Frontend", detail: "Algorithmique, UI & Web" },
      { label: "Mindset", value: "Autodidacte & Craft", detail: "Prototypage continu" }
    ],
    technologies: ["Python", "JavaScript", "TypeScript", "Figma", "HTML/CSS", "Git"],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
        tag: "Découverte",
        caption: "Immersion dans les bases du développement logiciel et exploration d'algorithmes.",
        alt: "Poste de travail et environnement de développement de code"
      },
      {
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
        tag: "Design UI/UX",
        caption: "Premiers wireframes et systèmes visuels conçus pour des outils étudiants.",
        alt: "Conception d'interfaces et design interactif"
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        tag: "Apprentissage",
        caption: "Sessions d'expérimentation collective et résolution de problèmes algorithmiques.",
        alt: "Travail d'équipe et collaboration technologique"
      }
    ],
    learnings: [
      "Maîtrise des bases de la programmation orientée objet et des structures de données.",
      "Compréhension de la relation indissociable entre design centré utilisateur et efficacité technique.",
      "Création de la première version de projets d'aide aux révisions lycéennes."
    ],
    progress: 0.0,
    published: true,
  },
  {
    id: "noai",
    stepNumber: "02",
    shortTitle: "NOAI",
    title: "Olympiade Nationale d'IA — Bénin (Zindi)",
    category: "COMPÉTITION & MACHINE LEARNING",
    date: "2024",
    location: "Cotonou & Zindi Africa",
    badge: "Qualification d'Élite",
    headline: "Modélisation prédictive avancée, vision par ordinateur et sélection nationale.",
    description:
      "Compétition nationale d'intelligence artificielle sur la plateforme Zindi. Conception de pipelines de Computer Vision et de Machine Learning supervisé (ConvNeXt, Fastai, XGBoost) pour résoudre des problématiques complexes de classification et détection.",
    longStory: [
      "L'Olympiade Nationale d'IA a marqué un tournant dans mon approche de la data science et du Deep Learning. Confronté à des jeux de données réels et bruités, j'ai développé des architectures de vision par ordinateur résilientes et optimisé des pipelines d'entraînement en temps contraint.",
      "L'enjeu consistait à combiner des techniques avancées d'augmentation de données, des modèles de pointe (ConvNeXt, EfficientNet, FastAI) et du stacking d'arbres de décision (XGBoost, CatBoost) pour maximiser le F1-score et la robustesse de généralisation.",
      "Grâce à cette rigueur et à des itérations méthodiques, j'ai décroché ma qualification au sein de la sélection nationale pour représenter le Bénin sur la scène internationale."
    ],
    keyHighlights: [
      { label: "Plateforme", value: "Zindi Africa", detail: "Compétition ML compétitive" },
      { label: "Résultat", value: "Sélection Nationale", detail: "Top performers béninois" },
      { label: "Architecture", value: "Ensemble Learning", detail: "ConvNeXt + XGBoost" }
    ],
    technologies: ["Python", "PyTorch", "FastAI", "ConvNeXt", "XGBoost", "Scikit-Learn", "OpenCV"],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
        tag: "Computer Vision",
        caption: "Entraînement de réseaux convolutionnels profonds et analyse des cartes d'activation.",
        alt: "Visualisation de code et graphes de réseaux neuronaux"
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        tag: "Métriques & Tuning",
        caption: "Optimisation des hyperparamètres, matrices de confusion et validation croisée K-Fold.",
        alt: "Courbes de loss et métriques d'évaluation en machine learning"
      },
      {
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        tag: "Hackathon",
        caption: "Sprint intensif de modélisation prédictive lors des épreuves de sélection.",
        alt: "Espace de travail de compétition en science des données"
      }
    ],
    learnings: [
      "Pratique approfondie du fine-tuning de modèles pré-entraînés pour la vision par ordinateur.",
      "Gestion rigoureuse du surapprentissage via cross-validation stratifiée et régularisation.",
      "Capacité à itérer sous haute pression temporelle lors de compétitions de data science."
    ],
    progress: 0.33,
    published: true,
  },
  {
    id: "ioai",
    stepNumber: "03",
    shortTitle: "IOAI",
    title: "IOAI — International Olympiad in Artificial Intelligence",
    category: "SCÈNE INTERNATIONALE & RECHERCHE",
    date: "Août 2024",
    location: "Astana, Kazakhstan",
    badge: "Représentant Bénin",
    headline: "Confrontation mondiale des meilleurs jeunes talents en IA et éthique algorithmique.",
    description:
      "Participation à la première édition historique de l'IOAI (International Olympiad in Artificial Intelligence) à Astana. Épreuves pratiques de Computer Vision, NLP, agents autonomes et rounds d'IA éthique contre les délégations internationales.",
    longStory: [
      "Représenter le Bénin à l'Olympiade Internationale d'Intelligence Artificielle à Astana a été une expérience humaine et technique inestimable. Cet événement mondial a réuni des équipes de plus de 40 pays pour s'affronter sur des défis d'IA d'une complexité sans précédent.",
      "Les épreuves combinaient deux dimensions cruciales : le 'Scientific Round' (résolution de cas pratiques en vision par ordinateur, traitement automatique du langage naturel et apprentissage par renforcement) et le 'Practical & Ethics Round' (conception de solutions IA alignées avec les impératifs éthiques et sociétaux mondiaux).",
      "Au-delà de la compétition, ces échanges avec des chercheurs de rang mondial, des mentors de Google DeepMind et les esprits les plus brillants de notre génération ont consolidé ma vision : bâtir des produits technologiques novateurs avec un impact humain tangible."
    ],
    keyHighlights: [
      { label: "Événement", value: "1ère Édition IOAI", detail: "Astana, Kazakhstan" },
      { label: "Délégation", value: "Équipe Nationale Bénin", detail: "Représentation officielle" },
      { label: "Domaines", value: "CV, NLP & Éthique", detail: "Problèmes de recherche appliquée" }
    ],
    technologies: ["Transformers", "PyTorch", "Hugging Face", "LLM Alignment", "Computer Vision", "Reinforcement Learning"],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        tag: "Cérémonie & Arène",
        caption: "Ouverture officielle de l'IOAI à Astana et rassemblement des délégations mondiales.",
        alt: "Grande scène de conférence et d'olympiade internationale"
      },
      {
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        tag: "Épreuves Scientifiques",
        caption: "Résolution en direct de défis d'apprentissage profond et d'architectures neuronales.",
        alt: "Session de compétition scientifique et de programmation d'IA"
      },
      {
        url: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80",
        tag: "Délégations & Échanges",
        caption: "Partage d'expériences avec des chercheurs et talents venus de plus de 40 pays.",
        alt: "Échanges internationaux et collaboration scientifique"
      }
    ],
    learnings: [
      "Compréhension approfondie des enjeux de sécurité, d'alignement et d'éthique des grands modèles d'IA.",
      "Pratique des architectures Transformer avancées et des techniques d'inférence frugale.",
      "Réseau mondial de pairs et de mentors dans l'écosystème de l'intelligence artificielle."
    ],
    externalUrl: {
      label: "En savoir plus sur l'IOAI",
      href: "https://ioai-official.org"
    },
    progress: 0.66,
    published: true,
  },
  {
    id: "now",
    stepNumber: "04",
    shortTitle: "NOW",
    title: "Digital Builder & Conception de Produits à Fort Impact",
    category: "PRODUCTION & ENTREPRENEURIAT",
    date: "2025 — Aujourd'hui",
    location: "Remote / International",
    badge: "En pleine expansion",
    headline: "Fusionner le Design, le Software et l'IA pour créer des applications de nouvelle génération.",
    description:
      "Création de produits SaaS, PWA haute performance et systèmes interactifs avec GB Labs (BacPilot, AdjaStream). Collaboration avec des startups et porteurs de projets pour transformer des idées ambitieuses en solutions fonctionnelles et élégantes.",
    longStory: [
      "Aujourd'hui, je combine la rigueur acquise lors des compétitions d'IA et la créativité du design d'expérience pour concevoir des produits numériques complets de bout en bout.",
      "À travers des projets comme BacPilot (plateforme intelligente d'apprentissage guidé par IA) et AdjaStream (expérience média fluide et accessible), mon objectif est de concevoir des outils qui transforment concrètement le quotidien de leurs utilisateurs.",
      "Chaque produit est conçu selon les standards de l'artisanat numérique : typographie éditoriale, temps de réponse quasi-instantanés, animations contextuelles fluides et intégration transparente de modèles d'IA de pointe."
    ],
    keyHighlights: [
      { label: "Studio", value: "GB Labs & Freelance", detail: "Produits SaaS, PWA & IA" },
      { label: "Produits Phares", value: "BacPilot & AdjaStream", detail: "Utilisateurs actifs en production" },
      { label: "Mission", value: "Craft & Impact Réel", detail: "Design × Code × AI" }
    ],
    technologies: ["Next.js 14+", "TypeScript", "React", "Tailwind CSS", "Gemini API", "FastAPI", "PostgreSQL", "Framer Motion"],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        tag: "Produits Numériques",
        caption: "Architecture d'applications SaaS et PWA intégrant des couches d'IA avancées.",
        alt: "Interface logicielle moderne et design applicatif"
      },
      {
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
        tag: "Recherche & Dev",
        caption: "Expérimentations continues sur les interfaces d'agents autonomes et les LLMs.",
        alt: "Recherche et développement d'interfaces intelligentes"
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        tag: "Vision Future",
        caption: "Développement de nouveaux projets à l'intersection de l'Afrique et du monde tech global.",
        alt: "Croissance et prospective technologique"
      }
    ],
    learnings: [
      "Livraison de produits de production résilients, performants et hautement scalables.",
      "Intégration transparente de l'IA générative dans les flux de travail métiers réels.",
      "Accompagnement de clients et partenaires de la stratégie produit jusqu'au déploiement."
    ],
    externalUrl: {
      label: "Découvrir les projets",
      href: "#selected-work"
    },
    progress: 1.0,
    published: true,
  },
];
