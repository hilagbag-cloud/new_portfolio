import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// In-memory cache for recent generation requests to conserve API quota
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// Preset color palette consistent with Hilarus branding
const PALETTE = [
  "#0f2b48", // Bleu Océan
  "#0e4a68", // Cyan Cobalt
  "#064e3b", // Émeraude Sombre
  "#3b0764", // Pourpre Impérial
  "#4c0519", // Bordeaux Cuir
  "#1e293b", // Ardoise Anthracite
  "#451a03", // Ambre Foncé
];

interface GenerationResult {
  title: string;
  subtitle: string;
  miniDescription: string;
  category: string;
  type: "pdf" | "book" | "file" | "text" | "image";
  badge: string;
  readTime: string;
  coverColor: string;
  objectives: string[];
  detailedSummary: string;
}

/**
 * Intelligent Heuristic Fallback Engine
 * Used when Gemini API quota is reached, rate-limited, or unavailable.
 * Ensures the user is NEVER blocked and gets a high-quality resource configuration.
 */
function analyzeHeuristically(
  filename: string,
  content: string = "",
  fileType: string = ""
): GenerationResult {
  const cleanBase = (filename || "Ressource sans titre")
    .replace(/\.[a-zA-Z0-9]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const lowerContent = (cleanBase + " " + content.slice(0, 3000)).toLowerCase();

  // Detect domain & category
  let category = "Programmation & Algorithmes";
  let coverColor = "#0f2b48";
  let detectedType: "pdf" | "book" | "file" | "text" | "image" = "pdf";
  let badge = "PDF · COURS";

  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext) || fileType.includes("image")) {
    detectedType = "image";
    badge = "SCHÉMA · INFOGRAPHIE";
    coverColor = "#0e4a68";
  } else if (["epub", "mobi"].includes(ext)) {
    detectedType = "book";
    badge = "LIVRE · OUVRAGE";
    coverColor = "#3b0764";
  } else if (["c", "h", "cpp", "py", "js", "ts", "rs", "go", "sh", "json"].includes(ext)) {
    detectedType = "file";
    badge = `${ext.toUpperCase()} · CODE & PROJET`;
    coverColor = "#064e3b";
  } else if (["txt", "md"].includes(ext)) {
    detectedType = "text";
    badge = "GUIDE · DOCUMENT";
    coverColor = "#1e293b";
  }

  // Domain categorization
  if (
    lowerContent.includes("ia") ||
    lowerContent.includes("intelligence artificielle") ||
    lowerContent.includes("machine learning") ||
    lowerContent.includes("deep learning") ||
    lowerContent.includes("llm") ||
    lowerContent.includes("rag") ||
    lowerContent.includes("gemini") ||
    lowerContent.includes("data")
  ) {
    category = "Intelligence Artificielle & Data";
    coverColor = "#0e4a68";
    badge = detectedType === "pdf" ? "IA · DATA & SYNTHÈSE" : badge;
  } else if (
    lowerContent.includes("docker") ||
    lowerContent.includes("kubernetes") ||
    lowerContent.includes("architecture") ||
    lowerContent.includes("microservice") ||
    lowerContent.includes("système") ||
    lowerContent.includes("linux") ||
    lowerContent.includes("réseau") ||
    lowerContent.includes("api rest")
  ) {
    category = "Architecture Logicielle & Systèmes";
    coverColor = "#1e293b";
    badge = detectedType === "pdf" ? "SYSTÈMES & ARCHITECTURE" : badge;
  } else if (
    lowerContent.includes("design") ||
    lowerContent.includes("ui") ||
    lowerContent.includes("ux") ||
    lowerContent.includes("figma") ||
    lowerContent.includes("ergonomie") ||
    lowerContent.includes("css") ||
    lowerContent.includes("tailwind")
  ) {
    category = "Design & Expérience Utilisateur";
    coverColor = "#4c0519";
    badge = "DESIGN & INTERFACES";
  } else if (
    lowerContent.includes("c") ||
    lowerContent.includes("pointeur") ||
    lowerContent.includes("mémoire") ||
    lowerContent.includes("algorithme") ||
    lowerContent.includes("structure de données") ||
    lowerContent.includes("python") ||
    lowerContent.includes("javascript") ||
    lowerContent.includes("typescript")
  ) {
    category = "Programmation & Algorithmes";
    coverColor = "#064e3b";
    badge = detectedType === "pdf" ? "ALGORITHMES & CODE" : badge;
  }

  // Format title nicely
  const title =
    cleanBase.length > 5
      ? cleanBase
          .split(" ")
          .map((w) => (w.length > 2 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
          .join(" ")
      : "Support Technique & Guide Pratique";

  // Calculate estimated read time based on content length or default
  const wordCount = content ? content.trim().split(/\s+/).length : 500;
  const minutes = Math.max(5, Math.min(60, Math.ceil(wordCount / 180)));
  const readTime = `${minutes} min d'étude`;

  // Extract or generate objectives
  const objectives: string[] = [
    `Comprendre les concepts fondamentaux de « ${title} » et leur mise en application`,
    "Analyser les structures méthodologiques et les cas d'usage concrets",
    "Télécharger, annoter et exploiter le support pour vos projets ou recherches",
    "Consolider vos compétences techniques grâce à des synthèses claires",
  ];

  const subtitle = `Guide complet et ressource libre : ${title}`;
  const miniDescription = content.trim().length > 80
    ? content.trim().slice(0, 200).replace(/\s+/g, " ") + "..."
    : `Support pédagogique exhaustif structuré pour approfondir ${category.toLowerCase()}. Téléchargement libre et consultation interactive.`;

  return {
    title,
    subtitle,
    miniDescription,
    category,
    type: detectedType,
    badge,
    readTime,
    coverColor,
    objectives,
    detailedSummary: `Ce document offre une synthèse méthodique articulée autour de ${title}. Il aborde les fondations théoriques, les patterns d'implémentation et les bonnes pratiques indispensables.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      filename = "",
      fileType = "",
      textContent = "",
      existingTitle = "",
      existingNotes = "",
      fileBase64 = "", // Optional small base64 preview
    } = body;

    // Cache key to save API quota on repeated calls
    const cacheKey = `${filename}_${existingTitle}_${(textContent || "").slice(0, 300)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        source: "cache",
        quotaExceeded: false,
        message: "Détails récupérés instantanément depuis le cache.",
        data: cached.data,
      });
    }

    // Check Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback to heuristic engine if no key is configured
      const fallback = analyzeHeuristically(filename || existingTitle, textContent, fileType);
      return NextResponse.json({
        success: true,
        source: "heuristic",
        quotaExceeded: false,
        message: "Analyse heuristique locale appliquée (clé API en attente de configuration).",
        data: fallback,
      });
    }

    // Token budget optimization:
    // Limit text input window to head + tail sample (maximum 6000 chars)
    // This prevents large 50MB files from wasting quota tokens.
    let contentSample = "";
    if (textContent) {
      if (textContent.length <= 6000) {
        contentSample = textContent;
      } else {
        const head = textContent.slice(0, 4000);
        const tail = textContent.slice(-2000);
        contentSample = `${head}\n\n[... CONTENU TRONQUÉ POUR PRÉSERVER LE QUOTA API ...]\n\n${tail}`;
      }
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `Tu es l'analyste éditorial expert de la plateforme « Apprentissage Boosté by Hilarus » (plateforme open source d'apprentissage créée par Hilarus Gbagoule, digital builder).
Ton rôle est d'analyser le document ou fichier soumis et de générer une fiche descriptive complète, claire, élégante et percutante en français.

Directives de sélection :
1. Catégorie : choisir EXACTEMENT l'une des 6 suivantes :
   - "Programmation & Algorithmes"
   - "Intelligence Artificielle & Data"
   - "Architecture Logicielle & Systèmes"
   - "Design & Expérience Utilisateur"
   - "Ouvrages & Guides Numériques"
   - "Recherche & Méthodologie"

2. Format / Type : choisir parmi "pdf", "book", "file", "text", "image".

3. Badge court en majuscules (ex: "PDF · COURS", "GUIDE · ESSENTIEL", "CODE & PROJET", "IA · SYNTHÈSE", "LIVRE · OUVRAGE").

4. Temps de lecture / étude estimé (ex: "15 min de lecture", "30 min d'étude", "45 min d'immersion").

5. Couleur de couverture parmi la palette Hilarus :
   - "#0f2b48" (Bleu Océan)
   - "#0e4a68" (Cyan Cobalt)
   - "#064e3b" (Émeraude Sombre)
   - "#3b0764" (Pourpre Impérial)
   - "#4c0519" (Bordeaux Cuir)
   - "#1e293b" (Ardoise Anthracite)
   - "#451a03" (Ambre Foncé)

6. Objectifs : 3 à 5 puces concrètes débutant par des verbes d'action.
7. MiniDescription : résumé percutant de 2 à 3 phrases.
8. Titre : Titre soigné, captivant et pédagogique (sans fioritures inutiles).`;

    const userPrompt = `Analyse les métadonnées et le contenu de ce fichier pour renseigner la fiche ressource :
- Nom du fichier : "${filename}"
- Type MIME / extension : "${fileType}"
- Titre ou note préalable : "${existingTitle || existingNotes || "Non renseigné"}"
- Extrait du contenu :
"""
${contentSample || "(Aucun texte brut direct fourni, base-toi sur le nom de fichier, extension et notes)"}
"""`;

    // Attempt Gemini call with gemini-3.8-flash (fast, economical, free-tier friendly)
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              miniDescription: { type: Type.STRING },
              category: { type: Type.STRING },
              type: { type: Type.STRING },
              badge: { type: Type.STRING },
              readTime: { type: Type.STRING },
              coverColor: { type: Type.STRING },
              objectives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              detailedSummary: { type: Type.STRING },
            },
            required: [
              "title",
              "subtitle",
              "miniDescription",
              "category",
              "type",
              "badge",
              "readTime",
              "coverColor",
              "objectives",
            ],
          },
        },
      });

      const responseText = response.text?.trim() || "";
      const parsedData = JSON.parse(responseText) as GenerationResult;

      // Ensure valid color from palette
      if (!PALETTE.includes(parsedData.coverColor)) {
        parsedData.coverColor = "#0f2b48";
      }

      // Store in memory cache to save future quota
      cache.set(cacheKey, { data: parsedData, timestamp: Date.now() });

      return NextResponse.json({
        success: true,
        source: "gemini",
        quotaExceeded: false,
        message: "Détails générés avec succès par Gemini 3.8 Flash.",
        data: parsedData,
      });
    } catch (apiError: any) {
      // Analyze if quota limit was reached (429, RESOURCE_EXHAUSTED, rateLimitExceeded)
      const errorMsg = String(apiError?.message || "");
      const isQuotaLimit =
        apiError?.status === 429 ||
        errorMsg.includes("429") ||
        errorMsg.includes("RESOURCE_EXHAUSTED") ||
        errorMsg.includes("quota") ||
        errorMsg.includes("Quota") ||
        errorMsg.includes("rate limit") ||
        errorMsg.includes("Rate limit");

      console.warn("Gemini API call caught notice:", {
        isQuotaLimit,
        message: errorMsg,
        status: apiError?.status,
      });

      // Graceful fallback to heuristic engine to never block the user
      const fallback = analyzeHeuristically(filename || existingTitle, textContent, fileType);

      // Save in cache so repeated attempts do not hammer the exhausted quota
      cache.set(cacheKey, { data: fallback, timestamp: Date.now() });

      return NextResponse.json({
        success: true,
        source: "heuristic",
        quotaExceeded: isQuotaLimit,
        message: isQuotaLimit
          ? "Limite de quota API Gemini atteinte : les détails ont été générés intelligemment par l'analyseur heuristique local afin de ne pas bloquer votre publication."
          : "Analyse heuristique locale appliquée avec succès.",
        data: fallback,
      });
    }
  } catch (globalError: any) {
    console.error("Global generation error:", globalError);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur interne lors du traitement de la requête.",
      },
      { status: 500 }
    );
  }
}
