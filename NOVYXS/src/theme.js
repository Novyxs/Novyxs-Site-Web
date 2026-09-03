// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — partagés entre toutes les pages
// ─────────────────────────────────────────────────────────────────────────────
export const t = {
    h2: { fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: "1.1", fontWeight: "650", letterSpacing: "-0.03em", color: "#ffffff" },
    h1: { fontSize: "clamp(48px, 7vw, 86px)", lineHeight: "1.04", fontWeight: "700", letterSpacing: "-0.04em", color: "#ffffff" },
    body: { fontSize: "17px", lineHeight: "1.8", color: "rgba(255,255,255,0.78)" },
    label: { fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: "500" },
    cardTitle: { fontSize: "20px", fontWeight: "600", color: "#ffffff", margin: "0 0 12px 0" },
};

export const sectionAnimation = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.75, ease: "easeOut" },
};

export const whiteBtn = {
    background: "#ffffff", color: "#000000", border: "none",
    padding: "15px 32px", borderRadius: "999px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 10px 40px rgba(255,255,255,0.12)", transition: "all 0.3s ease",
};

export const darkBtn = {
    background: "transparent", color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.18)",
    padding: "15px 32px", borderRadius: "999px",
    fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease",
};

export const hoverIn = (e) => { e.currentTarget.style.transform = "scale(1.04)"; };
export const hoverOut = (e) => { e.currentTarget.style.transform = "scale(1)"; };
