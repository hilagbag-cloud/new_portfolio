# Programme Apprentissage Boosté by Hilarus — Page /form & Dashboard Analytique

Création d'une page publique dédiée `/form` pour recueillir l'avis des chercheurs sur le programme d'apprentissage via une échelle d'appréciation anonyme, sans collecte de données personnelles, et intégration d'un onglet analytique complet dans le tableau de bord administrateur avec calcul des pourcentages et tableau des soumissions.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Choix confirmés lors de la phase de clarification :**
> - **Format des réponses** : Échelle d'appréciation en 5 points (*Pas du tout*, *Plutôt non*, *Neutre / Moyennement*, *Plutôt oui*, *Tout à fait*) pour chaque question.
> - **Expérience post-soumission** : Écran de remerciement chaleureux avec confirmation d'anonymat et bouton de redirection vers la page d'accueil.
> - **Affichage dashboard** : Onglet dédié "Programme Boosté" intégrant à la fois des indicateurs de synthèse avec barres de pourcentage par modalité et un tableau chronologique des réponses anonymes.

---

## 1. Overview & Core Concept

- **Expérience Visiteur (`/form`)** : Une interface soignée, épurée et rassurante adaptée aux chercheurs et apprenants ayant déjà bénéficié d'une ressource offerte par Hilarus. Le visiteur répond à 3 questions d'évaluation sans jamais avoir à renseigner son identité, son email ou des coordonnées personnelles.
- **Message Clé & Éthique** : Affichage transparent du message d'avertissement et de bienveillance (*"Ce programme ne signifie pas que je suis professionnel. Il s'agit d'une de mes manières d'apprendre que j'ai décidé de partager avec vous gratuitement."*).
- **Espace Administrateur (`/admin`)** : Nouvel onglet dédié permettant à Hilarus de suivre en temps réel la distribution des avis, les taux d'intérêt, les habitudes de lecture en ligne et la disposition des chercheurs à continuer l'apprentissage.

---

## 2. User Experience & Visual Design

### Parcours Visiteur (`/form`)

1. **En-tête & Accueil** :
   - Badge discret d'orientation : *Programme Chercheurs & Apprenants*.
   - Grand titre : *Bienvenue au programme Apprentissage Boosté by Hilarus*.
   - Sous-titre explicatif : *Un programme d'apprentissage amélioré et personnalisé destiné aux chercheurs.*
   - Message de bienvenue contextuel : *Si vous êtes ici, c'est que vous avez déjà profité d'une ressource gratuite !*
2. **Bloc de Transparence & Démarche** :
   - Encadré sobre mettant en valeur la note d'intention : *"Ce programme ne signifie pas que je suis professionnel. Il s'agit d'une de mes manières d'apprendre que j'ai décidé de partager avec vous gratuitement."*
3. **Formulaire Interactif (3 Questions à Choix Multiple)** :
   - *Question 1* : Êtes-vous intéressé par ce programme ?
   - *Question 2* : Lisez-vous souvent des documents en ligne ?
   - *Question 3* : Êtes-vous prêt à continuer l'apprentissage ?
   - Chaque question propose 5 options disposées en boutons d'échelle ergonomiques (de 1 = *Pas du tout* à 5 = *Tout à fait*) avec retour tactile et visuel immédiat.
   - Barre de progression visuelle discrète en fonction des réponses complétées (0/3 → 3/3).
4. **Validation & Confidentialité** :
   - Mention de sécurité explicite : *Réponse 100% anonyme • Aucune donnée personnelle, email ou identifiant collecté*.
   - Bouton de validation dynamique activé lorsque les 3 questions sont renseignées.
5. **Écran de Remerciement (Succès)** :
   - Animation de confirmation élégante avec icône de réussite.
   - Message chaleureux remerciant le chercheur pour sa contribution.
   - Bouton principal : *Retour à l'accueil du Portfolio*.

### Parcours Dashboard Admin (`/admin`)

1. **Onglet Dédié "Programme Boosté"** :
   - Ajout d'une nouvelle entrée dans la barre d'onglets du dashboard (`SurveyResponsesManager`).
2. **Indicateurs Clés & Statistiques Visuelles** :
   - Nombre total de retours reçus.
   - Score moyen d'intérêt pour le programme.
   - Habitude de lecture en ligne dominante.
   - Disposition à continuer l'apprentissage.
   - Barres de distribution en pourcentage pour chaque échelon (1 à 5) sur les 3 questions.
3. **Tableau Chronologique Anonyme** :
   - Liste des participations avec date/heure, détail des 3 réponses et badge d'échelle.
   - Possibilité de filtrer par date ou par niveau d'intérêt.
   - Action de suppression d'une réponse de test pour l'administrateur en mode édition déverrouillée.
   - Bouton d'export CSV anonymisé des résultats.

---

## 3. Key Product Decisions & Trade-Offs

- **Garantie d'Anonymat Total** :
  - *Approche retenue* : Le payload envoyé à Firestore contient uniquement les identifiants de réponses (`q1_interest`, `q2_online_reading`, `q3_continue_learning`), un identifiant aléatoire de document et un horodatage (`submittedAt`). Aucune adresse IP, aucun user-agent, aucun cookie de pistage, aucun champ de contact.
  - *Bénéfice* : Respect total de la vie privée des chercheurs et conformité RGPD stricte par conception (*Privacy by Design*).
- **Stockage Firestore & Sécurité des Règles** :
  - *Approche retenue* : Utilisation d'une collection dédiée `surveyResponses` dans Firestore. La règle `allow create` vérifie strictement la forme des données (champs requis, types string/number valides, longueur limitée) sans exiger d'authentification pour permettre à tout chercheur de soumettre son retour. Les droits `read`, `update` et `delete` sont strictement réservés à l'administrateur connecté (`request.auth != null`).
  - *Mise à jour* : Ajout de la définition de l'entité dans `firebase-blueprint.json` et déploiement dans `firestore.rules`.
- **Typographie et Cohérence Graphique** :
  - Respect scrupuleux de l'identité visuelle existante du site d'Hilarus (thème sombre/clair géré par Tailwind CSS, police moderne avec typographie soignée, absence de badges pills encombrants et boutons d'action single-line).

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              VISITEURS                                 │
│                                                                        │
│   Page Publique: /form                                                 │
│   ├── Message d'accueil "Apprentissage Boosté by Hilarus"              │
│   ├── Mention ressource gratuite & Note de transparence                │
│   ├── 3 Questions à échelle (1: Pas du tout ──> 5: Tout à fait)        │
│   └── Écran de remerciement avec retour à l'accueil                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Soumission Anonyme (sans PII)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FIRESTORE DATABASE                              │
│                                                                        │
│   Collection: surveyResponses/{responseId}                             │
│   ├── q1_interest: string (valeur échelle)                             │
│   ├── q2_online_reading: string (valeur échelle)                       │
│   ├── q3_continue_learning: string (valeur échelle)                    │
│   ├── submittedAt: string (ISO date)                                   │
│   └── anonymousId: string (uuid aléatoire)                             │
│                                                                        │
│   Règles Firestore:                                                    │
│   - allow create: if validSurveyPayload()                              │
│   - allow read, delete: if request.auth != null                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Lecture Authentifiée (Admin)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      ESPACE ADMINISTRATEUR                             │
│                                                                        │
│   Page: /admin                                                         │
│   └── Onglet: "Programme Boosté (/form)"                              │
│       ├── Stat Cards: Total retours, Taux d'intérêt, etc.              │
│       ├── Breakdown analytique (% par niveau d'échelle)                │
│       ├── Tableau des réponses chronologiques                          │
│       └── Export CSV & Gestion des données                             │
└────────────────────────────────────────────────────────────────────────┘
```

### Entités et Données

- **Collection Firestore** : `surveyResponses`
- **Schéma de document** :
  ```typescript
  interface SurveyResponse {
    id: string;
    q1_interest: string; // Ex: "Tout à fait", "Plutôt oui", etc.
    q2_online_reading: string;
    q3_continue_learning: string;
    submittedAt: string; // ISO 8601
  }
  ```

---

## 5. Implementation Sequence

1. **Mise à jour du schéma et des règles de sécurité** :
   - Mise à jour de `firebase-blueprint.json` avec la nouvelle entité `surveyResponse`.
   - Mise à jour de `firestore.rules` pour autoriser la création anonyme validée et restreindre la lecture/suppression aux admins authentifiés.
2. **Création de la page `/form`** :
   - Création de `src/app/form/page.tsx` avec les textes exacts fournis par l'utilisateur, l'explication bienveillante, le sélecteur à 5 niveaux d'échelle, la progression et la confirmation finale.
3. **Création du composant de gestion dans le Dashboard** :
   - Création de `src/components/Admin/SurveyResponsesManager.tsx` pour afficher les statistiques, graphiques de répartition en pourcentage, tableau de données et export.
4. **Intégration dans le Dashboard Admin** :
   - Mise à jour de `src/app/admin/page.tsx` pour ajouter le nouvel onglet et son icône dédiée.
5. **Vérification et Compilation** :
   - Validation via `compile_applet` pour garantir zéro erreur de build TypeScript/Next.js.
