# HILARUS PORTFOLIO — CLAUDE CODE MASTER SPECIFICATION

> **Document de référence principal pour Claude Code**
>
> Version : 1.0  
> Statut : Foundation / V1  
> Projet : Portfolio personnel de Hilarus Gbagoule

---

## 0. RÈGLE DE PRIORITÉ

Ce document est la source de vérité du projet.

Claude Code doit :

1. lire ce document avant toute modification importante ;
2. respecter l'architecture, le design system et les comportements décrits ici ;
3. ne pas remplacer arbitrairement une décision par une autre « meilleure » ;
4. demander une clarification uniquement lorsqu'une décision est réellement bloquante ;
5. préserver les fonctionnalités existantes lors de toute modification ;
6. ne jamais sacrifier la robustesse responsive au profit d'un effet visuel ;
7. ne jamais inventer de contenu biographique, de statistiques, de projets ou de résultats ;
8. séparer le contenu, la logique métier, les composants et le design ;
9. privilégier une implémentation simple, maintenable et progressive ;
10. ne pas ajouter de dépendance ou de librairie sans justification.

**Principe directeur :**

> Design sophistiqué, architecture simple, animation utile, contenu authentique.

---

# 1. VISION

Créer un portfolio personnel premium, sombre, éditorial et technologique présentant Hilarus Gbagoule comme un profil hybride à l'intersection de :

**Design × Software × AI × Data**

Le portfolio ne doit pas ressembler à un CV traditionnel.

Il doit raconter une trajectoire :

```text
CURIOSITÉ
    ↓
APPRENTISSAGE
    ↓
EXPÉRIMENTATION
    ↓
PROJETS
    ↓
NOAI
    ↓
IOAI
    ↓
CONSTRUCTION
    ↓
NEXT
```

Le visiteur doit comprendre rapidement qui est Hilarus, puis pouvoir explorer son parcours en profondeur.

---

# 2. OBJECTIFS

## Objectif principal

Présenter :

- identité ;
- positionnement ;
- projets ;
- expertise ;
- parcours ;
- expérimentations ;
- histoire personnelle/professionnelle ;
- moyens de contact.

## Objectifs UX

Le site doit suivre :

```text
DISCOVER
    ↓
UNDERSTAND
    ↓
EXPLORE
    ↓
TRUST
    ↓
CONTACT
```

Le site doit être mémorable sans devenir spectaculaire au détriment de l'utilisabilité.

---

# 3. DIRECTION ARTISTIQUE

## Thème

**Dark Editorial / Digital Lab**

Mots-clés :

- minimal ;
- premium ;
- humain ;
- technique ;
- éditorial ;
- expérimental ;
- précis.

Éviter toute esthétique cyberpunk ou « AI template ».

---

# 4. DESIGN SYSTEM

## 4.1 Couleurs

Palette V1 :

```text
BACKGROUND       #080A09
SURFACE          #101411
BORDER           #252B27
PRIMARY TEXT     #F1F3EE
SECONDARY TEXT   #8C958D
ACCENT GREEN     #A8F35A
```

Le vert acide est un **accent**.

Il ne doit pas recouvrir toute l'interface.

Règle approximative :

```text
90% neutres / 10% accent
```

Le visage de Hilarus doit rester naturel. Ne pas appliquer de filtre vert sur la peau.

---

## 4.2 Typographie

### Titres

**Space Grotesk**

### Texte

**Inter**

### Métadonnées

**IBM Plex Mono**

IBM Plex Mono est réservé notamment à :

- dates ;
- lieux ;
- numéros de projets ;
- catégories ;
- informations techniques ;
- labels de timeline.

---

## 4.3 Icônes

Utiliser **Lucide Icons** comme unique famille d'icônes.

Style :

- outline ;
- cohérent ;
- 16–20 px par défaut ;
- stroke fin.

Ne pas mélanger plusieurs bibliothèques d'icônes.

---

## 4.4 Formes

Cards :

```text
border-radius: 12–16px
```

Boutons :

```text
border-radius: 8–12px
```

Bordures :

```text
1px
```

Éviter :

- grosses cartes très arrondies ;
- blobs ;
- glassmorphism excessif ;
- gradients omniprésents ;
- ombres lourdes.

---

# 5. ARCHITECTURE DES PAGES

La V1 est principalement une expérience single-page avec possibilité d'ouvrir des études de cas individuelles.

Structure :

```text
NAVIGATION
    ↓
HERO
    ↓
SELECTED WORK
    ↓
EXPERTISE
    ↓
JOURNEY
    ↓
THE LAB
    ↓
ABOUT
    ↓
CONTACT
    ↓
FOOTER
```

Les sections doivent avoir des IDs stables pour permettre la navigation par ancres.

---

# 6. NAVIGATION

## Desktop

Structure conceptuelle :

```text
HILARUS.       WORK   JOURNEY   LAB   ABOUT       [LET'S BUILD ↗]
```

La navigation doit être sticky.

Au chargement :

- discrète ;
- légère ;
- intégrée au fond.

Pendant le scroll :

- devient légèrement compacte ;
- reste lisible ;
- ne doit pas masquer le contenu.

## Mobile

```text
HILARUS.                                      MENU
```

Le menu mobile doit être plein écran ou quasi plein écran.

Navigation :

```text
WORK
JOURNEY
LAB
ABOUT
CONTACT
```

Animation courte et fluide.

---

# 7. HERO

## Contenu

Titre :

```text
DIGITAL
BUILDER.
```

Positionnement :

```text
Je transforme des problèmes réels en expériences numériques,
produits et expérimentations.
```

Tags :

```text
DESIGN × SOFTWARE × AI
```

CTA principal :

```text
EXPLORE MY WORK ↘
```

CTA secondaire possible :

```text
DOWNLOAD CV ↓
```

## Photo

Une photo professionnelle de Hilarus doit être intégrée au Hero.

Traitement :

- détourage propre si nécessaire ;
- fond sombre ;
- lumière verte très subtile ;
- profondeur ;
- ombre légère ;
- parallax léger ;
- visage naturel.

La photo ne doit pas sembler collée sur le site.

Elle fait partie de la composition.

---

# 8. SELECTED WORK

Afficher en priorité les projets réellement pertinents.

Projets connus pour la V1 :

- BacPilot ;
- AdjaStream ;
- GB Labs.

D'autres projets peuvent être ajoutés uniquement s'ils sont confirmés.

## Carte projet

Structure :

```text
PROJECT NUMBER

PROJECT NAME

SHORT DESCRIPTION

TECHNOLOGIES

IMAGE / VIDEO

EXPLORE PROJECT ↗
```

Les projets importants doivent pouvoir devenir des études de cas.

Ne pas chercher à afficher un grand nombre de projets.

**Qualité > quantité.**

---

# 9. ÉTUDE DE CAS

Chaque projet important peut suivre :

```text
PROJECT
    ↓
THE PROBLEM
    ↓
THE IDEA
    ↓
THE PROCESS
    ↓
THE PRODUCT
    ↓
TECHNOLOGIES
    ↓
RESULT / LEARNING
    ↓
NEXT
```

Ne pas présenter uniquement des screenshots.

Montrer le raisonnement lorsque les données sont disponibles.

Ne jamais inventer un résultat, un utilisateur, une métrique ou une fonctionnalité.

---

# 10. EXPERTISE

Présenter trois axes principaux :

## DESIGN

- UI ;
- UX ;
- Web Design ;
- Visual Systems.

## SOFTWARE

- Web Applications ;
- PWA ;
- Product Development.

## AI / DATA

- Artificial Intelligence ;
- Data Science ;
- Automation.

Une quatrième catégorie peut être ajoutée plus tard :

## EXPERIMENTATION

Cette section doit rester visuellement légère.

---

# 11. JOURNEY — ROADMAP SIGNATURE

La roadmap est l'élément graphique principal du portfolio.

Elle doit reproduire l'esprit de la courbe dessinée dans la maquette :

- organique ;
- fluide ;
- élégante ;
- humaine ;
- visuellement dessinée ;
- jamais mécanique.

## Technologie

Utiliser un **SVG responsive** contenant une courbe Bézier.

La courbe doit être un path continu.

Ne pas simuler la courbe avec une succession de `div`, bordures ou petits segments.

Ne pas utiliser de coordonnées pixel fixes pour les milestones.

---

# 12. GÉOMÉTRIE DE LA ROADMAP

Le chemin visuel et les données doivent être séparés.

Concept :

```text
PATH
│
├── 0.00 → BAC
├── 0.32 → NOAI
├── 0.67 → IOAI
└── 1.00 → NOW
```

Les valeurs sont indicatives.

L'administration doit pouvoir définir l'ordre et, si nécessaire, la position relative d'une étape.

Le système doit pouvoir fonctionner sur plusieurs tailles d'écran.

## Desktop

La trajectoire peut être horizontale et organique.

## Mobile

La trajectoire doit être adaptée à une composition verticale.

Ne pas essayer de faire rentrer le SVG desktop dans le mobile.

La donnée reste identique ; la géométrie responsive peut changer.

---

# 13. ANIMATION DE LA ROADMAP

Le scroll pilote la progression.

Architecture :

```text
USER SCROLL
    ↓
SCROLL PROGRESS
    ↓
SVG PATH PROGRESS
    ↓
ACTIVE MILESTONE
    ↓
CONTENT TRANSITION
```

La ligne doit se révéler progressivement.

Le point indicateur doit suivre la trajectoire.

Utiliser de préférence :

- GSAP ;
- ScrollTrigger ;
- SVG path metrics ;
- animation optimisée.

Éviter un listener `scroll` lourd qui force des calculs à chaque frame.

---

# 14. MILESTONE

Chaque étape de la timeline possède :

- date ;
- titre ;
- description ;
- position ;
- catégorie ;
- lieu éventuel ;
- image de couverture ;
- galerie ;
- technologies éventuelles ;
- lien éventuel.

Exemples V1 :

```text
BAC
NOAI
IOAI
NOW
```

Les informations doivent être facilement modifiables.

---

# 15. ACTIVATION D'UN MILESTONE

Lorsqu'un point devient actif :

### 1. Le point arrive sur sa position

### 2. Le point augmente légèrement

### 3. Un halo apparaît

### 4. Le contenu du milestone entre dans la scène

Animation recommandée :

```text
opacity: 0 → 1
translateY: 20px → 0
scale: 0.97 → 1
blur: léger → 0
```

L'animation doit être courte.

Éviter les zooms agressifs.

---

# 16. CONTENU DYNAMIQUE DE LA ROADMAP

Lorsque NOAI devient actif :

```text
NOAI
2025

Description...

[ IMAGE ]
[ IMAGE ]
[ IMAGE ]
```

La galerie associée peut démarrer automatiquement.

Lorsque l'utilisateur quitte la zone active :

```text
PAUSE CAROUSEL
```

Ne jamais faire fonctionner inutilement plusieurs carrousels simultanément.

---

# 17. CARROUSEL

Chaque milestone peut avoir une galerie.

Structure de donnée :

```ts
type Milestone = {
  id: string
  title: string
  date: string
  description?: string
  longDescription?: string
  location?: string
  progress: number
  coverImage?: string
  images?: string[]
  technologies?: string[]
  externalUrl?: string
  published: boolean
}
```

Le carousel doit :

- fonctionner au clavier ;
- fonctionner au tactile ;
- respecter `prefers-reduced-motion` ;
- mettre l'autoplay en pause hors contexte ;
- ne pas provoquer de layout shift.

---

# 18. ADMINISTRATION / DATA-DRIVEN

Le contenu ne doit pas être hardcodé directement dans les composants visuels.

Séparer :

```text
DATA
COMPONENTS
ANIMATION
STYLING
```

Structure indicative :

```text
src/
├── app/
├── components/
├── data/
│   ├── milestones.ts
│   ├── projects.ts
│   ├── expertise.ts
│   └── experiments.ts
└── ...
```

Plus tard, les fichiers de données pourront être remplacés par un CMS ou une base de données.

L'architecture ne doit donc pas dépendre d'un CMS dès la V1 si cela complexifie inutilement le projet.

---

# 19. EXEMPLE DE DONNÉES

```ts
const milestones = [
  {
    id: "bac",
    title: "Baccalauréat",
    date: "2024",
    progress: 0.0,
    published: true,
  },
  {
    id: "noai",
    title: "NOAI",
    date: "2025",
    progress: 0.32,
    published: true,
  },
  {
    id: "ioai",
    title: "IOAI",
    date: "2026",
    location: "Astana, Kazakhstan",
    progress: 0.67,
    published: true,
  },
  {
    id: "now",
    title: "Now",
    date: "2026",
    progress: 1.0,
    published: true,
  },
]
```

Les contenus réels doivent remplacer les placeholders avant publication.

---

# 20. THE LAB

Cette section représente ce qui est actuellement exploré et construit.

Exemple :

```text
CURRENTLY EXPLORING

AI
DATA
AUTOMATION
WEB
PRODUCT

CURRENTLY BUILDING

BAC PILOT
GB LABS
...
```

Cette section doit pouvoir évoluer sans refonte du layout.

---

# 21. ABOUT

L'objectif n'est pas de recopier un CV.

La section doit présenter :

- curiosité ;
- apprentissage ;
- expérimentation ;
- création ;
- technologie ;
- parcours ;
- vision.

Le texte doit être authentique et basé uniquement sur des informations confirmées.

---

# 22. CONTACT

Titre :

```text
LET'S BUILD.
```

Texte :

```text
Tu as une idée, un problème ou un projet ?
Parlons-en.
```

Champs :

```text
NAME
EMAIL
PROJECT TYPE
MESSAGE
```

Types possibles :

```text
Web
AI
Automation
Product
Other
```

CTA :

```text
SEND MESSAGE ↗
```

Le formulaire doit avoir :

- validation client ;
- validation serveur si backend ;
- états loading/success/error ;
- protection anti-spam raisonnable ;
- messages d'erreur accessibles.

---

# 23. FOOTER

Minimal.

Exemple :

```text
HILARUS.

Designer × Developer × AI

Let's build something useful.

GitHub
LinkedIn
Email

© 2026 Hilarus
```

Ne pas répéter inutilement toute la page.

---

# 24. MOTION DESIGN

Principe :

> **No animation without purpose.**

## Hero

Reveal progressif.

## Navigation

Compression au scroll.

## Projects

Reveal subtil.

## Roadmap

Scroll-driven.

## Milestone

Scale + glow + content reveal.

## Gallery

Autoplay uniquement lorsque pertinente.

## CTA

Micro-interaction.

## Photo

Parallax très léger.

---

# 25. ANIMATIONS À ÉVITER

Ne pas ajouter :

- particules permanentes ;
- texte tournant ;
- effets cyberpunk ;
- glow excessif ;
- animations de plusieurs secondes ;
- scroll hijacking agressif ;
- effets 3D inutiles ;
- dizaines de transitions concurrentes.

Le visiteur doit ressentir la qualité du mouvement, pas regarder une démonstration technique.

---

# 26. STACK

Stack recommandée :

```text
Next.js
React
TypeScript
Tailwind CSS
GSAP
ScrollTrigger
Framer Motion
Lucide Icons
SVG
```

## Responsabilités

### GSAP / ScrollTrigger

À utiliser principalement pour :

- progression de la roadmap ;
- animation liée au scroll ;
- séquences complexes synchronisées avec le scroll.

### Framer Motion

À utiliser principalement pour :

- transitions React ;
- apparition de composants ;
- micro-interactions ;
- navigation ;
- changements d'état.

Ne pas faire contrôler le même élément simultanément par GSAP et Framer Motion sans raison explicite.

---

# 27. RESPONSIVE

Breakpoints à adapter au projet, mais au minimum :

```text
Mobile
Tablet
Desktop
Large Desktop
```

Tester notamment :

- petits téléphones Android ;
- grands téléphones ;
- tablettes ;
- 1366 px ;
- 1440 px ;
- 1920 px.

La roadmap doit être testée séparément sur mobile et desktop.

---

# 28. PERFORMANCE

Obligations :

- images WebP/AVIF lorsque pertinent ;
- lazy loading des médias hors écran ;
- dimensions réservées aux images ;
- pas de vidéos lourdes par défaut ;
- animations GPU-friendly ;
- limitation des calculs pendant le scroll ;
- pause des animations hors viewport ;
- éviter les dépendances inutiles.

Objectif :

**la qualité visuelle ne doit jamais rendre le site lent.**

---

# 29. ACCESSIBILITÉ

Le site doit rester utilisable sans animations.

Prévoir :

- navigation clavier ;
- focus visible ;
- contrastes suffisants ;
- textes lisibles ;
- alt text ;
- boutons sémantiques ;
- labels de formulaire ;
- `prefers-reduced-motion`.

Lorsque :

```css
@media (prefers-reduced-motion: reduce)
```

est actif :

- désactiver les mouvements non essentiels ;
- supprimer le parallax ;
- réduire ou supprimer l'autoplay ;
- garder le contenu de la roadmap accessible.

---

# 30. SEO

Prévoir :

- title ;
- meta description ;
- Open Graph ;
- favicon ;
- structure H1/H2/H3 cohérente ;
- données structurées lorsque pertinentes ;
- URLs propres pour les études de cas ;
- images avec alt text.

Le SEO ne doit pas modifier le design.

---

# 31. ARCHITECTURE DES COMPOSANTS

Architecture indicative :

```text
components/
├── Navigation/
├── Hero/
├── SelectedWork/
├── ProjectCard/
├── ProjectCaseStudy/
├── Expertise/
├── Journey/
│   ├── JourneyPath/
│   ├── Milestone/
│   └── MilestoneContent/
├── Gallery/
├── Lab/
├── About/
├── Contact/
└── Footer/
```

Chaque composant doit avoir une responsabilité claire.

Éviter un composant monolithique contenant toute la page.

---

# 32. ARCHITECTURE DES DONNÉES

```text
data/
├── projects.ts
├── milestones.ts
├── expertise.ts
├── experiments.ts
└── site.ts
```

Le contenu éditorial doit être séparé des composants.

---

# 33. PHOTO

La photo officielle doit être utilisée de manière cohérente.

Règles :

- même traitement colorimétrique ;
- même niveau de contraste ;
- pas de filtres contradictoires ;
- aucune déformation ;
- conservation des proportions ;
- pas de détourage visible ;
- lumière verte subtile et cohérente avec le système visuel.

Si plusieurs photos sont utilisées :

elles doivent avoir une direction photographique homogène.

---

# 34. PRINCIPES DE COHÉRENCE VISUELLE

Tout composant doit respecter :

```text
Dark background
White typography
Acid green accent
Fine borders
Moderate radius
Editorial spacing
Consistent iconography
Controlled motion
```

Ne pas introduire une nouvelle couleur simplement pour décorer.

Ne pas introduire une nouvelle police.

Ne pas introduire une nouvelle bibliothèque d'icônes sans nécessité.

---

# 35. RÈGLES DE ROBUSTESSE

La priorité est :

```text
1. Fonctionnement
2. Responsive
3. Accessibilité
4. Performance
5. Design
6. Animation
```

Un effet visuel doit être supprimé ou simplifié s'il provoque :

- overflow ;
- layout shift ;
- ralentissement ;
- comportement incorrect sur mobile ;
- problème d'accessibilité.

---

# 36. ROADMAP — RÈGLES ABSOLUES

La roadmap est critique.

Claude Code ne doit jamais :

- remplacer le SVG par des `div` sans raison ;
- utiliser des coordonnées pixel fixes pour les points ;
- casser la courbe pour modifier un milestone ;
- dupliquer le path pour chaque étape ;
- recalculer toute la géométrie à chaque scroll ;
- utiliser une animation non responsive ;
- modifier la géométrie desktop lorsqu'il corrige un autre composant.

Toute modification de la roadmap doit être testée sur :

```text
Mobile
Tablet
1366px
1440px
1920px
```

---

# 37. MOBILE

Le mobile n'est pas une version réduite du desktop.

Il possède sa propre composition.

Même contenu :

```text
BAC
NOAI
IOAI
NOW
```

mais géométrie adaptée.

Le scroll doit rester naturel.

Ne jamais bloquer ou détourner excessivement le scroll natif.

---

# 38. ÉTATS DE LA ROADMAP

La roadmap doit gérer au minimum :

```text
idle
approaching
active
completed
```

Exemple :

### Idle

Point discret.

### Approaching

Point légèrement mis en évidence.

### Active

Point agrandi + contenu affiché.

### Completed

Point reste visible mais revient à un état moins dominant.

---

# 39. ÉTAT GLOBAL DU JOURNEY

Concept :

```ts
type JourneyState = {
  activeMilestoneId: string | null
  progress: number
  reducedMotion: boolean
}
```

La progression globale doit piloter le path.

Le milestone actif doit être dérivé de la progression plutôt que géré par une multitude de conditions indépendantes.

---

# 40. GESTION DES ERREURS

Tout contenu dynamique doit avoir un fallback.

Exemples :

- image absente → placeholder élégant ;
- galerie vide → afficher le contenu sans carousel ;
- URL absente → ne pas afficher le bouton ;
- description absente → ne pas laisser un espace vide artificiel.

Une donnée manquante ne doit jamais casser le layout.

---

# 41. PLACEHOLDERS

Pour la première implémentation, les contenus fictifs sont autorisés uniquement comme placeholders clairement identifiés.

Exemple :

```text
[PROJECT IMAGE]
[PROJECT DESCRIPTION]
```

Ne pas publier de fausses informations en production.

---

# 42. GESTION DES MÉDIAS

Prévoir une convention :

```text
/images/projects/
  bacpilot/
  adjastream/
  gb-labs/

/images/journey/
  bac/
  noai/
  ioai/

/images/profile/
```

Les fichiers doivent avoir des noms descriptifs.

Éviter :

```text
IMG_1234.jpg
image-final-final2.png
```

Préférer :

```text
ioai-astana-team.webp
bacpilot-dashboard.webp
hilarus-portrait.webp
```

---

# 43. ADMIN FUTURE

L'architecture doit permettre plus tard de connecter :

- CMS ;
- base de données ;
- dashboard privé.

Mais **ne pas construire un dashboard complet en V1 sans besoin réel**.

Préparer seulement des interfaces de données propres.

---

# 44. VERSIONING

Le design system doit être centralisé.

Si possible :

```text
styles/
├── tokens.css
├── globals.css
```

ou une configuration Tailwind centralisée.

Ne pas disperser les valeurs de couleurs dans 40 composants.

---

# 45. DESIGN TOKENS

Exemple conceptuel :

```css
:root {
  --color-bg: #080A09;
  --color-surface: #101411;
  --color-border: #252B27;
  --color-text: #F1F3EE;
  --color-muted: #8C958D;
  --color-accent: #A8F35A;
}
```

Les composants doivent consommer ces tokens autant que possible.

---

# 46. TESTS AVANT VALIDATION

Avant de considérer une feature terminée :

### Fonctionnel

- navigation ;
- ancres ;
- projets ;
- roadmap ;
- carousel ;
- formulaire.

### Responsive

- mobile ;
- tablette ;
- desktop ;
- grand écran.

### Motion

- animation normale ;
- reduced motion.

### Performance

- pas de jank visible ;
- pas de layout shift majeur.

### Accessibilité

- clavier ;
- focus ;
- contraste ;
- labels.

---

# 47. MÉTHODE DE TRAVAIL DE CLAUDE CODE

Avant de modifier le projet :

```text
1. Inspecter l'existant.
2. Comprendre l'architecture.
3. Identifier les composants concernés.
4. Vérifier les dépendances déjà présentes.
5. Modifier uniquement ce qui est nécessaire.
6. Tester.
7. Vérifier le responsive.
8. Vérifier les régressions.
```

Ne pas réécrire tout le projet pour modifier une section.

---

# 48. INTERDICTION DE RÉGRESSION

Lorsqu'une nouvelle feature est ajoutée :

> aucune fonctionnalité existante ne doit être cassée volontairement.

Exemple :

Si Claude Code travaille sur :

```text
CONTACT
```

il ne doit pas modifier la géométrie de :

```text
JOURNEY
```

sauf nécessité technique démontrée.

---

# 49. PHILOSOPHIE DE CODE

Le code doit être :

- lisible ;
- typé ;
- modulaire ;
- documenté lorsque nécessaire ;
- simple ;
- testable ;
- maintenable.

Éviter les abstractions inutiles.

Éviter les hacks.

Éviter les valeurs magiques.

Préférer :

```text
tokens
constants
data models
reusable components
```

---

# 50. PHILOSOPHIE DE DESIGN

Le site doit donner cette impression :

> **« C'est simple à regarder, mais extrêmement travaillé. »**

Le visiteur ne doit pas voir la complexité technique.

Il doit simplement ressentir :

- cohérence ;
- fluidité ;
- personnalité ;
- précision ;
- confiance.

---

# 51. PRIORITÉS DE CONSTRUCTION

Construire dans cet ordre :

## PHASE 1 — FOUNDATION

- Next.js ;
- TypeScript ;
- Tailwind ;
- fonts ;
- tokens ;
- responsive ;
- navigation.

## PHASE 2 — HERO

- layout ;
- photo ;
- typography ;
- CTA ;
- motion.

## PHASE 3 — PROJECTS

- data model ;
- cards ;
- project details ;
- responsive.

## PHASE 4 — JOURNEY

Priorité élevée.

- SVG path ;
- responsive geometry ;
- scroll progress ;
- moving indicator ;
- milestones ;
- transitions ;
- carousel integration.

## PHASE 5 — LAB

- experiments ;
- current building.

## PHASE 6 — ABOUT

Storytelling.

## PHASE 7 — CONTACT

Formulaire + backend.

## PHASE 8 — POLISH

- performance ;
- accessibility ;
- SEO ;
- motion ;
- responsive ;
- testing.

---

# 52. CRITÈRES DE RÉUSSITE

Le projet est réussi si un visiteur peut répondre rapidement à :

### Qui est Hilarus ?

Un créateur numérique à l'intersection du design, du software et de l'IA.

### Que construit-il ?

Des expériences, applications et expérimentations numériques.

### Quel est son parcours ?

Une progression visible à travers la roadmap.

### Qu'a-t-il réalisé ?

Des projets présentés avec contexte.

### Où va-t-il ?

Vers de nouvelles expérimentations et constructions.

### Comment le contacter ?

CTA et formulaire immédiatement accessibles.

---

# 53. SIGNATURE VISUELLE

Les éléments signature de la V1 sont :

```text
1. DARK EDITORIAL UI
2. ACID GREEN
3. PHOTO HUMAINE
4. LARGE TYPOGRAPHY
5. SVG JOURNEY
6. SCROLL-DRIVEN STORYTELLING
7. PROJECT CASE STUDIES
8. DIGITAL LAB
9. MINIMAL FOOTER
```

La roadmap est le composant visuel le plus distinctif.

---

# 54. RÈGLE FINALE

Ne pas construire un portfolio « impressionnant » uniquement parce qu'il est techniquement complexe.

Construire un portfolio :

**cohérent, rapide, personnel, crédible et mémorable.**

Le design doit servir l'histoire.

L'animation doit servir la narration.

La technologie doit servir l'expérience.

Le contenu doit rester authentique.

---

# 55. CHECKLIST FINALE

Avant livraison :

```text
[ ] Design system respecté
[ ] Couleurs respectées
[ ] Typographies respectées
[ ] Icônes Lucide uniquement
[ ] Photo intégrée proprement
[ ] Hero terminé
[ ] Projects terminés
[ ] Expertise terminée
[ ] Roadmap SVG responsive
[ ] Scroll progress fonctionnel
[ ] Milestones fonctionnels
[ ] Carousel lié aux milestones
[ ] Mobile fonctionnel
[ ] Reduced motion fonctionnel
[ ] Contact fonctionnel
[ ] SEO configuré
[ ] Images optimisées
[ ] Pas de layout shift critique
[ ] Pas de console errors
[ ] Pas de fausses données
[ ] Tests desktop
[ ] Tests mobile
[ ] Régression vérifiée
```

---

## FIN DU DOCUMENT

**Source de vérité : Hilarus Portfolio V1**

Toute évolution importante du projet doit préserver les principes de ce document, sauf décision explicite de changement de version du design system ou de l'architecture.
