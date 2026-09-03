import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { t } from "../theme";
import { statusLabels } from "../data/projects";

// ─────────────────────────────────────────────────────────────────────────────
// CARTE PROJET — utilisée par la section "Nos projets" de la page d'accueil
// ─────────────────────────────────────────────────────────────────────────────
export default function ProjectCard({ icon, name, tagline, href, status }) {
    const [hovered, setHovered] = useState(false);
    const isLive = status === "live";

    return (
        <motion.div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            animate={{
                y: hovered ? -6 : 0,
                borderColor: hovered ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
                boxShadow: hovered ? "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)" : "none",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                padding: "32px",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(10px)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>
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

            <h3 style={t.cardTitle}>{name}</h3>
            <p style={{ ...t.body, margin: "0 0 24px 0", fontSize: "15px" }}>{tagline}</p>

            <Link to={href} style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontSize: "14px", fontWeight: "600", color: "#ffffff", textDecoration: "none",
            }}>
                En savoir plus
                <span style={{ transition: "transform 0.2s ease", transform: hovered ? "translateX(3px)" : "translateX(0)" }}>→</span>
            </Link>
        </motion.div>
    );
}
