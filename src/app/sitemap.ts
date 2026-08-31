import { MetadataRoute } from "next";
import { milestones as defaultMilestones, type Milestone } from "@/data/milestones";
import { projects as defaultProjects, type Project } from "@/data/projects";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SiteMetadataConfig } from "@/lib/cms-meta";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hilarus.dev";

  try {
    const metaSnap = await getDoc(doc(db, "site_settings", "metadata"));
    if (metaSnap.exists()) {
      const meta = metaSnap.data() as SiteMetadataConfig;
      if (meta.siteUrl) siteUrl = meta.siteUrl;
      else if (meta.canonicalUrl) siteUrl = meta.canonicalUrl;
    }
  } catch {
    // ignore
  }

  const cleanBaseUrl = siteUrl.replace(/\/$/, "");

  let projectsList: Project[] = [...defaultProjects];
  try {
    const projSnap = await getDocs(collection(db, "projects"));
    if (!projSnap.empty) {
      const dbProjects = projSnap.docs.map((d) => ({
        ...(d.data() as Project),
        id: d.id,
      }));
      const merged = new Map<string, Project>();
      defaultProjects.forEach((p) => merged.set(p.id, p));
      dbProjects.forEach((p) => merged.set(p.id, { ...merged.get(p.id), ...p }));
      projectsList = Array.from(merged.values());
    }
  } catch {
    // Fallback to static projects
  }

  let milestonesList: Milestone[] = [...defaultMilestones];
  try {
    const mileSnap = await getDocs(collection(db, "milestones"));
    if (!mileSnap.empty) {
      const dbMilestones = mileSnap.docs.map((d) => ({
        ...(d.data() as Milestone),
        id: d.id,
      }));
      const mergedM = new Map<string, Milestone>();
      defaultMilestones.forEach((m) => mergedM.set(m.id, m));
      dbMilestones.forEach((m) => mergedM.set(m.id, { ...mergedM.get(m.id), ...m }));
      milestonesList = Array.from(mergedM.values());
    }
  } catch {
    // Fallback to static milestones
  }

  const publishedProjects = projectsList.filter((p) => p.published !== false);
  const publishedMilestones = milestonesList.filter((m) => m.published !== false);

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: cleanBaseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...publishedProjects.map((p) => ({
      url: `${cleanBaseUrl}/projects/${p.id}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...publishedMilestones.map((m) => ({
      url: `${cleanBaseUrl}/journey/${m.id}`,
      lastModified: m.updatedAt ? new Date(m.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return sitemapEntries;
}
