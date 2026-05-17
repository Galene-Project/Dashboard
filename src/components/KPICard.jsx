import React from "react";

export default function KPICard({ icon, label, value, sub, accent = "#c084fc", delay = 0 }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        cursor: "default",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? `0 8px 32px rgba(192,132,252,0.12)` : "none",
        transition: "transform 0.2s, box-shadow 0.2s",
        animation: `fadeUp 0.5s ease ${delay}s both`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        {sub && (
          <span style={{
            fontSize: 10, color: "#6b7280",
            background: "rgba(255,255,255,0.06)",
            padding: "2px 8px", borderRadius: 20,
          }}>{sub}</span>
        )}
      </div>
      <div style={{
        fontSize: 26, fontWeight: 800, color: accent,
        fontFamily: "'DM Mono', monospace", letterSpacing: -1,
      }}>{value}</div>
      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{label}</div>
    </div>
  );
}
