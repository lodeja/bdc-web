import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "Janssens Drone Cleaning, daken en gevels vanuit de lucht";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ display: "flex", width: 96, height: 8, background: "#00c2e8" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.5,
            }}
          >
            Janssens Drone Cleaning
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "#c1c4c8",
              fontSize: 32,
              lineHeight: 1.3,
            }}
          >
            Daken, gevels en zonnepanelen, vanuit de lucht
          </div>
        </div>
        <div style={{ display: "flex", color: "#00c2e8", fontSize: 24, letterSpacing: 2 }}>
          JDC
        </div>
      </div>
    ),
    { ...size },
  );
}
