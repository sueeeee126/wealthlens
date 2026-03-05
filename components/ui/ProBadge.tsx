"use client";

export default function ProBadge({ small = false }: { small?: boolean }) {
  return (
    <span
      className="inline-flex items-center font-bold rounded-full"
      style={{
        background: "linear-gradient(135deg, #FF9500, #FF3B30, #AF52DE)",
        color: "#FFFFFF",
        fontSize: small ? "9px" : "10px",
        padding: small ? "2px 6px" : "3px 8px",
        letterSpacing: "0.5px",
      }}
    >
      PRO ✦
    </span>
  );
}
