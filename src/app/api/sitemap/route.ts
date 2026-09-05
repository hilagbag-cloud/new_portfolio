import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { projects as defaultProjects, type Project } from "@/data/projects";
import { milestones as defaultMilestones, type Milestone } from "@/data/milestones";
import type { SiteMetadataConfig } from "@/lib/cms-meta";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // revalidate every 1 hour

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function formatDate(dateInput: string | number | Date | undefined): string {
  if (!dateInput) return new Date().toISOString().split("T")[0];
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

export async function GET(req: NextRequest) {
  // 1. Determine base URL (Priority: Firestore config -> Env -> Default)
  let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hilarus.dev";

  try {
    const globalSnap = await getDoc(doc(db, "siteConfig", "global"));
    if (globalSnap.exists()) {
      const globalData = globalSnap.data() as SiteMetadataConfig;
      if (globalData.siteUrl) siteUrl = globalData.siteUrl;
      else if (globalData.canonicalUrl) siteUrl = globalData.canonicalUrl;
    } else {
      const metaSnap = await getDoc(doc(db, "site_settings", "metadata"));
      if (metaSnap.exists()) {
        const meta = metaSnap.data() as SiteMetadataConfig;
        if (meta.siteUrl) siteUrl = meta.siteUrl;
        else if (meta.canonicalUrl) siteUrl = meta.canonicalUrl;
      }
    }
  } catch {
    // ignore
  }

  const cleanBaseUrl = siteUrl.replace(/\/$/, "");

  // 2. Fetch Projects (Firestore + Default merge)
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
    // Fallback to static
  }

  // Filter published only
  const publishedProjects = projectsList.filter((p) => p.published !== false);

  // 3. Fetch Milestones (Firestore + Default merge)
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
    // Fallback to static
  }

  const publishedMilestones = milestonesList.filter((m) => m.published !== false);

  // Check if JSON format requested
  const searchParams = req.nextUrl.searchParams;
  if (searchParams.get("format") === "json" || req.headers.get("accept")?.includes("application/json")) {
    return NextResponse.json({
      siteUrl: cleanBaseUrl,
      generatedAt: new Date().toISOString(),
      counts: {
        totalUrls: 1 + publishedProjects.length + publishedMilestones.length,
        projects: publishedProjects.length,
        milestones: publishedMilestones.length,
      },
      urls: [
        {
          url: cleanBaseUrl,
          lastModified: new Date().toISOString(),
          changeFrequency: "weekly",
          priority: 1.0,
        },
        ...publishedProjects.map((p) => ({
          url: `${cleanBaseUrl}/projects/${p.id}`,
          lastModified: formatDate(p.updatedAt || p.createdAt),
          changeFrequency: "weekly",
          priority: 0.9,
          title: p.name,
          category: p.category,
        })),
        ...publishedMilestones.map((m) => ({
          url: `${cleanBaseUrl}/journey/${m.id}`,
          lastModified: formatDate(m.updatedAt || m.date),
          changeFrequency: "monthly",
          priority: 0.8,
          title: m.title,
        })),
      ],
    });
  }

  // 4. Build standard Sitemaps.org XML with Google Image extensions
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Page d'accueil officielle -->
  <url>
    <loc>${escapeXml(cleanBaseUrl)}</loc>
    <lastmod>${formatDate(new Date())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  // Projects entries with Image indexation
  for (const project of publishedProjects) {
    const projectUrl = `${cleanBaseUrl}/projects/${project.id}`;
    const lastMod = formatDate(project.updatedAt || project.createdAt);
    const imageUrl = project.previewImage || project.coverImage;

    xml += `  <url>
    <loc>${escapeXml(projectUrl)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>`;

    if (imageUrl && imageUrl.startsWith("http")) {
      xml += `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(project.name)}</image:title>
      <image:caption>${escapeXml(project.shortDescription || project.name)}</image:caption>
    </image:image>`;
    }

    xml += `
  </url>
`;
  }

  // Milestones / Journey entries
  for (const milestone of publishedMilestones) {
    const milestoneUrl = `${cleanBaseUrl}/journey/${milestone.id}`;
    const lastMod = formatDate(milestone.updatedAt || milestone.date);

    xml += `  <url>
    <loc>${escapeXml(milestoneUrl)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex", // Prevents the raw XML itself from being indexed as a search snippet
    },
  });
}
