"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages to keep public stats clean
    if (pathname.startsWith("/admin")) return;

    const trackView = async () => {
      try {
        const now = new Date();
        const dateKey = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
        const device = isMobile ? "Mobile" : "Desktop";

        let browser = "Other";
        if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome";
        else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
        else if (userAgent.includes("Firefox")) browser = "Firefox";
        else if (userAgent.includes("Edg")) browser = "Edge";

        await addDoc(collection(db, "analytics"), {
          type: "pageview",
          path: pathname,
          referrer: typeof document !== "undefined" ? document.referrer || "Direct" : "Direct",
          device,
          browser,
          timestamp: now.toISOString(),
          dateKey,
        });
      } catch (err) {
        // Silent failure for analytics
        console.debug("Analytics log skipped:", err);
      }
    };

    // Slight delay to avoid blocking render
    const timer = setTimeout(trackView, 1200);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
