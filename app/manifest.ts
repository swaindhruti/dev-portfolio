import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dhrutinandan Swain — Backend, AI & Full-Stack Engineer",
    short_name: "D. Swain",
    description:
      "Portfolio of Dhrutinandan Swain, a self-taught Backend, AI and Full-Stack Engineer based in Odisha, India, available for freelance work.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F1EA",
    theme_color: "#000000",
    icons: [
      { src: "/icon.png", sizes: "32x32", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
