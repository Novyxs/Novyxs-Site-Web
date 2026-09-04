import { motion } from "framer-motion";
import AnimatedDivider from "../components/AnimatedDivider";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { t, sectionAnimation, whiteBtn, darkBtn, hoverIn, hoverOut } from "../theme";

function StatusPill({ tone, children }) {
    const palette = tone === "warn"
        ? { color: "#ffd27e", bg: "rgba(255,178,0,0.1)", border: "rgba(255,178,0,0.28)" }
        : { color: "#7effc0", bg: "rgba(0,255,170,0.1)", border: "rgba(0,255,170,0.25)" };
    return (
        <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.03em", color: palette.color, background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: "999px", padding: "4px 10px", whiteSpace: "nowrap" }}>
            {children}
        </span>
    );
}

export default function SecuReportProject() {
    useDocumentMeta(
        "SecuReport — La sécurité de votre bâtiment, digitalisée",
        "SecuReport transforme la gestion des incidents et des rondes de sécurité en une plateforme numérique simple, sécurisée et pensée pour l'immobilier résidentiel haut de gamme."
    );

    const consoleRows = [
        { icon: "📝", label: "Rapport #248 — Fuite d'eau, étage 3", status: "En traitement", tone: "warn" },
        { icon: "🚶", label: "Ronde 18h — Tour Le Delson",          status: "Complétée",     tone: "ok" },
        { icon: "🔐", label: "Accès Porte Sud — J. Tremblay",       status: "Vérifié",       tone: "ok" },
        { icon: "💬", label: "Message → Équipe de nuit",            status: "Lu",            tone: "ok" },
    ];

    const comparison = {
        before: [
            "Rapports papier lents à remplir",
            "Aucun statut, aucune traçabilité",
            "Photos et vidéos déconnectées du rapport",
            "Vue d'ensemble impossible",
        ],
        after: [
            "Rapports numériques en quelques secondes",
            "Statut en temps réel, nouveau → résolu",
            "Photos et vidéos jointes directement",
            "Vue centralisée, multi-bâtiments",
        ],
    };

    const features = [
        { icon: "📝", title: "Rapports d'incidents numériques", desc: "Rédaction rapide, photos et vidéos jointes directement au rapport, suivi de statut en temps réel." },
        { icon: "🚶", title: "Rondes de sécurité structurées",  desc: "Listes de vérification personnalisables par bâtiment, notes d'agents, historique complet et consultable en tout temps." },
        { icon: "💬", title: "Messagerie interne",              desc: "Communication directe entre agents et gestion, avec accusés de lecture — plus besoin de courriels éparpillés." },
        { icon: "🏢", title: "Gestion multi-bâtiments",         desc: "Une seule plateforme pour superviser plusieurs immeubles, avec des accès et des données isolées par bâtiment." },
        { icon: "🔐", title: "Sécurité de niveau professionnel", desc: "Authentification à deux facteurs, permissions strictes selon les rôles, journal d'audit complet." },
        { icon: "👤", title: "Rôles adaptés à chaque utilisateur", desc: "Agent de sécurité, gestionnaire, administrateur : chacun voit exactement ce dont il a besoin." },
    ];

    return (
        <>
            {/* ── HERO — aligné à gauche, console de sécurité à droite ── */}
            <motion.section
                initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ paddingTop: "clamp(120px, 16vw, 180px)", paddingBottom: "100px", minHeight: "78vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "40px", alignItems: "center" }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(0,255,200,0.1)", border: "1px solid rgba(0,255,200,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                                🛡️
                            </div>
                            <span style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "0.08em", color: "#fff" }}>SecuReport</span>
                            <span style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "#7effc0", background: "rgba(0,255,170,0.08)", border: "1px solid rgba(0,255,170,0.25)", borderRadius: "999px", padding: "4px 10px" }}>
                                Bientôt disponible
                            </span>
                        </div>

                        <h1 style={{ ...t.h1, maxWidth: "560px", fontSize: "clamp(30px, 6vw, 54px)" }}>
                            La sécurité de votre bâtiment, digitalisée.
                        </h1>

                        <p style={{ ...t.body, maxWidth: "480px", margin: "24px 0 0" }}>
                            Fini les rapports papier perdus, illisibles ou introuvables. SecuReport centralise la gestion des incidents et des rondes de sécurité dans une plateforme pensée pour l'immobilier résidentiel haut de gamme.
                        </p>

                        <div style={{ marginTop: "36px" }}>
                            <button style={whiteBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                    onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}>
                                Rejoindre l'accès anticipé
                            </button>
                        </div>
                    </div>

                    {/* Console — mockup produit, avec un glow teal discret derrière */}
                    <div style={{ position: "relative" }}>
                        <div style={{ position: "absolute", top: "-60px", right: "-40px", width: "300px", height: "300px", borderRadius: "999px", background: "radial-gradient(circle, rgba(0,255,200,0.18) 0%, rgba(0,255,200,0.05) 45%, rgba(0,0,0,0) 72%)", filter: "blur(22px)", pointerEvents: "none" }} aria-hidden="true" />
                        <div style={{ position: "relative", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "28px", padding: "24px", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                                <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#00ffc8" }} />
                                <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.2)" }} />
                                <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "rgba(255,255,255,0.12)" }} />
                                <span style={{ marginLeft: "10px", ...t.label }}>Activité récente</span>
                            </div>
                            <div style={{ display: "grid", gap: "10px" }}>
                                {consoleRows.map(({ icon, label, status, tone }) => (
                                    <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 14px", borderRadius: "14px", background: "rgba(255,255,255,0.04)" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.88)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            <span style={{ flexShrink: 0 }}>{icon}</span><span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                                        </span>
                                        <span style={{ flexShrink: 0 }}><StatusPill tone={tone}>{status}</StatusPill></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            <AnimatedDivider />

            {/* ── AVANT / APRÈS — fusion problème + solution ── */}
            <motion.section {...sectionAnimation} style={{ paddingTop: "80px", paddingBottom: "100px" }}>
                <p style={{ ...t.label, marginBottom: "16px" }}>Avant / après</p>
                <h2 style={{ ...t.h2, maxWidth: "720px", margin: "0 0 20px 0" }}>
                    Fini les rapports papier.
                </h2>
                <p style={{ ...t.body, maxWidth: "620px", margin: "0 0 48px 0" }}>
                    SecuReport centralise toute l'activité de sécurité d'un bâtiment — ou de tout un portefeuille de bâtiments — dans une seule plateforme web accessible en tout temps.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                    <div style={{ border: "1px solid rgba(255,80,80,0.18)", borderRadius: "24px", padding: "32px", background: "rgba(255,80,80,0.04)" }}>
                        <p style={{ ...t.label, marginBottom: "20px", color: "rgba(255,140,140,0.7)" }}>Avant</p>
                        <div style={{ display: "grid", gap: "16px" }}>
                            {comparison.before.map((line) => (
                                <div key={line} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "rgba(255,120,120,0.8)", fontSize: "15px", lineHeight: "1.6" }}>✕</span>
                                    <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: "1.6" }}>{line}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ border: "1px solid rgba(0,255,170,0.2)", borderRadius: "24px", padding: "32px", background: "rgba(0,255,170,0.04)" }}>
                        <p style={{ ...t.label, marginBottom: "20px", color: "#7effc0" }}>Avec SecuReport</p>
                        <div style={{ display: "grid", gap: "16px" }}>
                            {comparison.after.map((line) => (
                                <div key={line} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                    <span style={{ color: "#7effc0", fontSize: "15px", lineHeight: "1.6" }}>✓</span>
                                    <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.9)", lineHeight: "1.6" }}>{line}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            <AnimatedDivider />

            {/* ── FONCTIONNALITÉS CLÉS — lignes alternées ── */}
            <motion.section {...sectionAnimation} style={{ paddingTop: "80px", paddingBottom: "100px" }}>
                <p style={{ ...t.label, marginBottom: "16px" }}>Fonctionnalités clés</p>
                <h2 style={{ ...t.h2, maxWidth: "700px", margin: "0 0 24px 0" }}>
                    Tout ce qu'il faut pour professionnaliser la sécurité de vos bâtiments.
                </h2>
                <div>
                    {features.map(({ icon, title, desc }, i) => {
                        const reversed = i % 2 === 1;
                        return (
                            <div key={title} style={{
                                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", alignItems: "center",
                                padding: "28px 0",
                                borderTop: "1px solid rgba(255,255,255,0.08)",
                                borderBottom: i === features.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                            }}>
                                <div style={{ order: reversed ? 2 : 1, display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(0,255,200,0.1)", border: "1px solid rgba(0,255,200,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                                        {icon}
                                    </div>
                                    <h3 style={{ ...t.cardTitle, margin: 0 }}>{title}</h3>
                                </div>
                                <p style={{ order: reversed ? 1 : 2, ...t.body, margin: 0, fontSize: "15px", maxWidth: "480px" }}>
                                    {desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </motion.section>

            <AnimatedDivider />

            {/* ── POUR QUI / MODÈLE ── */}
            <motion.section {...sectionAnimation} style={{ paddingTop: "80px", paddingBottom: "110px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", alignItems: "center" }}>
                    <div>
                        <p style={{ ...t.label, marginBottom: "16px" }}>Pour qui</p>
                        <h2 style={{ ...t.h2, margin: "0 0 22px 0", maxWidth: "560px" }}>
                            Pensé pour les gestionnaires immobiliers et copropriétés.
                        </h2>
                        <p style={{ ...t.body, maxWidth: "560px", margin: 0 }}>
                            SecuReport est conçu pour les compagnies de gestion immobilière et les copropriétés qui veulent professionnaliser et centraliser la sécurité de leurs bâtiments résidentiels.
                        </p>
                    </div>
                    <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
                        <p style={{ ...t.label, marginBottom: "16px" }}>Modèle</p>
                        <h3 style={{ ...t.cardTitle, fontSize: "24px" }}>Abonnement mensuel simple</h3>
                        <p style={{ ...t.body, margin: 0, fontSize: "15px" }}>
                            Sans engagement à long terme, avec une tarification adaptée selon le nombre de bâtiments couverts.
                        </p>
                    </div>
                </div>
            </motion.section>

            <AnimatedDivider />

            {/* ── CTA ── */}
            <motion.section {...sectionAnimation} id="cta" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "32px", padding: "72px 40px", textAlign: "center", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))", boxShadow: "0 20px 80px rgba(0,0,0,0.45)" }}>
                    <p style={{ ...t.label, marginBottom: "18px" }}>Accès anticipé</p>
                    <h2 style={{ ...t.h2, maxWidth: "820px", margin: "0 auto 20px", fontSize: "clamp(34px, 4vw, 52px)" }}>
                        Soyez parmi les premiers à digitaliser la sécurité de vos bâtiments.
                    </h2>
                    <p style={{ ...t.body, maxWidth: "640px", margin: "0 auto 36px" }}>
                        SecuReport arrive bientôt. Laissez-nous vos coordonnées pour être informé du lancement et obtenir un accès prioritaire.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
                        <button style={whiteBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                onClick={() => { window.location.href = "mailto:contact@novyxs.com?subject=SecuReport%20—%20Accès%20anticipé"; }}>
                            Rejoindre l'accès anticipé
                        </button>
                        <button style={darkBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                onClick={() => { window.location.href = "mailto:contact@novyxs.com?subject=SecuReport%20—%20Question"; }}>
                            Poser une question
                        </button>
                    </div>
                </div>
            </motion.section>
        </>
    );
}
