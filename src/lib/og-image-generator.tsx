import { type ReactElement } from "react";

interface OgImageProps {
  readonly title?: string;
  readonly tagline?: string;
  readonly stats?: readonly { label: string; value: string; gradient: string }[];
  readonly footer?: string;
}

const DEFAULT_STATS = [
  { label: "Skills", value: "127", gradient: "linear-gradient(180deg, #f472b6 0%, #ec4899 100%)" },
  { label: "Plugins", value: "12", gradient: "linear-gradient(180deg, #34d399 0%, #10b981 100%)" },
  { label: "MCP Servers", value: "16", gradient: "linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%)" },
] as const;

export function generateOgImage({
  title = "sigstack",
  tagline = "My Claude Code stack for shipping with AI",
  stats = DEFAULT_STATS,
  footer = "sigstack.dev",
}: OgImageProps = {}): ReactElement {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow effects */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "20%",
          width: "400px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Main title */}
      <div
        style={{
          display: "flex",
          fontSize: 120,
          fontWeight: 800,
          letterSpacing: "-4px",
          background: "linear-gradient(180deg, #e9d5ff 0%, #a855f7 50%, #7c3aed 100%)",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 0 80px rgba(168, 85, 247, 0.8)",
          marginBottom: "20px",
        }}
      >
        {title}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 32,
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "50px",
          display: "flex",
        }}
      >
        {tagline}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: "60px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                background: stat.gradient,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 24, color: "rgba(255, 255, 255, 0.5)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: 24,
          color: "rgba(255, 255, 255, 0.4)",
          display: "flex",
          gap: "8px",
        }}
      >
        <span>{footer}</span>
        <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
        <span>Ready to clone</span>
      </div>
    </div>
  );
}
