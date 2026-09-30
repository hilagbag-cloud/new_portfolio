import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Hilarus Gbagoule — Digital Builder",
    short_name: "Hilarus",
    description:
      "Portfolio officiel d'Hilarus Gbagoule & Plateforme Apprentissage Boosté. Design d'interfaces, ingénierie logicielle et ressources libres.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#080a09",
    theme_color: "#a8f35a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Apprentissage Boosté",
        short_name: "Learning",
        description: "Accéder directement au catalogue des cours et ressources",
        url: "/learning",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Publier une Ressource",
        short_name: "Publier",
        description: "Ouvrir l'espace d'importation et publication de ressources",
        url: "/admin?tab=learning&action=publish",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
