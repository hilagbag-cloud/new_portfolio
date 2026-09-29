import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Anonymous local visitor token for retention / loyalty calculation without collecting PII
 */
export function getOrCreateVisitorToken(): { visitorId: string; isReturning: boolean } {
  if (typeof window === "undefined") {
    return { visitorId: "server", isReturning: false };
  }

  const STORAGE_KEY = "hilarus_learning_visitor_token";
  const VISITS_COUNT_KEY = "hilarus_learning_visits_count";

  let visitorId = localStorage.getItem(STORAGE_KEY);
  let isReturning = false;

  if (!visitorId) {
    visitorId = "v_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEY, visitorId);
    localStorage.setItem(VISITS_COUNT_KEY, "1");
  } else {
    isReturning = true;
    const currentVisits = parseInt(localStorage.getItem(VISITS_COUNT_KEY) || "1", 10);
    localStorage.setItem(VISITS_COUNT_KEY, (currentVisits + 1).toString());
  }

  return { visitorId, isReturning };
}

/**
 * Record a visit on /learning
 */
export async function trackLearningVisit() {
  if (typeof window === "undefined") return;

  const { visitorId, isReturning } = getOrCreateVisitorToken();
  const dateKey = new Date().toISOString().slice(0, 10);

  try {
    await addDoc(collection(db, "analytics"), {
      type: "learning_visit",
      path: "/learning",
      visitorId,
      isReturning,
      timestamp: new Date().toISOString(),
      dateKey,
    });
  } catch (err) {
    // Non-blocking telemetry
    console.debug("Telemetry notice:", err);
  }
}

/**
 * Record view of a resource & increment its view count
 */
export async function trackResourceView(resourceId: string, currentViews: number = 0) {
  try {
    const { visitorId } = getOrCreateVisitorToken();
    const dateKey = new Date().toISOString().slice(0, 10);

    // Increment resource counter
    try {
      await updateDoc(doc(db, "learningResources", resourceId), {
        viewsCount: increment(1),
      });
    } catch {
      // Document might not exist in Firestore yet if running static fallback
    }

    // Log event in analytics
    await addDoc(collection(db, "analytics"), {
      type: "resource_view",
      path: `/learning#${resourceId}`,
      resourceId,
      visitorId,
      timestamp: new Date().toISOString(),
      dateKey,
    });
  } catch (err) {
    console.debug("Resource view tracking notice:", err);
  }
}

/**
 * Record download of a resource & increment download counter
 */
export async function trackResourceDownload(resourceId: string, currentDownloads: number = 0) {
  try {
    const { visitorId } = getOrCreateVisitorToken();
    const dateKey = new Date().toISOString().slice(0, 10);

    // Increment resource download counter
    try {
      await updateDoc(doc(db, "learningResources", resourceId), {
        downloadCount: increment(1),
      });
    } catch {
      // Document might not exist in Firestore yet if running static fallback
    }

    // Log event in analytics
    await addDoc(collection(db, "analytics"), {
      type: "resource_download",
      path: `/learning/download/${resourceId}`,
      resourceId,
      visitorId,
      timestamp: new Date().toISOString(),
      dateKey,
    });
  } catch (err) {
    console.debug("Resource download tracking notice:", err);
  }
}
