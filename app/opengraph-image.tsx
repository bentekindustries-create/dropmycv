import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "dropmycv — Match your CV to live jobs, privately";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(1000px 500px at 50% -10%, rgba(61,191,184,0.25), transparent 70%), #1b3357",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1, marginBottom: 28 }}>
          <span style={{ color: "#3dbfb8" }}>drop</span>mycv
          <span style={{ color: "#3dbfb8" }}>.app</span>
        </div>
        <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
          Match your CV to live jobs —{" "}
          <span style={{ color: "#3dbfb8" }}>without handing over your data.</span>
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.7)", marginTop: 32 }}>
          No account · Nothing stored · Ranked by AI · Free
        </div>
      </div>
    ),
    { ...size }
  );
}
