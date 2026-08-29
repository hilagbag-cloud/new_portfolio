import { useEffect, useState } from "react";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { projects as defaultProjects, type Project } from "@/data/projects";
import { milestones as defaultMilestones, type Milestone } from "@/data/milestones";
import { site as defaultSite } from "@/data/site";
import type { SiteMetadataConfig } from "@/lib/cms-meta";

export type CmsMergedSiteConfig = typeof defaultSite & SiteMetadataConfig;

export function useCmsProjects() {
  const [projectsList, setProjectsList] = useState<Project[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "projects"), (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        })) as Project[];
        setProjectsList(fetched);
      }
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { projects: projectsList, loading };
}

export function useCmsMilestones() {
  const [milestonesList, setMilestonesList] = useState<Milestone[]>(defaultMilestones);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "milestones"), (snapshot) => {
      if (!snapshot.empty) {
        const fetched = snapshot.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        })) as Milestone[];
        // Sort by progress or step number
        fetched.sort((a, b) => (a.progress || 0) - (b.progress || 0));
        setMilestonesList(fetched);
      }
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { milestones: milestonesList, loading };
}

export function useCmsSiteConfig(): CmsMergedSiteConfig {
  const [siteConfig, setSiteConfig] = useState<CmsMergedSiteConfig>(defaultSite as CmsMergedSiteConfig);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "siteConfig", "global"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteMetadataConfig;
        setSiteConfig((prev) => ({
          ...prev,
          ...data,
        }));
      }
    });
    return () => unsub();
  }, []);

  return siteConfig;
}

