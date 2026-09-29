# Réajustement des Contrastes, Redirection Formulaire & Refonte Complète du SEO

Ce plan détaille la mise en œuvre de trois optimisations majeures pour le portfolio et la plateforme d'apprentissage d'Hilarus Gbagoule : une balance des couleurs garantissant une lisibilité optimale (texte noir intense et gras sur tous les fonds et boutons verts), une redirection automatique après 3 secondes avec bouton d'accès direct vers `/learning` à la soumission du formulaire `/form`, et une refonte complète du référencement naturel (SEO) avec détection dynamique du domaine de déploiement, sitemap temps-réel, robots.txt et données structurées Schema.org.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Les trois décisions clés clarifiées lors de la phase de cadrage ont été intégrées comme spécifications strictes :

- **Décision 1 (Lisibilité & Contraste Vert / Noir)** : Application systématique d'un noir intense (`#000000` / `text-black`) associé à une graisse typographique forte (`font-bold` / `font-extrabold`) sur l'ensemble des boutons, pastilles, badges et surfaces d'accentuation vertes (`bg-accent`, `bg-emerald-*`, `.btn-skew`, `.btn-learn-more`). Suppression des textes blancs à faible contraste sur ces éléments.
- **Décision 2 (Flux de Redirection /form)** : À la validation du questionnaire `/form`, déclenchement d'un compte à rebours visuel de 3 secondes avec barre de progression animée, accompagné d'un bouton d'accès immédiat *"Accéder maintenant à l'Espace Apprentissage"*, assurant une transition fluide vers `/learning`.
- **Décision 3 (SEO & Détection de Domaine)** : Remplacement de l'URL codée en dur (`hilarus.dev`) par un mécanisme de détection automatique du domaine réel d'exécution (via les en-têtes HTTP de requête `x-forwarded-host` / `host`, les variables de déploiement Cloud Run / Vercel et la configuration Firestore). Génération dynamique des URLs canoniques, du sitemap XML, du robots.txt et du graphe de connaissances Schema.org.

---

## 1. Overview & Core Concept

- **What It Does** : 
  1. Rend instantanément lisibles tous les éléments interactifs et informatifs verts du site grâce à un contraste textuel noir pur maximal conforme aux standards WCAG AAA.
  2. Fluidifie le parcours utilisateur entre le questionnaire chercheur (`/form`) et le catalogue de ressources (`/learning`) grâce à une redirection temporisée et interactive.
  3. Restaure et maximise la découvrabilité du site sur Google, Bing et les moteurs de recherche IA (Perplexity, ChatGPT, Claude) en synchronisant automatiquement les métadonnées avec le domaine réel déployé.
- **Target Audience / Persona** : Visiteurs professionnels, recruteurs, chercheurs, étudiants et robots d'indexation parcourant le portfolio et les ressources libres d'Hilarus Gbagoule.
- **Key Value** : Élimination des pertes de trafic dues à un mauvais paramétrage canonique, confort de lecture irréprochable et continuité d'expérience utilisateur entre le formulaire et les cours.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Expérience Visuelle & Contraste (Global)** :
   - Au survol ou à l'état actif des boutons verts (`.btn-skew`, `.btn-learn-more`, filtres de cours, boutons d'action du formulaire et du catalogue), le libellé s'affiche en noir intense (`#000000`) avec une graisse `font-bold` (700/800).
   - Les badges de statut, compteurs et pastilles vertes bénéficient d'un contraste irréprochable sur fond clair comme sur fond sombre.
2. **Parcours Formulaire → Espace Apprentissage (`/form`)** :
   - L'utilisateur remplit les 3 questions à échelle d'appréciation et clique sur *"Valider & Partager mon avis"*.
   - Dès la validation Firestore réussie, l'écran de confirmation s'affiche avec :
     - Une bannière de confirmation et un badge *"Réponse Enregistrée"*.
     - Un compte à rebours dynamique circulaire / linéaire : *"Redirection automatique vers l'espace Apprentissage dans 3s..."*.
     - Un bouton CTA vert proéminent avec texte noir en gras : *"Accéder immédiatement aux Ressources (DAY06...)"*.
     - Un lien alternatif discret pour annuler la redirection ou soumettre une autre réponse.
   - À l'expiration des 3 secondes, transition fluide vers `/learning`.

### Visual Identity & Theme Tokens

- **Tokens CSS (`src/app/globals.css`)** :
  - `--color-accent` : `#a8f35a` (vert lime vibrant signature).
  - `--color-accent-contrast` : Fixé rigoureusement à `#000000` (noir pur).
  - Surcharges spécifiques pour `.btn-skew:hover`, `.btn-learn-more:hover`, et les composants avec fond vert afin de forcer `color: #000000 !important; font-weight: 700;`.
- **Typographie** :
  - Titres et call-to-action : `font-display` (Suez One) & `font-mono` (IBM Plex Mono).
  - Corps de texte : `font-body` (Inter).

---

## 3. Key Product Decisions & Trade-Offs

- **Détection Automatique du Domaine de Déploiement** :
  - *Approche choisie* : Création d'un module centralisé `resolveDeploymentUrl()` interrogeant dynamiquement dans l'ordre :
    1. Configuration Firestore `siteConfig/global` (si l'administrateur a défini une URL personnalisée explicite).
    2. En-têtes HTTP de la requête entrante (`x-forwarded-host`, `host`, `x-forwarded-proto`).
    3. Variables d'environnement (`NEXT_PUBLIC_SITE_URL`, `APP_URL`, `VERCEL_URL`).
  - *Bénéfice* : Fonctionne immédiatement quel que soit l'environnement (domaine Cloud Run `ais-*.run.app`, domaine personnalisé final, ou aperçu de test) sans risque de pointer vers un domaine externe non configuré.
- **Temporisation de Redirection à 3 Secondes** :
  - *Approche choisie* : Compte à rebours géré via `useEffect` et `setInterval` avec barre de progression animée et bouton d'action immédiate.
  - *Bénéfice* : Laisse le temps à l'utilisateur de lire le message de remerciement tout en éliminant toute friction ou attente inutile grâce au bouton direct.
- **Indexation SEO & Données Structurées Complètes** :
  - *Approche choisie* : Mise à jour du sitemap (`/sitemap.xml`) incluant `/`, `/learning`, `/form`, `/projects/*`, `/journey/*`, ajustement de `robots.txt` autorisant tous les moteurs majeurs et robots IA, et enrichissement de Schema.org (`Person`, `WebSite`, `EducationalOrganization`, `LearningResource`).

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        REQUEST & DOMAIN LAYER                          │
│                                                                        │
│   Incoming Request ──► [x-forwarded-host / host headers]               │
│                                │                                       │
│                                ▼                                       │
│                    resolveDeploymentUrl()                              │
│                                │                                       │
│        ┌───────────────────────┼────────────────────────┐              │
│        ▼                       ▼                        ▼              │
│   layout.tsx              sitemap.ts               robots.ts           │
│   (Canonical + Meta)      (Dynamic XML Index)      (Crawler Rules)     │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
┌────────────────────────────────┼───────────────────────────────────────┐
│                        USER INTERFACE & CONTRAST                       │
│                                │                                       │
│   ┌────────────────────────────┴───────────────────────────┐           │
│   │                                                        │           │
│   ▼                                                        ▼           │
│ /form (FormPage)                                    /learning          │
│ • Submit to Firestore                              • Active filters    │
│ • 3s Countdown Hook                                • Resource cards    │
│ • Direct Access Button                             • Quick download    │
│   [bg-accent text-black font-bold]                 [bg-accent text-    │
│                                                     black font-bold]   │
└────────────────────────────────────────────────────────────────────────┘
```

### Component & State Mapping

1. **`src/app/globals.css` & Thèmes** :
   - Mise à jour de `--color-accent-contrast: #000000;`.
   - Ajustement des règles CSS pour `.btn-skew`, `.btn-learn-more`, `.interactive-pill`.
2. **`src/app/form/page.tsx`** :
   - État `redirectCountdown` (initialisé à 3).
   - Hook de compte à rebours avec nettoyage automatique (`clearInterval`).
   - Rendu de l'animation de décompte et du bouton de navigation directe avec `text-black font-bold`.
3. **`src/app/learning/page.tsx` & Composants Learning** :
   - Harmonisation des boutons "Consulter", filtres de catégories et bannières avec `text-black font-bold`.
4. **`src/lib/cms-meta.ts`, `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`** :
   - Implémentation de la détection de domaine sans dépendance statique.
   - Ajout de métadonnées enrichies pour la section Apprentissage Boosté.

---

## Plan d'Exécution & Vérification

1. Validation et application des styles de contraste vert/noir sur les boutons et composants globaux.
2. Implémentation du système de compte à rebours et redirection dans `/form`.
3. Implémentation du résolveur dynamique de domaine et mise à jour de la configuration SEO (sitemap, robots, layout, Schema.org).
4. Validation via compilation Next.js (`compile_applet`) et audit syntaxique (`lint_applet`).
