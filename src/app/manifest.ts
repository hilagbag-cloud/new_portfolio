import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hilarus Gbagoule — Digital Builder",
    short_name: "Hilarus",
    description:
      "Portfolio officiel d'Hilarus Gbagoule. Design d'interfaces haute fidélité, ingénierie logicielle et intelligence artificielle.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d110e",
    theme_color: "#9fff00",
    icons: [
      {
        src: "/icon",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
