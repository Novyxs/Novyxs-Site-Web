import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logoBlanc from "../assets/LogoBlanc.png";

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR — commune à toutes les pages, barre flottante façon "pilule" en verre
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
                    position: "fixed", top: isMobile ? "12px" : "18px", left: "50%", transform: "translateX(-50%)", zIndex: 1000,
                    width: isMobile ? "calc(100% - 24px)" : "min(1180px, calc(100% - 40px))",
                    height: isMobile ? "60px" : "66px", padding: isMobile ? "0 14px" : "0 12px 0 22px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.10)",
                    background: menuOpen ? "rgba(10,10,14,0.88)" : "rgba(10,10,16,0.58)",
                    backdropFilter: "blur(22px)",
                    WebkitBackdropFilter: "blur(22px)",
                    boxShadow: scrolled
                        ? "0 14px 44px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset"
                        : "0 8px 30px rgba(0,0,0,0.28), 0 0 24px rgba(255,255,255,0.03), 0 0 0 1px rgba(255,255,255,0.04) inset",
                    transition: "background 0.4s ease, box-shadow 0.4s ease",
                }}
            >
                <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={logoBlanc} alt="NOVYXS" style={{ height: isMobile ? "34px" : "38px", width: "auto", objectFit: "contain" }} />
                </Link>

                {!isMobile && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {navLinks.map(({ label, action }) => (
                            <button key={label} type="button" onClick={action}
                                  style={{ background: "none", border: "none", padding: "10px 16px", borderRadius: "999px", fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", cursor: "pointer", transition: "color 0.2s, background 0.2s", fontWeight: "500" }}
                                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "transparent"; }}
                            >{label}</button>
                        ))}
                        <button onClick={() => scrollToSection("cta")}
                                style={{ marginLeft: "10px", padding: "10px 22px", background: "#ffffff", color: "#000000", border: "none", borderRadius: "999px", fontSize: "14px", fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 18px rgba(255,255,255,0.15)", transition: "opacity 0.2s, transform 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(1.03)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
                        >Demander une démo</button>
                    </div>
                )}

                {isMobile && (
                    <button onClick={() => setMenuOpen(!menuOpen)}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "4px" }}>
                        <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} style={{ width: "20px", height: "2px", background: "#fff", borderRadius: "2px" }} />
                        <motion.div animate={{ opacity: menuOpen ? 0 : 1 }} style={{ width: "20px", height: "2px", background: "#fff", borderRadius: "2px" }} />
                        <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} style={{ width: "20px", height: "2px", background: "#fff", borderRadius: "2px" }} />
                    </button>
                )}
            </motion.nav>

            {isMobile && (
                <motion.div
                    initial={false}
                    animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                        position: "fixed", top: "78px", left: "12px", right: "12px", zIndex: 999, overflow: "hidden",
                        borderRadius: "28px", border: "1px solid rgba(255,255,255,0.10)",
                        background: "rgba(10,10,16,0.92)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                        pointerEvents: menuOpen ? "auto" : "none",
                    }}
                >
                    <div style={{ padding: "12px 22px 22px", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <Link to="/" onClick={() => setMenuOpen(false)}
                              style={{ color: "rgba(255,255,255,0.85)", fontSize: "17px", fontWeight: "500", textAlign: "left", padding: "14px 0", fontFamily: "Inter, sans-serif", borderBottom: "1px solid rgba(255,255,255,0.07)", textDecoration: "none" }}
                        >Accueil</Link>
                        {navLinks.map(({ label, action }) => (
                            <button key={label} onClick={action}
                                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", fontSize: "17px", fontWeight: "500", cursor: "pointer", textAlign: "left", padding: "14px 0", fontFamily: "Inter, sans-serif", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
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
