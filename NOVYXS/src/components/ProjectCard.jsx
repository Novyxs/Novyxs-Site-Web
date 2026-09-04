import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { t } from "../theme";
import { statusLabels } from "../data/projects";

function hexToRgba(hex, alpha) {
    const n = parseInt(hex.replace("#", ""), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r},${g},${b},${alpha})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CARTE PROJET — utilisée par la section "Nos projets" de la page d'accueil.
// Fond dégradé coloré (pas de noir plat) dans la teinte du projet, glow décoratif
// en fond de carte, bouton plein pour un vrai appel à l'action.
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectCard({ icon, name, tagline, href, status, accent = "#ffffff" }) {
    const [hovered, setHovered] = useState(false);
    const isLive = status === "live";

    return (
        <motion.div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            animate={{
                y: hovered ? -8 : 0,
                borderColor: hovered ? hexToRgba(accent, 0.5) : hexToRgba(accent, 0.22),
                boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.5), 0 0 50px ${hexToRgba(accent, 0.18)}` : `0 12px 40px rgba(0,0,0,0.35)`,
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
                position: "relative", overflow: "hidden",
                border: "1px solid",
                borderRadius: "28px",
                padding: "40px 36px",
                background: `linear-gradient(150deg, ${hexToRgba(accent, 0.16)} 0%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.02) 100%)`,
                backdropFilter: "blur(10px)",
                display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box",
            }}
        >
            {/* Glow décoratif */}
            <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "999px", background: `radial-gradient(circle, ${hexToRgba(accent, 0.35)} 0%, ${hexToRgba(accent, 0)} 70%)`, filter: "blur(10px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "26px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: hexToRgba(accent, 0.16), border: `1px solid ${hexToRgba(accent, 0.4)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
                    {icon}
                </div>
                <span style={{
                    fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: "600",
                    padding: "5px 12px", borderRadius: "999px",
                    color: isLive ? "#7effc0" : "rgba(255,255,255,0.55)",
                    background: isLive ? "rgba(0,255,170,0.1)" : "rgba(255,255,255,0.06)",
                    border: isLive ? "1px solid rgba(0,255,170,0.25)" : "1px solid rgba(255,255,255,0.12)",
                }}>
                    {statusLabels[status] ?? status}
                </span>
            </div>

            <h3 style={{ ...t.cardTitle, position: "relative", fontSize: "26px", margin: "0 0 12px 0" }}>{name}</h3>
            <p style={{ ...t.body, position: "relative", margin: "0 0 32px 0", fontSize: "15px", maxWidth: "420px" }}>{tagline}</p>

            <Link to={href} style={{
                position: "relative", marginTop: "auto",
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "13px 24px", borderRadius: "999px",
                background: hexToRgba(accent, hovered ? 0.9 : 0.14),
                border: `1px solid ${hexToRgba(accent, 0.5)}`,
                fontSize: "14px", fontWeight: "600",
                color: hovered ? "#04050a" : "#ffffff",
                textDecoration: "none", width: "fit-content",
                transition: "background 0.25s ease, color 0.25s ease",
            }}>
                Découvrir le projet
                <span style={{ transition: "transform 0.2s ease", transform: hovered ? "translateX(3px)" : "translateX(0)" }}>→</span>
            </Link>
        </motion.div>
    );
}
