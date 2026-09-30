export interface GenerateResourceParams {
  filename?: string;
  fileType?: string;
  textContent?: string;
  existingTitle?: string;
  existingNotes?: string;
}

export interface GeneratedResourceData {
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

export interface GeneratedResourceResponse {
  success: boolean;
  source: "gemini" | "heuristic" | "cache";
  quotaExceeded: boolean;
  message: string;
  data: GeneratedResourceData;
}

/**
 * Calls the server-side Gemini API route to analyze file content and generate resource details.
 * Handles rate limits, quota exhaustion (HTTP 429), and transparently provides fallback data.
 */
export async function generateResourceDetailsWithAI(
  params: GenerateResourceParams
): Promise<GeneratedResourceResponse> {
  try {
    const res = await fetch("/api/gemini/generate-resource", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: params.filename || "",
        fileType: params.fileType || "",
        textContent: params.textContent || "",
        existingTitle: params.existingTitle || "",
        existingNotes: params.existingNotes || "",
      }),
    });

    if (!res.ok) {
      // If server returned 429 or other non-OK status, inspect JSON if possible
      try {
        const errorJson = await res.json();
        if (errorJson.data) {
          return errorJson;
        }
      } catch (_) {}

      throw new Error(`Erreur serveur (${res.status})`);
    }

    const json = (await res.json()) as GeneratedResourceResponse;
    return json;
  } catch (err: any) {
    console.warn("AI generation client notice:", err);
    // Client-side emergency heuristic fallback so the UI never breaks
    const fallbackTitle = (params.filename || params.existingTitle || "Ressource Numérique")
      .replace(/\.[a-zA-Z0-9]+$/, "")
      .replace(/[_-]+/g, " ")
      .trim();

    return {
      success: true,
      source: "heuristic",
      quotaExceeded: true,
      message: "Analyse heuristique locale appliquée (réseau indisponible ou quota API atteint).",
      data: {
        title: fallbackTitle.charAt(0).toUpperCase() + fallbackTitle.slice(1),
        subtitle: `Guide et document pratique : ${fallbackTitle}`,
        miniDescription:
          params.textContent?.slice(0, 180) ||
          "Support d'apprentissage complet structuré pour l'étude et le téléchargement libre.",
        category: "Programmation & Algorithmes",
        type: params.filename?.endsWith(".pdf") ? "pdf" : "file",
        badge: params.filename?.endsWith(".pdf") ? "PDF · COURS" : "CODE · PROJET",
        readTime: "15 min d'étude",
        coverColor: "#0f2b48",
        objectives: [
          `Assimiler les principes fondamentaux de ${fallbackTitle}`,
          "Mettre en pratique les méthodologies recommandées",
          "Consulter et exploiter le support lors de vos travaux",
        ],
        detailedSummary: "Synthèse technique complète prête pour consultation.",
      },
    };
  }
}
