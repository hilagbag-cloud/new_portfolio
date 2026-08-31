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
  const mergedMap = new Map<string, Project>();

  // 1. Put all default projects
  defaultProjects.forEach((p) => {
    mergedMap.set(p.id, { ...p });
  });

  // 2. Overlay Firestore projects (edited or new)
  firestoreList.forEach((p) => {
    const existing = mergedMap.get(p.id);
    mergedMap.set(p.id, { ...existing, ...p });
  });

  return Array.from(mergedMap.values()).sort((a, b) => {
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

/**
 * Merge Firestore milestones with default milestones
 */
function mergeMilestones(firestoreList: Milestone[]): Milestone[] {
  const mergedMap = new Map<string, Milestone>();

  defaultMilestones.forEach((m) => {
    mergedMap.set(m.id, { ...m });
  });

  firestoreList.forEach((m) => {
    const existing = mergedMap.get(m.id);
    mergedMap.set(m.id, { ...existing, ...m });
  });

  const list = Array.from(mergedMap.values());
  list.sort((a, b) => (a.progress || 0) - (b.progress || 0));
  return list;
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
  const [siteConfig, setSiteConfig] = useState<CmsMergedSiteConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("cms_site_config");
        const cachedProfileImage = localStorage.getItem("cms_profile_image");
        if (cached) {
          const parsed = JSON.parse(cached);
          return {
            ...defaultSite,
            ...defaultSiteMetadata,
            ...parsed,
            ...(cachedProfileImage ? { profileImage: cachedProfileImage } : {}),
          } as CmsMergedSiteConfig;
        } else if (cachedProfileImage) {
          return {
            ...defaultSite,
            ...defaultSiteMetadata,
            profileImage: cachedProfileImage,
          } as CmsMergedSiteConfig;
        }
      } catch {
        // ignore JSON parse or storage errors
      }
    }
    return {
      ...defaultSite,
      ...defaultSiteMetadata,
    } as CmsMergedSiteConfig;
  });

  useEffect(() => {
    // Check localStorage on client mount if initial SSR was empty
    if (typeof window !== "undefined") {
      try {
        const cachedProfile = localStorage.getItem("cms_profile_image");
        const cachedConfig = localStorage.getItem("cms_site_config");
        if (cachedProfile || cachedConfig) {
          const parsed = cachedConfig ? JSON.parse(cachedConfig) : {};
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
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("cms_site_config", JSON.stringify(data));
              if (data.profileImage) {
                localStorage.setItem("cms_profile_image", data.profileImage);
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
