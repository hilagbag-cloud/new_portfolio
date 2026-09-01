import type { Metadata } from "next";
import { Suez_One, Inter, IBM_Plex_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import { AnalyticsTracker } from "@/components/Analytics/AnalyticsTracker";
import {
  getDynamicSiteMetadata,
  buildNextMetadata,
  buildJsonLdSchema,
} from "@/lib/cms-meta";
import { Analytics } from "@vercel/analytics/next";
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
    <html lang="fr" className={`${suezOne.variable} ${inter.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Anti-FOUC Theme Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('hilarus_theme');
                  if (saved === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Structured Data Graph for Search Engines & AI Agents */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased selection:bg-accent selection:text-bg">
        <AuthProvider>
          <ThemeProvider>
            <AnalyticsTracker />
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
