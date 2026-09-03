import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logoBlanc from "../assets/LogoBlanc.png";

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR — commune à toutes les pages
// ─────────────────────────────────────────────────────────────────────────────
export default function Navbar() {
    const [scrolled, setScrolled]   = useState(false);
    const [menuOpen, setMenuOpen]   = useState(false);
    const [isMobile, setIsMobile]   = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        const onResize = () => setIsMobile(window.innerWidth < 768);
        onResize();
        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onResize);
        return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
    }, []);

    // Fait défiler jusqu'à une section : sur la page courante si elle existe,
    // sinon navigue vers l'accueil puis défile une fois montée (utilisé par
    // "Nos projets", qui n'existe que sur "/").
    const scrollToSection = (id, requireHome = false) => {
        setMenuOpen(false);
        const go = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        if (requireHome && location.pathname !== "/") {
            navigate("/");
            setTimeout(go, 400);
        } else {
            setTimeout(go, 350);
        }
    };

    const navLinks = [
        { label: "Nos projets", action: () => scrollToSection("projets", true) },
        { label: "Contact",     action: () => scrollToSection("cta") },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
                    height: "68px", padding: "0 24px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
                    background: scrolled || menuOpen ? "rgba(0,0,0,0.92)" : "transparent",
                    backdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
                    WebkitBackdropFilter: scrolled || menuOpen ? "blur(20px)" : "none",
                    transition: "all 0.4s ease",
                }}
            >
                <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={logoBlanc} alt="NOVYXS" style={{ height: "42px", width: "auto", objectFit: "contain" }} />
                </Link>

                {!isMobile && (
                    <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                        {navLinks.map(({ label, action }) => (
                            <button key={label} type="button" onClick={action}
                                  style={{ background: "none", border: "none", padding: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.52)", cursor: "pointer", transition: "color 0.2s", fontWeight: "500" }}
                                  onMouseEnter={(e) => (e.target.style.color = "#fff")}
                                  onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.52)")}
                            >{label}</button>
                        ))}
                        <button onClick={() => scrollToSection("cta")}
                                style={{ padding: "9px 22px", background: "#ffffff", color: "#000000", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "opacity 0.2s, transform 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
                        >Demander une démo</button>
                    </div>
                )}

                {isMobile && (
                    <button onClick={() => setMenuOpen(!menuOpen)}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "4px" }}>
                        <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} style={{ width: "22px", height: "2px", background: "#fff", borderRadius: "2px" }} />
                        <motion.div animate={{ opacity: menuOpen ? 0 : 1 }} style={{ width: "22px", height: "2px", background: "#fff", borderRadius: "2px" }} />
                        <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} style={{ width: "22px", height: "2px", background: "#fff", borderRadius: "2px" }} />
                    </button>
                )}
            </motion.nav>

            {isMobile && (
                <motion.div
                    initial={false}
                    animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ position: "fixed", top: "68px", left: 0, right: 0, zIndex: 999, overflow: "hidden", background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", pointerEvents: menuOpen ? "auto" : "none" }}
                >
                    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <Link to="/" onClick={() => setMenuOpen(false)}
                              style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px", fontWeight: "500", textAlign: "left", padding: "14px 0", fontFamily: "Inter, sans-serif", borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}
                        >Accueil</Link>
                        {navLinks.map(({ label, action }) => (
                            <button key={label} onClick={action}
                                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: "18px", fontWeight: "500", cursor: "pointer", textAlign: "left", padding: "14px 0", fontFamily: "Inter, sans-serif", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                            >{label}</button>
                        ))}
                        <button onClick={() => scrollToSection("cta")}
                                style={{ marginTop: "16px", padding: "14px", background: "#ffffff", color: "#000", border: "none", borderRadius: "999px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                        >Demander une démo</button>
                    </div>
                </motion.div>
            )}
        </>
    );
}
