import { MetadataRoute } from "next";
import { detectDeploymentHost } from "@/lib/cms-meta";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const cleanBaseUrl = await detectDeploymentHost();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*", "/.env*", "/.git*"],
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "Applebot",
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
          "meta-externalagent",
          "cohere-ai",
        ],
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
      {
        // Block intrusive scrapers, security scanners & terminal bots
        userAgent: [
          "python-requests",
          "python-httpx",
          "aiohttp",
          "Wget",
          "curl",
          "AhrefsBot",
          "SemrushBot",
          "AgentTrustBot",
          "siteradar",
          "DefaultsExposed",
          "Lwspanel",
          "sqlmap",
          "nikto",
          "nmap",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${cleanBaseUrl}/sitemap.xml`,
  };
}
