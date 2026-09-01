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
