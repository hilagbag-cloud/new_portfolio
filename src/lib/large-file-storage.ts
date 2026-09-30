import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

const CHUNK_SIZE = 450 * 1024; // 450 KB per text chunk, well within Firestore 1MB doc limit
const MAX_DIRECT_SIZE = 600 * 1024; // 600 KB can fit in main document
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB max file upload size

export interface UploadProgress {
  currentChunk: number;
  totalChunks: number;
  percentage: number;
  status: string;
}

/**
 * Splits a base64 Data URL into chunks and saves them in Firestore subcollection
 */
export async function saveLargeFileChunks(
  resourceId: string,
  dataUrl: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ chunksCount: number }> {
  const totalLength = dataUrl.length;
  const totalChunks = Math.ceil(totalLength / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, totalLength);
    const chunkData = dataUrl.substring(start, end);

    const chunkRef = doc(db, "learningResources", resourceId, "chunks", `chunk_${String(i).padStart(4, "0")}`);
    await setDoc(chunkRef, {
      index: i,
      totalChunks,
      data: chunkData,
      length: chunkData.length,
      createdAt: new Date().toISOString(),
    });

    if (onProgress) {
      onProgress({
        currentChunk: i + 1,
        totalChunks,
        percentage: Math.round(((i + 1) / totalChunks) * 100),
        status: `Enregistrement du bloc ${i + 1}/${totalChunks}...`,
      });
    }
  }

  return { chunksCount: totalChunks };
}

// Memory and IndexedDB cache for reassembled large files
const fileDataUrlCache = new Map<string, string>();

/**
 * Retrieves and reassembles all chunks for a resource from Firestore
 */
export async function fetchLargeFileChunks(
  resourceId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  // Check in-memory cache first
  if (fileDataUrlCache.has(resourceId)) {
    return fileDataUrlCache.get(resourceId)!;
  }

  const chunksRef = collection(db, "learningResources", resourceId, "chunks");
  const q = query(chunksRef, orderBy("index", "asc"));
  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error("Aucun bloc de fichier trouvé pour cette ressource");
  }

  const total = snap.docs.length;
  const parts: string[] = [];

  snap.docs.forEach((d, idx) => {
    const data = d.data();
    parts.push(data.data || "");
    if (onProgress) {
      onProgress({
        currentChunk: idx + 1,
        totalChunks: total,
        percentage: Math.round(((idx + 1) / total) * 100),
        status: `Téléchargement du bloc ${idx + 1}/${total}...`,
      });
    }
  });

  const fullDataUrl = parts.join("");
  fileDataUrlCache.set(resourceId, fullDataUrl);
  return fullDataUrl;
}

/**
 * Deletes all chunks associated with a resource
 */
export async function deleteLargeFileChunks(resourceId: string): Promise<void> {
  try {
    const chunksRef = collection(db, "learningResources", resourceId, "chunks");
    const snap = await getDocs(chunksRef);
    const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    fileDataUrlCache.delete(resourceId);
  } catch (err) {
    console.debug("Delete chunks notice:", err);
  }
}
