import { ImageResponse } from "next/og";
import { getServicePage } from "@/config/service-pages";
import { services } from "@/config/services";

export const dynamic = "force-static";
export const dynamicParams = false;

export const alt = "Janssens Drone Cleaning, dienst";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function ServiceOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getServicePage(slug);
  const index = services.findIndex((service) => service.slug === slug);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#071525",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", width: 96, height: 8, background: "#00c2e8" }} />
          <div style={{ display: "flex", color: "#00c2e8", fontSize: 24, letterSpacing: 4 }}>
            {`DIENST ${String(index + 1).padStart(2, "0")}`}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 84,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            {page?.title ?? "Janssens Drone Cleaning"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 960,
              color: "#c1c4c8",
              fontSize: 34,
              lineHeight: 1.3,
            }}
          >
            {page?.headline ?? ""}
          </div>
        </div>
        <div style={{ display: "flex", color: "#ffffff", fontSize: 26, letterSpacing: 1 }}>
          Janssens Drone Cleaning
        </div>
      </div>
    ),
    { ...size },
  );
}
