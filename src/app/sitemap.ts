import { MetadataRoute } from "next";
import { milestones as defaultMilestones } from "@/data/milestones";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hilarus.dev";
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  let publishedMilestoneIds: string[] = defaultMilestones
    .filter((m) => m.published !== false)
    .map((m) => m.id);

  try {
    const q = query(collection(db, "milestones"), where("published", "==", true));
    const snap = await getDocs(q);
    if (!snap.empty) {
      publishedMilestoneIds = snap.docs.map((d) => d.id);
    }
  } catch {
    // Fallback to static milestones if DB is unreachable during build
  }

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: cleanBaseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...publishedMilestoneIds.map((id) => ({
      url: `${cleanBaseUrl}/journey/${id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return sitemapEntries;
}
