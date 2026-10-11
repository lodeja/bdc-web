import type { MetadataRoute } from "next";
import { services } from "@/config/services";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...services.map((service) => ({
      url: absoluteUrl(service.href),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/privacy/"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/veiligheid-en-regelgeving/"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
