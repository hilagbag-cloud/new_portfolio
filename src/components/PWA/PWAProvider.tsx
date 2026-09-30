"use client";

import { useEffect } from "react";
import { PWAInstallPrompt } from "./PWAInstallPrompt";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.debug("PWA Service Worker registered with scope:", registration.scope);
          })
          .catch((err) => {
            console.debug("PWA Service Worker registration notice:", err);
          });
      });
    }
  }, []);

  return (
    <>
      {children}
      <PWAInstallPrompt />
    </>
  );
}
