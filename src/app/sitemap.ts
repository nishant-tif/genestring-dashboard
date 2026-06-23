import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://drgauriagrawal.com";

  const staticRoutes = [
    "/",
    "/about",
    "/featured",
    "/success-stories",
    "/awards",
    "/initiatives",
    "/podcasts",
    "/dashboard/articles",
  ];

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
