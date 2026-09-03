import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import logoBlanc from "./assets/LogoBlanc.png";

// Chargé en chunk séparé : three.js/r3f ne doit pas alourdir le bundle initial.
const Background3D = lazy(() => import("./components/Background3D"));

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const t = {
    h2: { fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: "1.1", fontWeight: "650", letterSpacing: "-0.03em", color: "#ffffff" },
    h1: { fontSize: "clamp(48px, 7vw, 86px)", lineHeight: "1.04", fontWeight: "700", letterSpacing: "-0.04em", color: "#ffffff" },
    body: { fontSize: "17px", lineHeight: "1.8", color: "rgba(255,255,255,0.78)" },
    label: { fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontWeight: "500" },
    cardTitle: { fontSize: "20px", fontWeight: "600", color: "#ffffff", margin: "0 0 12px 0" },
};

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN — particule (classe hors composant, requis par eslint-plugin-react-hooks)
// ─────────────────────────────────────────────────────────────────────────────
class Dot {
    constructor(i, total, W, H, cx, cy) {
        const cols = Math.ceil(Math.sqrt(total * W / H));
        const col  = i % cols;
        const rows = Math.ceil(total / cols);
        const row  = Math.floor(i / cols);

        this.cx = cx;
        this.cy = cy;
        this.targetX = (col / Math.max(cols - 1, 1)) * W;
        this.targetY = (row / Math.max(rows - 1, 1)) * H;

        this.x = cx + (Math.random() - 0.5) * 40;
        this.y = cy + (Math.random() - 0.5) * 40;

        const dx = this.targetX - cx;
        const dy = this.targetY - cy;
        this.distFromCenter = Math.sqrt(dx * dx + dy * dy);
        this.maxDist        = Math.sqrt(cx * cx + cy * cy);

        this.formDelay = (this.distFromCenter / this.maxDist) * 700;
        this.alpha  = 0;
        this.size   = 1.8 + Math.random() * 2;
        this.formed = false;

        const angle = Math.atan2(this.targetY - cy, this.targetX - cx);
        const speed = 400 + Math.random() * 600;
        this.dissolveVX = Math.cos(angle) * speed;
        this.dissolveVY = Math.sin(angle) * speed;

        this.dissolveDelay   = (this.distFromCenter / this.maxDist) * 400;
        this.dissolveStarted = false;
        this.dissolveT       = 0;
    }

    update(elapsed, dt, phase) {
        if (phase === 'forming') {
            const t = elapsed - this.formDelay;
            if (t < 0) return;
            const progress = Math.min(t / 500, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            this.x = this.cx + (this.targetX - this.cx) * ease;
            this.y = this.cy + (this.targetY - this.cy) * ease;
            this.alpha = ease * 0.15;
            if (progress >= 1) this.formed = true;
        }

        if (phase === 'dissolving') {
            if (!this.dissolveStarted) {
                const t = elapsed - this.dissolveDelay;
                if (t < 0) return;
                this.dissolveStarted = true;
                this.dissolveT = 0;
                this.startX = this.x;
                this.startY = this.y;
            }
            this.dissolveT += dt;
            const progress = Math.min(this.dissolveT / 1400, 1);
            const ease = 1 - Math.pow(1 - progress, 2);
            this.x = this.startX + this.dissolveVX * ease * 0.5;
            this.y = this.startY + this.dissolveVY * ease * 0.5;
            this.alpha = (1 - progress) * 0.18;
        }
    }

    draw(ctx) {
        if (this.alpha <= 0.005) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha.toFixed(3)})`;
        ctx.fill();
    }
}

function SplashScreen({ onComplete }) {
    const canvasRef   = useRef(null);
    const logoRef     = useRef(null);
    const phaseRef    = useRef('forming');
    const rafRef      = useRef(null);
    const startRef    = useRef(0);
    const lastRef     = useRef(0);
    const particlesRef = useRef([]);
    const timersRef    = useRef([]);
    const [dissolving, setDissolving] = useState(false);
    const [hidden, setHidden]         = useState(false);

    const runCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const W = canvas.width  = window.innerWidth;
        const H = canvas.height = window.innerHeight;
        const cx = W / 2, cy = H / 2;

        // Init particles
        const count = 600;
        particlesRef.current = Array.from({ length: count }, (_, i) => new Dot(i, count, W, H, cx, cy));
        phaseRef.current = 'forming';
        startRef.current = performance.now();
        lastRef.current  = startRef.current;

        // Render loop
        const loop = (ts) => {
            const dt      = ts - lastRef.current;
            lastRef.current = ts;
            const elapsed = ts - startRef.current;
            const phase   = phaseRef.current;

            ctx.clearRect(0, 0, W, H);
            particlesRef.current.forEach(p => { p.update(elapsed, dt, phase); p.draw(ctx); });
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        // Forming → dissolving après 1.2s
        timersRef.current = [];
        const t1 = setTimeout(() => {
            setDissolving(true);
            phaseRef.current = 'dissolving';
            startRef.current = performance.now();

            // Fade out splash après 900ms
            const t2 = setTimeout(() => {
                cancelAnimationFrame(rafRef.current);
                onComplete();
                const t3 = setTimeout(() => setHidden(true), 700);
                timersRef.current.push(t3);
            }, 900);
            timersRef.current.push(t2);
        }, 1200);
        timersRef.current.push(t1);
    }, [onComplete]);

    useEffect(() => {
        runCanvas();
        return () => {
            cancelAnimationFrame(rafRef.current);
            timersRef.current.forEach(clearTimeout);
        };
    }, [runCanvas]);

    if (hidden) return null;

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#000",
            opacity: hidden ? 0 : 1,
            transition: "opacity 0.7s ease",
            pointerEvents: "all",
        }}>
            <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }} />

            {/* Logo + Nom */}
            <motion.div
                ref={logoRef}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    position: "fixed", inset: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: "18px", zIndex: 10000,
                    opacity: dissolving ? 0 : 1,
                    filter: dissolving ? "blur(10px)" : "none",
                    transform: dissolving ? "scale(1.1)" : "scale(1)",
                    transition: "opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease",
                }}
            >
                <motion.img
                    src={logoBlanc}
                    alt="NOVYXS"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ width: "90px", height: "90px", objectFit: "contain" }}
                />
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
                    style={{
                        fontSize: "44px", fontWeight: "700",
                        letterSpacing: "0.18em", color: "#ffffff",
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    NOVYXS
                </motion.div>
            </motion.div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER ANIMÉ
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedDivider() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <div ref={ref} style={{ width: "100%", height: "1px", overflow: "hidden" }}>
            <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                    transformOrigin: "left",
                }}
            />
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOVER CARD
// ─────────────────────────────────────────────────────────────────────────────
function HoverCard({ icon, title, desc, compact = false }) {
    const [hovered, setHovered] = useState(false);
    const isHero    = compact === "hero";
    const isCompact = compact === true;

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
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", marginBottom: "10px" }}>{icon}</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginBottom: "3px" }}>{title}</div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", lineHeight: "1.4" }}>{desc}</div>
                </>
            ) : isCompact ? (
                <>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 }}>{icon}</div>
                    <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.88)" }}>{title}</span>
                </>
            ) : (
                <>
                    <div style={{ fontSize: "28px", marginBottom: "16px" }}>{icon}</div>
                    <h3 style={t.cardTitle}>{title}</h3>
                    <p style={{ ...t.body, margin: 0, fontSize: "15px" }}>{desc}</p>
                </>
            )}
        </motion.div>
    );
}


// ─────────────────────────────────────────────────────────────────────────────
// PAGE LÉGALE — réutilisable pour Confidentialité et Mentions légales
// ─────────────────────────────────────────────────────────────────────────────
function LegalPage({ title, lastUpdate, sections, onBack, logoSrc }) {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
            {/* Navbar simple */}
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: "68px", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={onBack}>
                    <img src={logoSrc} alt="Novyxs" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                    <span style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "0.14em", color: "#fff" }}>NOVYXS</span>
                </div>
                <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "#fff", padding: "8px 20px", borderRadius: "999px", fontSize: "14px", cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                    ← Retour
                </button>
            </div>

            {/* Contenu */}
            <div style={{ maxWidth: "780px", margin: "0 auto", padding: "120px 24px 80px" }}>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <p style={{ fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "16px" }}>
                        Dernière mise à jour : {lastUpdate}
                    </p>
                    <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "700", letterSpacing: "-0.03em", marginBottom: "48px", lineHeight: 1.1 }}>
                        {title}
                    </h1>

                    {sections.map((section, i) => (
                        <div key={i} style={{ marginBottom: "48px" }}>
                            {/* Divider */}
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

            {/* Footer simple */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>© 2026 NOVYXS — Tous droits réservés</p>
            </div>
        </div>
    );
}

// Données Confidentialité
const confidentialiteData = {
    title: "Politique de confidentialité",
    lastUpdate: "5 mai 2026",
    sections: [
        {
            title: "1. Qui sommes-nous ?",
            content: (<>
                <p>NOVYXS est une entreprise spécialisée dans les solutions de chatbot IA pour entreprises, dont le siège social est situé à Delson, Québec, Canada.</p>
                <p style={{marginTop:"10px"}}>Site web : <span style={{color:"#fff"}}>https://www.novyxs.com</span><br/>Email : <span style={{color:"#fff"}}>admin@novyxs.com</span></p>
            </>)
        },
        {
            title: "2. Quelles données collectons-nous ?",
            content: (<>
                <p style={{fontWeight:600, color:"#fff", marginBottom:"8px"}}>Via Google Analytics</p>
                <p>Lorsque vous visitez notre site, Google Analytics collecte automatiquement : votre adresse IP (anonymisée), votre pays et région, le type d'appareil et navigateur utilisé, les pages visitées et la durée de visite, et la source de votre visite. Ces données sont <strong style={{color:"#fff"}}>anonymes</strong> — nous ne pouvons pas identifier personnellement un visiteur.</p>
                <p style={{fontWeight:600, color:"#fff", margin:"16px 0 8px"}}>Via le chatbot</p>
                <p>Lorsque vous interagissez avec notre assistant, nous collectons les messages que vous envoyez et les informations que vous partagez volontairement (nom, email, besoins).</p>
                <p style={{fontWeight:600, color:"#fff", margin:"16px 0 8px"}}>Via le formulaire de contact</p>
                <p>Si vous nous contactez par email, nous collectons votre adresse email et les informations contenues dans votre message.</p>
            </>)
        },
        {
            title: "3. Pourquoi collectons-nous ces données ?",
            content: (<>
                <p>Nous collectons ces données pour comprendre le trafic et améliorer le site, répondre à vos demandes et qualifier vos besoins, et vous recontacter suite à une demande de démo.</p>
                <p style={{marginTop:"16px"}}>Nous ne vendons jamais vos données personnelles à des tiers à des fins publicitaires ou commerciales.</p>
                <p style={{marginTop:"12px"}}>Cependant, dans le cadre de notre service, <strong style={{color:"#fff"}}>les conversations tenues avec le chatbot sont transmises à l'entreprise cliente</strong> sur le site de laquelle le chatbot est installé. En interagissant avec le chatbot, vous acceptez que ces échanges soient partagés avec l'entreprise concernée.</p>
            </>)
        },
        {
            title: "4. Combien de temps conservons-nous vos données ?",
            content: (<>
                <p>Données Analytics : 26 mois (paramètre par défaut Google Analytics)</p>
                <p style={{marginTop:"8px"}}>Messages chatbot : 12 mois maximum</p>
                <p style={{marginTop:"8px"}}>Emails de contact : conservés tant que la relation commerciale est active</p>
            </>)
        },
        {
            title: "5. Vos droits",
            content: (<>
                <p>Conformément à la <strong style={{color:"#fff"}}>Loi 25 du Québec</strong>, vous avez le droit d'accéder à vos données, de les corriger, de les supprimer, et de retirer votre consentement à tout moment.</p>
                <p style={{marginTop:"12px"}}>Pour exercer ces droits : <strong style={{color:"#fff"}}>admin@novyxs.com</strong></p>
            </>)
        },
        {
            title: "6. Cookies",
            content: <p>Notre site utilise des cookies via Google Analytics pour mesurer l'audience. Vous pouvez les désactiver dans les paramètres de votre navigateur à tout moment.</p>
        },
        {
            title: "7. Sécurité",
            content: <p>Nous prenons des mesures raisonnables pour protéger vos informations contre tout accès non autorisé, modification ou divulgation.</p>
        },
        {
            title: "8. Contact",
            content: (<>
                <p>Pour toute question relative à cette politique :</p>
                <p style={{marginTop:"12px", color:"#fff", fontWeight:600}}>NOVYXS — Delson, Québec, Canada</p>
                <p>📧 admin@novyxs.com</p>
            </>)
        },
    ]
};

// Données Mentions légales
const mentionsLegalesData = {
    title: "Mentions légales",
    lastUpdate: "5 mai 2026",
    sections: [
        {
            title: "1. Éditeur du site",
            content: (<>
                <p style={{color:"#fff", fontWeight:600}}>NOVYXS</p>
                <p>Delson, Québec, Canada</p>
                <p>📧 admin@novyxs.com</p>
                <p>🌐 https://www.novyxs.com</p>
            </>)
        },
        {
            title: "2. Hébergement",
            content: (<>
                <p style={{color:"#fff", fontWeight:600}}>Vercel Inc.</p>
                <p>340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
                <p>🌐 https://vercel.com</p>
            </>)
        },
        {
            title: "3. Propriété intellectuelle",
            content: <p>L'ensemble du contenu de ce site (textes, images, logo, animations, code) est la propriété exclusive de NOVYXS et est protégé par les lois canadiennes sur le droit d'auteur. Toute reproduction sans autorisation écrite préalable est strictement interdite.</p>
        },
        {
            title: "4. Limitation de responsabilité",
            content: <p>NOVYXS s'efforce de maintenir les informations publiées sur ce site aussi précises et à jour que possible. NOVYXS ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site.</p>
        },
        {
            title: "5. Liens externes",
            content: <p>Ce site peut contenir des liens vers des sites tiers. NOVYXS n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>
        },
        {
            title: "6. Droit applicable",
            content: <p>Les présentes mentions légales sont régies par les lois de la province de Québec et les lois fédérales du Canada applicables.</p>
        },
        {
            title: "7. Contact",
            content: (<>
                <p>Pour toute question juridique ou administrative :</p>
                <p style={{marginTop:"12px", color:"#fff", fontWeight:600}}>NOVYXS — Delson, Québec, Canada</p>
                <p>📧 admin@novyxs.com</p>
            </>)
        },
    ]
};

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar() {
    const [scrolled, setScrolled]   = useState(false);
    const [menuOpen, setMenuOpen]   = useState(false);
    const [isMobile, setIsMobile]   = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        const onResize = () => setIsMobile(window.innerWidth < 768);
        onResize();
        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onResize);
        return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize); };
    }, []);

    const scrollTo = (id) => {
        setMenuOpen(false);
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 350);
    };

    const navLinks = [
        { label: "Solution", id: "solution" },
        { label: "Aperçu",   id: "apercu"   },
        { label: "Contact",  id: "cta"      },
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
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={logoBlanc} alt="Novyxs" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                    <span style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "0.14em", color: "#ffffff" }}>NOVYXS</span>
                </div>

                {!isMobile && (
                    <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
                        {navLinks.map(({ label, id }) => (
                            <button key={label} type="button" onClick={() => scrollTo(id)}
                                  style={{ background: "none", border: "none", padding: 0, fontFamily: "Inter, sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.52)", cursor: "pointer", transition: "color 0.2s", fontWeight: "500" }}
                                  onMouseEnter={(e) => (e.target.style.color = "#fff")}
                                  onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.52)")}
                            >{label}</button>
                        ))}
                        <button onClick={() => scrollTo("cta")}
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
                        {navLinks.map(({ label, id }) => (
                            <button key={label} onClick={() => scrollTo(id)}
                                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: "18px", fontWeight: "500", cursor: "pointer", textAlign: "left", padding: "14px 0", fontFamily: "Inter, sans-serif", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                            >{label}</button>
                        ))}
                        <button onClick={() => scrollTo("cta")}
                                style={{ marginTop: "16px", padding: "14px", background: "#ffffff", color: "#000", border: "none", borderRadius: "999px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                        >Demander une démo</button>
                    </div>
                </motion.div>
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
function App() {
    const [splashDone, setSplashDone] = useState(false);
    const [page, setPage] = useState('home'); // 'home' | 'confidentialite' | 'mentions'

    const faqItems = [
        { question: "Comment fonctionne votre chatbot ?",     user: "Comment fonctionne votre chatbot ?",     answer: "Il répond automatiquement aux visiteurs, guide la conversation, qualifie les demandes et aide votre entreprise à convertir plus de prospects." },
        { question: "Est-ce qu'il répond instantanément ?",   user: "Est-ce qu'il répond instantanément ?",   answer: "Oui. Il est conçu pour répondre immédiatement aux questions fréquentes et réduire la perte de visiteurs due à l'attente." },
        { question: "Peut-il récupérer des prospects ?",      user: "Peut-il récupérer des prospects ?",      answer: "Oui. Il peut collecter les informations importantes d'un prospect avant de transmettre une demande qualifiée à votre entreprise." },
        { question: "Est-ce qu'il s'adapte à mon entreprise ?", user: "Est-ce qu'il s'adapte à mon entreprise ?", answer: "Oui. Le chatbot peut être personnalisé selon votre activité, votre ton, vos services et votre manière de traiter les demandes." },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const sectionAnimation = {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.75, ease: "easeOut" },
    };

    const whiteBtn = {
        background: "#ffffff", color: "#000000", border: "none",
        padding: "15px 32px", borderRadius: "999px",
        fontSize: "15px", fontWeight: "600", cursor: "pointer",
        boxShadow: "0 10px 40px rgba(255,255,255,0.12)", transition: "all 0.3s ease",
    };

    const darkBtn = {
        background: "transparent", color: "#ffffff",
        border: "1px solid rgba(255,255,255,0.18)",
        padding: "15px 32px", borderRadius: "999px",
        fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease",
    };

    const hoverIn  = (e) => { e.currentTarget.style.transform = "scale(1.04)"; };
    const hoverOut = (e) => { e.currentTarget.style.transform = "scale(1)"; };

    const solutionItems = [
        { icon: "⚡", label: "Réponses immédiates aux visiteurs" },
        { icon: "🎯", label: "Qualification automatique des prospects" },
        { icon: "🕐", label: "Présence continue 24/7" },
        { icon: "✦",  label: "Image moderne et haut de gamme" },
    ];

    // Afficher pages légales si demandé
    if (page === 'confidentialite') {
        return <LegalPage {...confidentialiteData} logoSrc={logoBlanc} onBack={() => { setPage('home'); window.scrollTo(0,0); }} />;
    }
    if (page === 'mentions') {
        return <LegalPage {...mentionsLegalesData} logoSrc={logoBlanc} onBack={() => { setPage('home'); window.scrollTo(0,0); }} />;
    }

    return (
        <>
            {/* Splash — affiché jusqu'à onComplete */}
            {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}

            <Navbar />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: splashDone ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh", width: "100%", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}
            >
                <Suspense fallback={null}>
                    <Background3D />
                </Suspense>

                {/* Glows */}
                <div style={{ position: "absolute", top: "-180px", left: "50%", transform: "translateX(-50%)", width: "1100px", height: "1100px", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 30%, rgba(0,0,0,0) 68%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "120px", right: "-180px", width: "480px", height: "480px", borderRadius: "999px", background: "radial-gradient(circle, rgba(100,120,255,0.18) 0%, rgba(100,120,255,0.05) 42%, rgba(0,0,0,0) 72%)", filter: "blur(28px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "620px", left: "-180px", width: "420px", height: "420px", borderRadius: "999px", background: "radial-gradient(circle, rgba(0,255,200,0.15) 0%, rgba(0,255,200,0.04) 40%, rgba(0,0,0,0) 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

                <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 24px 120px", position: "relative", zIndex: 1, boxSizing: "border-box" }}>

                    {/* ── HERO ── */}
                    <motion.section
                        initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{ textAlign: "center", paddingTop: "clamp(100px, 15vw, 160px)", paddingBottom: "80px", minHeight: "78vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.6 }}
                            style={{ display: "inline-block", alignSelf: "center", padding: "9px 22px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff", marginBottom: "32px", boxShadow: "0 0 18px rgba(255,255,255,0.12), 0 0 40px rgba(255,255,255,0.06), inset 0 0 14px rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
                        >
                            IA conversationnelle pour entreprises
                        </motion.div>

                        <h1 style={{ ...t.h1, maxWidth: "900px", margin: "0 auto", fontSize: "clamp(30px, 8vw, 62px)" }}>
                            Transformez chaque visite<br />en opportunité.
                        </h1>

                        <p style={{ ...t.body, maxWidth: "600px", margin: "28px auto 0" }}>
                            Novyxs aide les entreprises à capter plus de prospects avec un chatbot moderne, rapide et professionnel.
                        </p>

                        <div style={{ marginTop: "40px" }}>
                            <button style={whiteBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                    onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}>
                                Découvrir Novyxs
                            </button>
                        </div>

                        <div style={{ marginTop: "48px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", maxWidth: "960px", width: "100%", marginInline: "auto" }}>
                            {[
                                { icon: "⚡", label: "Réponses instantanées", desc: "Moins de 2 secondes" },
                                { icon: "✦",  label: "Image premium",         desc: "À votre image de marque" },
                                { icon: "🎯", label: "Qualification",          desc: "Leads chauds uniquement" },
                                { icon: "🕐", label: "Présence 24/7",          desc: "Jamais hors-ligne" },
                            ].map(({ icon, label, desc }) => (
                                <HoverCard key={label} icon={icon} title={label} desc={desc} compact="hero" />
                            ))}
                        </div>
                    </motion.section>

                    <AnimatedDivider />

                    {/* ── PROBLÈME ── */}
                    <motion.section {...sectionAnimation} style={{ paddingTop: "80px", paddingBottom: "100px" }}>
                        <p style={{ ...t.label, marginBottom: "16px" }}>Le problème</p>
                        <h2 style={{ ...t.h2, maxWidth: "820px", margin: "0 0 48px 0" }}>
                            Les entreprises perdent des clients quand elles répondent trop tard.
                        </h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                            <HoverCard icon="⏱" title="Réponses trop lentes"       desc="Quand un visiteur pose une question et n'obtient pas une réponse immédiate, il quitte souvent le site." />
                            <HoverCard icon="💸" title="Prospects perdus"           desc="Chaque question ignorée peut représenter une vente ou un rendez-vous manqué." />
                            <HoverCard icon="🌑" title="Pas de présence continue"   desc="Une équipe humaine ne peut pas répondre 24/7 avec la même vitesse et la même constance." />
                        </div>
                    </motion.section>

                    <AnimatedDivider />

                    {/* ── SOLUTION ── */}
                    <motion.section id="solution" {...sectionAnimation} style={{ paddingTop: "80px", paddingBottom: "100px" }}>
                        <p style={{ ...t.label, marginBottom: "16px" }}>La solution</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", alignItems: "center" }}>
                            <div>
                                <h2 style={{ ...t.h2, margin: "0 0 22px 0", maxWidth: "600px" }}>
                                    Un chatbot professionnel qui répond instantanément et inspire confiance.
                                </h2>
                                <p style={{ ...t.body, maxWidth: "580px", margin: 0 }}>
                                    Novyxs propose un assistant conversationnel moderne capable de répondre aux questions, guider les visiteurs, qualifier les demandes et transformer plus de trafic en clients.
                                </p>
                            </div>
                            <div style={{ display: "grid", gap: "12px" }}>
                                <p style={{ ...t.label, marginBottom: "4px" }}>Ce que le chatbot apporte</p>
                                {solutionItems.map(({ icon, label }) => (
                                    <HoverCard key={label} icon={icon} title={label} compact />
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <AnimatedDivider />

                    {/* ── APERÇU CHATBOT ── */}
                    <motion.section id="apercu" {...sectionAnimation} style={{ paddingTop: "80px", paddingBottom: "110px" }}>
                        <p style={{ ...t.label, marginBottom: "16px" }}>Aperçu du chatbot</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "34px", alignItems: "center" }}>
                            <div>
                                <h2 style={{ ...t.h2, margin: "0 0 20px 0", maxWidth: "580px" }}>
                                    Une expérience simple, rassurante et pensée pour convertir.
                                </h2>
                                <p style={{ ...t.body, margin: "0 0 28px 0", maxWidth: "560px" }}>
                                    Le visiteur comprend immédiatement la valeur, pose sa question, reçoit une réponse claire et avance naturellement vers la prise de contact.
                                </p>
                                <div style={{ display: "grid", gap: "12px", maxWidth: "560px" }}>
                                    {faqItems.map((item, index) => (
                                        <button key={item.question} onClick={() => setActiveIndex(index)}
                                                style={{
                                                    textAlign: "left",
                                                    border: activeIndex === index ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.08)",
                                                    borderRadius: "16px", padding: "16px 20px",
                                                    background: activeIndex === index ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                                                    color: "#ffffff", backdropFilter: "blur(10px)",
                                                    cursor: "pointer", fontSize: "15px",
                                                    fontFamily: "Inter, sans-serif", transition: "all 0.25s ease",
                                                }}
                                        >{item.question}</button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "28px", padding: "24px", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                                    <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.32)" }} />
                                    <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.2)" }} />
                                    <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.12)" }} />
                                    <span style={{ marginLeft: "10px", ...t.label }}>Assistant Novyxs</span>
                                </div>
                                <div style={{ display: "grid", gap: "14px" }}>
                                    <div style={{ maxWidth: "78%", padding: "13px 16px", borderRadius: "18px 18px 18px 6px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.92)", lineHeight: "1.7", fontSize: "15px" }}>
                                        Bonjour 👋 Comment puis-je vous aider aujourd'hui ?
                                    </div>
                                    <div style={{ maxWidth: "75%", marginLeft: "auto", padding: "13px 16px", borderRadius: "18px 18px 6px 18px", background: "#ffffff", color: "#000000", lineHeight: "1.7", fontSize: "15px" }}>
                                        {faqItems[activeIndex].user}
                                    </div>
                                    <div style={{ maxWidth: "82%", padding: "13px 16px", borderRadius: "18px 18px 18px 6px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.92)", lineHeight: "1.7", fontSize: "15px" }}>
                                        {faqItems[activeIndex].answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <AnimatedDivider />

                    {/* ── CTA ── */}
                    <motion.section {...sectionAnimation} id="cta" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
                        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "32px", padding: "72px 40px", textAlign: "center", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))", boxShadow: "0 20px 80px rgba(0,0,0,0.45)" }}>
                            <p style={{ ...t.label, marginBottom: "18px" }}>Demander une démo</p>
                            <h2 style={{ ...t.h2, maxWidth: "820px", margin: "0 auto 20px", fontSize: "clamp(34px, 4vw, 52px)" }}>
                                Donnez à votre entreprise une image plus moderne, plus rapide et plus crédible.
                            </h2>
                            <p style={{ ...t.body, maxWidth: "640px", margin: "0 auto 36px" }}>
                                Nous installons un chatbot adapté à votre activité pour mieux accueillir vos visiteurs et convertir plus de demandes en clients.
                            </p>
                            <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
                                <button style={whiteBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                        onClick={() => { window.location.href = "mailto:contact@novyxs.com"; }}>
                                    Demander une démo
                                </button>
                                <button style={darkBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                        onClick={() => { window.location.href = "mailto:contact@novyxs.com"; }}>
                                    Prendre contact
                                </button>
                            </div>
                        </div>
                    </motion.section>
                </div>

                {/* ── FOOTER ── */}
                <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.07)", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", maxWidth: "1440px", margin: "0 auto", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={logoBlanc} alt="Novyxs" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
                        <span style={{ fontSize: "15px", fontWeight: "700", letterSpacing: "0.14em", color: "#ffffff" }}>NOVYXS</span>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", margin: 0 }}>© 2026 NOVYXS — Tous droits réservés</p>
                    <div style={{ display: "flex", gap: "24px" }}>
                        {[
                            { label: "Confidentialité",  action: () => { setPage('confidentialite'); window.scrollTo(0,0); } },
                            { label: "Mentions légales", action: () => { setPage('mentions'); window.scrollTo(0,0); } },
                            { label: "Contact", action: () => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }) },
                        ].map(({ label, action }) => (
                            <button key={label} type="button" onClick={action}
                                  style={{ background: "none", border: "none", padding: 0, fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.38)", cursor: "pointer", transition: "color 0.2s" }}
                                  onMouseEnter={(e) => (e.target.style.color = "rgba(255,255,255,0.75)")}
                                  onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.38)")}
                            >{label}</button>
                        ))}
                    </div>
                </footer>
            </motion.div>
        </>
    );
}

export default App;