import { Link } from "react-router-dom";
import logoBlanc from "../assets/LogoBlanc.png";

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER — commun à toutes les pages
// ─────────────────────────────────────────────────────────────────────────────
export default function Footer() {
    const links = [
        { label: "Confidentialité",  to: "/confidentialite" },
        { label: "Mentions légales", to: "/mentions-legales" },
    ];

    return (
        <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", maxWidth: "1440px", margin: "0 auto", boxSizing: "border-box" }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={logoBlanc} alt="NOVYXS" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
            </Link>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", margin: 0 }}>© 2026 NOVYXS — Tous droits réservés</p>
            <div style={{ display: "flex", gap: "24px" }}>
                {links.map(({ label, to }) => (
                    <Link key={label} to={to}
                          style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", transition: "color 0.2s", textDecoration: "none" }}
                          onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.75)")}
                          onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.38)")}
                    >{label}</Link>
                ))}
                <button type="button" onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
                      style={{ background: "none", border: "none", padding: 0, fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.38)", cursor: "pointer", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.75)")}
                      onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.38)")}
                >Contact</button>
            </div>
        </footer>
    );
}
