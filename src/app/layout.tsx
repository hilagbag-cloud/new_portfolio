import type { Metadata } from "next";
import { Suez_One, Inter, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { AnalyticsTracker } from "@/components/Analytics/AnalyticsTracker";
import {
  getDynamicSiteMetadata,
  buildNextMetadata,
  buildJsonLdSchema,
} from "@/lib/cms-meta";
import "./globals.css";

const suezOne = Suez_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-suez-one",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const dynamicConfig = await getDynamicSiteMetadata();
  return buildNextMetadata(dynamicConfig);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dynamicConfig = await getDynamicSiteMetadata();
  const jsonLd = buildJsonLdSchema(dynamicConfig);

  return (
    <html lang="fr" className={`${suezOne.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* Structured Data Graph for Search Engines & AI Agents */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased selection:bg-accent selection:text-bg">
        <AuthProvider>
          <AnalyticsTracker />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
