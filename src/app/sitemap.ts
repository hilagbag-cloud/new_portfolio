import { MetadataRoute } from "next";
import { milestones as defaultMilestones } from "@/data/milestones";
import { projects as defaultProjects } from "@/data/projects";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hilarus.dev";
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  let publishedMilestoneIds: string[] = defaultMilestones
    .filter((m) => m.published !== false)
    .map((m) => m.id);

  let publishedProjectIds: string[] = defaultProjects
    .filter((p) => p.published !== false)
    .map((p) => p.id);

  try {
    const qMilestones = query(collection(db, "milestones"), where("published", "==", true));
    const snapMilestones = await getDocs(qMilestones);
    if (!snapMilestones.empty) {
      publishedMilestoneIds = snapMilestones.docs.map((d) => d.id);
    }
  } catch {
    // Fallback to static milestones if DB is unreachable during build
  }

  try {
    const qProjects = query(collection(db, "projects"), where("published", "==", true));
    const snapProjects = await getDocs(qProjects);
    if (!snapProjects.empty) {
      publishedProjectIds = snapProjects.docs.map((d) => d.id);
    }
  } catch {
    // Fallback to static projects
  }

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: cleanBaseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...publishedProjectIds.map((id) => ({
      url: `${cleanBaseUrl}/projects/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...publishedMilestoneIds.map((id) => ({
      url: `${cleanBaseUrl}/journey/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return sitemapEntries;
}
