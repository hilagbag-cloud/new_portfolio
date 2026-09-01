/**
 * Utilities for robust Firestore reads and writes
 * - Deeply cleans and prunes empty strings (""), undefined, and null fields
 *   so that empty fields are stripped before being sent to Firestore.
 * - Local caching fallback so users never lose entered data on error.
 */

export interface SanitizeOptions {
  removeEmptyStrings?: boolean;
  removeEmptyArrays?: boolean;
  removeEmptyObjects?: boolean;
}

export function sanitizeForFirestore<T>(
  data: T,
  options: SanitizeOptions = {
    removeEmptyStrings: true,
    removeEmptyArrays: false,
    removeEmptyObjects: true,
  }
): T {
  if (data === undefined || data === null) {
    return undefined as unknown as T;
  }

  if (typeof data === "string") {
    if (options.removeEmptyStrings && data.trim() === "") {
      return undefined as unknown as T;
    }
    return data.trim() as unknown as T;
  }

  if (typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    const cleanedArray = data
      .map((item) => sanitizeForFirestore(item, options))
      .filter((item) => item !== undefined && item !== null && item !== "");

    if (options.removeEmptyArrays && cleanedArray.length === 0) {
      return undefined as unknown as T;
    }
    return cleanedArray as unknown as T;
  }

  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const sanitizedVal = sanitizeForFirestore(value, options);
    if (sanitizedVal !== undefined) {
      clean[key] = sanitizedVal;
    }
  }

  if (options.removeEmptyObjects && Object.keys(clean).length === 0) {
    return undefined as unknown as T;
  }

  return clean as T;
}

export function saveLocalDraft<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `cms_draft_${key}`,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.warn("Could not save local draft to localStorage:", e);
  }
}

export function loadLocalDraft<T>(
  key: string
): { data: T; timestamp: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`cms_draft_${key}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearLocalDraft(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`cms_draft_${key}`);
  } catch {
    // ignore
  }
}

export interface DetailedFirestoreErrorInfo {
  code: string;
  title: string;
  explanation: string;
  solutions: string[];
  technicalMessage: string;
  payloadSizeFormatted: string;
  payloadSizeBytes: number;
  isPayloadTooLarge: boolean;
  targetPath?: string;
  timestamp: string;
}

export function calculatePayloadSizeBytes(payload: unknown): number {
  try {
    const jsonStr = JSON.stringify(payload);
    if (!jsonStr) return 0;
    // Calculate UTF-8 byte length
    return new TextEncoder().encode(jsonStr).length;
  } catch {
    return 0;
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Ko";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

export function parseFirestoreError(
  err: unknown,
  context?: {
    collection?: string;
    docId?: string;
    payload?: unknown;
  }
): DetailedFirestoreErrorInfo {
  const errorObj = (err && typeof err === "object" ? err : {}) as {
    code?: string;
    message?: string;
    name?: string;
    stack?: string;
  };

  const rawCode = errorObj.code || "unknown-error";
  const rawMessage = errorObj.message || (typeof err === "string" ? err : "Erreur inconnue");
  const payloadBytes = context?.payload ? calculatePayloadSizeBytes(context.payload) : 0;
  const isTooLarge = payloadBytes > 1024 * 1024; // 1 MB Firestore limit

  let title = "Erreur lors de la communication avec Firestore";
  let explanation =
    "Une erreur est survenue lors de l'enregistrement de vos données sur votre base Firebase.";
  const solutions: string[] = [
    "Vos modifications sont sauvegardées dans la mémoire locale de votre navigateur (0 perte).",
  ];

  if (isTooLarge || rawMessage.includes("exceeds maximum size") || rawCode === "resource-exhausted") {
    title = "Taille du document supérieure à la limite Firestore (1 Mo)";
    explanation = `Le document que vous tentez d'enregistrer pèse ${formatBytes(
      payloadBytes
    )}, ce qui dépasse la limite maximale autorisée par Firestore (1,048,576 octets). Cela est souvent dû à une photo en très haute résolution intégrée en base64.`;
    solutions.push(
      "Recompressez ou recadrez la photo via l'outil d'optimisation intégré.",
      "Utilisez une URL externe (ex: Unsplash ou CDN) au lieu d'une image brute volumineuse.",
      "Vérifiez que vous n'avez pas accumulé trop de photos non compressées dans le même document."
    );
  } else if (rawCode === "permission-denied" || rawMessage.includes("insufficient permissions")) {
    title = "Permission Firestore Refusée (Droits d'administration requis)";
    explanation =
      "Firestore a rejeté l'écriture car votre session administrateur est absente ou a expiré, ou les règles de sécurité Firestore requièrent une reconnexion.";
    solutions.push(
      "Déconnectez-vous et reconnectez-vous avec votre adresse Google autorisée (ex: hilaruskazak@gmail.com).",
      "Vérifiez que votre connexion Internet est active.",
      "Les modifications en cours sont conservées localement et peuvent être renvoyées après reconnexion."
    );
  } else if (rawCode === "unavailable" || rawMessage.includes("client is offline") || rawMessage.includes("network")) {
    title = "Serveur Firestore Inaccessible (Réseau déconnecté)";
    explanation =
      "Le client Firestore n'a pas pu contacter les serveurs Google Firebase. Vos données restent disponibles en local.";
    solutions.push(
      "Vérifiez votre connexion Internet.",
      "Patientez quelques instants avant de cliquer à nouveau sur Valider l'écriture."
    );
  } else if (rawCode === "invalid-argument") {
    title = "Argument ou Format de Donnée Invalide";
    explanation =
      "Un champ contient une valeur non acceptée par Firestore (clé vide, type non supporté ou structure imbriquée corrompue).";
    solutions.push(
      "Le nettoyeur de champs a automatiquement purgé les entrées vides.",
      "Vérifiez les formats d'URL (http/https) et les adresses emails renseignées."
    );
  } else if (rawCode === "unauthenticated") {
    title = "Session Utilisateur Expirée";
    explanation = "Votre jeton d'authentification n'est plus valide.";
    solutions.push("Veuillez vous reconnecter à l'espace d'administration.");
  }

  const targetPath = context?.collection
    ? `${context.collection}${context.docId ? `/${context.docId}` : ""}`
    : undefined;

  return {
    code: rawCode,
    title,
    explanation,
    solutions,
    technicalMessage: rawMessage,
    payloadSizeFormatted: formatBytes(payloadBytes),
    payloadSizeBytes: payloadBytes,
    isPayloadTooLarge: isTooLarge,
    targetPath,
    timestamp: new Date().toLocaleTimeString("fr-FR"),
  };
}

export function getFirestoreErrorMessage(err: unknown): string {
  if (!err) return "Erreur inconnue";
  if (typeof err === "string") return err;
  const errorObj = err as { code?: string; message?: string };
  if (errorObj.code === "permission-denied") {
    return "Permission refusée (Session expirée ou règles Firestore). Vos modifications restent sécurisées dans votre navigateur.";
  }
  if (errorObj.code === "unavailable") {
    return "Connexion réseau impossible vers Firebase. Vos modifications sont sauvegardées localement.";
  }
  if (errorObj.message) {
    return errorObj.message;
  }
  return String(err);
}
