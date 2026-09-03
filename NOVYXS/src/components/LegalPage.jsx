import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// PAGE LÉGALE — réutilisable pour Confidentialité et Mentions légales.
// Navbar/Footer sont désormais globaux (rendus par App.jsx), cette page ne
// contient que son propre contenu.
// ─────────────────────────────────────────────────────────────────────────────
export default function LegalPage({ title, lastUpdate, sections }) {
    return (
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "140px 24px 100px" }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <p style={{ fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px" }}>
                    Dernière mise à jour : {lastUpdate}
                </p>
                <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "700", letterSpacing: "-0.03em", marginBottom: "48px", lineHeight: 1.1, color: "#fff" }}>
                    {title}
                </h1>

                {sections.map((section, i) => (
                    <div key={i} style={{ marginBottom: "48px" }}>
                        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "32px" }} />
                        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#fff" }}>
                            {section.title}
                        </h2>
                        <div style={{ fontSize: "16px", lineHeight: "1.8", color: "rgba(255,255,255,0.72)" }}>
                            {section.content}
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
