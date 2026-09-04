import { useState } from "react";
import { motion } from "framer-motion";
import { t } from "../theme";

function hexToRgba(hex, alpha) {
    const n = parseInt(hex.replace("#", ""), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOVER CARD — `accent` (couleur hex optionnelle) teinte légèrement la pastille
// d'icône ; sans lui, comportement neutre inchangé.
// ─────────────────────────────────────────────────────────────────────────────
export default function HoverCard({ icon, title, desc, compact = false, accent }) {
    const [hovered, setHovered] = useState(false);
    const isHero    = compact === "hero";
    const isCompact = compact === true;

    const iconBox = accent
        ? { background: hexToRgba(accent, 0.12), border: `1px solid ${hexToRgba(accent, 0.32)}` }
        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" };

    return (
        <motion.div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            animate={{
                y: hovered ? -6 : 0,
                borderColor: hovered ? (accent ? hexToRgba(accent, 0.35) : "rgba(255,255,255,0.22)") : "rgba(255,255,255,0.08)",
                boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)" : "none",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: isCompact ? "16px" : "24px",
                padding: isHero ? "20px 22px" : isCompact ? "16px 20px" : "28px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
                cursor: "default",
                display: isCompact ? "flex" : "block",
                alignItems: isCompact ? "center" : undefined,
                gap: isCompact ? "14px" : undefined,
                textAlign: isHero ? "left" : undefined,
            }}
        >
            {isHero ? (
                <>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", ...iconBox, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginBottom: "10px" }}>{icon}</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginBottom: "3px" }}>{title}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: "1.4" }}>{desc}</div>
                </>
            ) : isCompact ? (
                <>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", ...iconBox, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{icon}</div>
                    <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.88)" }}>{title}</span>
                </>
            ) : (
                <>
                    <div style={accent
                        ? { width: "44px", height: "44px", borderRadius: "12px", ...iconBox, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "16px" }
                        : { fontSize: "28px", marginBottom: "16px" }}>{icon}</div>
                    <h3 style={t.cardTitle}>{title}</h3>
                    <p style={{ ...t.body, margin: 0, fontSize: "15px" }}>{desc}</p>
                </>
            )}
        </motion.div>
    );
}
