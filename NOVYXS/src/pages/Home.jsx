import { motion } from "framer-motion";
import AnimatedDivider from "../components/AnimatedDivider";
import ProjectCard from "../components/ProjectCard";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { projects } from "../data/projects";
import { t, sectionAnimation, whiteBtn, darkBtn, hoverIn, hoverOut } from "../theme";

export default function Home() {
    useDocumentMeta(
        "NOVYXS — Studio de développement web, applications & solutions sur mesure",
        "Novyxs conçoit des sites web, applications et web apps sur mesure pour des entreprises qui veulent se démarquer. Découvrez nos projets : Chatbot IA, SecuReport."
    );

    const services = [
        { icon: "🌐", title: "Sites web sur mesure",           desc: "Des sites rapides, modernes et conçus pour convertir, pensés pour votre image de marque plutôt que pour un modèle générique." },
        { icon: "📱", title: "Applications web & mobiles",     desc: "Des applications pensées pour vos utilisateurs, du prototype au produit en production." },
        { icon: "⚙️", title: "Logiciels métier sur mesure",    desc: "Des outils internes sur mesure pour automatiser vos processus et faire gagner du temps à vos équipes." },
        { icon: "🤖", title: "Intelligence artificielle",       desc: "Chatbots, automatisations et assistants IA intégrés à votre activité." },
    ];

    return (
        <>
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
                    Studio de développement web & logiciel
                </motion.div>

                <h1 style={{ ...t.h1, maxWidth: "920px", margin: "0 auto", fontSize: "clamp(30px, 8vw, 62px)" }}>
                    On construit les outils numériques<br />dont votre entreprise a besoin.
                </h1>

                <p style={{ ...t.body, maxWidth: "620px", margin: "28px auto 0" }}>
                    Novyxs conçoit des sites web, applications et solutions logicielles sur mesure — de l'idée au déploiement, pensés pour votre réalité, pas pour un modèle générique.
                </p>

                <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
                    <button style={whiteBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                            onClick={() => document.getElementById("projets")?.scrollIntoView({ behavior: "smooth" })}>
                        Voir nos projets
                    </button>
                    <button style={darkBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                            onClick={() => { window.location.href = "mailto:contact@novyxs.com"; }}>
                        Nous contacter
                    </button>
                </div>

                <p style={{ marginTop: "56px", fontSize: "13px", letterSpacing: "0.04em", color: "rgba(255,255,255,0.4)" }}>
                    Sur mesure &nbsp;·&nbsp; Rapide à déployer &nbsp;·&nbsp; Pensé pour évoluer &nbsp;·&nbsp; Basé à Delson, Québec
                </p>
            </motion.section>

            <AnimatedDivider />

            {/* ── CE QU'ON FAIT — liste numérotée éditoriale ── */}
            <motion.section {...sectionAnimation} style={{ paddingTop: "80px", paddingBottom: "100px" }}>
                <p style={{ ...t.label, marginBottom: "16px" }}>Ce qu'on fait</p>
                <h2 style={{ ...t.h2, maxWidth: "820px", margin: "0 0 56px 0" }}>
                    Du site vitrine à l'application complète, sur toute la chaîne du sur-mesure.
                </h2>
                <div>
                    {services.map(({ icon, title, desc }, i) => (
                        <div key={title} style={{
                            display: "grid", gridTemplateColumns: "80px 1fr", gap: "24px", alignItems: "start",
                            padding: "32px 0",
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                            borderBottom: i === services.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                        }}>
                            <span style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: "650", letterSpacing: "-0.02em", color: "rgba(255,255,255,0.18)" }}>
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", alignItems: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                                    <span style={{ fontSize: "22px" }}>{icon}</span>
                                    <h3 style={{ ...t.cardTitle, margin: 0 }}>{title}</h3>
                                </div>
                                <p style={{ ...t.body, margin: 0, fontSize: "15px", maxWidth: "480px" }}>{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            <AnimatedDivider />

            {/* ── NOS PROJETS ── */}
            <motion.section id="projets" {...sectionAnimation} style={{ paddingTop: "80px", paddingBottom: "110px" }}>
                <p style={{ ...t.label, marginBottom: "16px" }}>Nos projets</p>
                <h2 style={{ ...t.h2, maxWidth: "700px", margin: "0 0 48px 0" }}>
                    Ce qu'on a construit récemment.
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
                    {projects.map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))}
                </div>
            </motion.section>

            <AnimatedDivider />

            {/* ── CTA ── */}
            <motion.section {...sectionAnimation} id="cta" style={{ paddingTop: "80px", paddingBottom: "60px" }}>
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: "32px", padding: "72px 40px", textAlign: "center", background: "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))", boxShadow: "0 20px 80px rgba(0,0,0,0.45)" }}>
                    <p style={{ ...t.label, marginBottom: "18px" }}>Discutons de votre projet</p>
                    <h2 style={{ ...t.h2, maxWidth: "820px", margin: "0 auto 20px", fontSize: "clamp(34px, 4vw, 52px)" }}>
                        Une idée de site, d'application ou d'outil sur mesure ?
                    </h2>
                    <p style={{ ...t.body, maxWidth: "640px", margin: "0 auto 36px" }}>
                        Parlons de votre projet et voyons comment on peut le transformer en outil numérique concret, rapide et fiable.
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
                        <button style={whiteBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                onClick={() => { window.location.href = "mailto:contact@novyxs.com"; }}>
                            Nous contacter
                        </button>
                        <button style={darkBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                onClick={() => document.getElementById("projets")?.scrollIntoView({ behavior: "smooth" })}>
                            Voir nos projets
                        </button>
                    </div>
                </div>
            </motion.section>
        </>
    );
}
