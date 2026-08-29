# Hilarus Portfolio

Portfolio personnel de Hilarus Gbagoule — Design × Software × AI.

Basé sur `HILARUS_PORTFOLIO_CLAUDE_CODE_SPEC.md` (source de vérité du projet).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (design tokens dans `src/app/globals.css` + `tailwind.config.ts`)
- Framer Motion (transitions, micro-interactions)
- Lucide Icons

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Structure

```text
src/
├── app/            # layout, page, styles globaux
├── components/      # un composant = une responsabilité
├── data/            # contenu éditorial séparé des composants
└── lib/             # utilitaires
```

## État actuel

Phase 1–4 du plan de construction : fondations, hero, projets, journey (roadmap SVG).
Contenu de type `[PLACEHOLDER]` à remplacer avant publication — voir `src/data/`.
Pas encore de CMS/DB : les données sont dans `src/data/*.ts`, prévu pour être remplacées plus tard sans changer l'architecture.
