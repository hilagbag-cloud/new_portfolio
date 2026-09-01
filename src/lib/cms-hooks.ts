import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { projects as defaultProjects, type Project } from "@/data/projects";
import { milestones as defaultMilestones, type Milestone } from "@/data/milestones";
import { site as defaultSite } from "@/data/site";
import { defaultSiteMetadata, type SiteMetadataConfig } from "@/lib/cms-meta";
import { seedInitialCmsData } from "./cms-seed";

export type CmsMergedSiteConfig = typeof defaultSite & SiteMetadataConfig;

/**
 * Merge Firestore projects with default projects:
 * - If Firestore has custom or edited projects, keep/override them.
 * - If default projects are not in Firestore, keep them in the list so nothing disappears.
 */
function mergeProjects(firestoreList: Project[]): Project[] {
  if (firestoreList && firestoreList.length > 0) {
    return [...firestoreList].sort((a, b) => {
      const orderA =
        typeof a.order === "number"
          ? a.order
          : parseInt(a.number || "999", 10) || 999;
      const orderB =
        typeof b.order === "number"
          ? b.order
          : parseInt(b.number || "999", 10) || 999;
      if (orderA !== orderB) return orderA - orderB;
      return (a.number || "").localeCompare(b.number || "");
    });
  }
  return defaultProjects;
}

/**
 * Merge Firestore milestones with default milestones
 */
function mergeMilestones(firestoreList: Milestone[]): Milestone[] {
  if (firestoreList && firestoreList.length > 0) {
    return [...firestoreList].sort(
      (a, b) => (a.progress || 0) - (b.progress || 0)
    );
  }
  return defaultMilestones;
}

export function useCmsProjects() {
  const [projectsList, setProjectsList] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map((d) => ({
            ...d.data(),
            id: d.id,
          })) as Project[];
          setProjectsList(mergeProjects(fetched));
        } else {
          // If firestore is completely empty, populate with defaults
          setProjectsList(defaultProjects);
          seedInitialCmsData(false).catch((err) =>
            console.warn("Auto-seed error:", err)
          );
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Projects snapshot error:", err);
        setProjectsList(defaultProjects);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { projects: projectsList, loading };
}

export function useCmsMilestones() {
  const [milestonesList, setMilestonesList] = useState<Milestone[]>(defaultMilestones);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "milestones"),
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map((d) => ({
            ...d.data(),
            id: d.id,
          })) as Milestone[];
          setMilestonesList(mergeMilestones(fetched));
        } else {
          setMilestonesList(defaultMilestones);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Milestones snapshot error:", err);
        setMilestonesList(defaultMilestones);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { milestones: milestonesList, loading };
}

export function useCmsSiteConfig(): CmsMergedSiteConfig {
  const [siteConfig, setSiteConfig] = useState<CmsMergedSiteConfig>(() => ({
    ...defaultSite,
    ...defaultSiteMetadata,
    profileImage: "",
  }));

  useEffect(() => {
    // Check localStorage on client mount after hydration
    if (typeof window !== "undefined") {
      try {
        let cachedProfile = localStorage.getItem("cms_profile_image");
        if (cachedProfile === "/hilarus.png") {
          localStorage.removeItem("cms_profile_image");
          cachedProfile = null;
        }
        const cachedConfig = localStorage.getItem("cms_site_config");
        if (cachedProfile || cachedConfig) {
          const parsed = cachedConfig ? JSON.parse(cachedConfig) : {};
          if (parsed.profileImage === "/hilarus.png") {
            parsed.profileImage = "";
          }
          setSiteConfig((prev) => ({
            ...prev,
            ...parsed,
            ...(cachedProfile ? { profileImage: cachedProfile } : {}),
          }));
        }
      } catch {
        // ignore
      }
    }

    const unsub = onSnapshot(
      doc(db, "siteConfig", "global"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteMetadataConfig;
          if (data.profileImage === "/hilarus.png") {
            data.profileImage = "";
          }
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("cms_site_config", JSON.stringify(data));
              if (data.profileImage && data.profileImage !== "/hilarus.png") {
                localStorage.setItem("cms_profile_image", data.profileImage);
              } else {
                localStorage.removeItem("cms_profile_image");
              }
            } catch {
              // ignore storage quotas
            }
          }
          setSiteConfig((prev) => ({
            ...prev,
            ...data,
          }));
        }
      },
      (err) => {
        console.warn("SiteConfig snapshot error:", err);
      }
    );
    return () => unsub();
  }, []);

  return siteConfig;
}
