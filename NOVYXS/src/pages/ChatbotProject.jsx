import { useState } from "react";
import { motion } from "framer-motion";
import HoverCard from "../components/HoverCard";
import AnimatedDivider from "../components/AnimatedDivider";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { t, sectionAnimation, whiteBtn, darkBtn, hoverIn, hoverOut } from "../theme";

export default function ChatbotProject() {
    useDocumentMeta(
        "Chatbot IA — NOVYXS",
        "Novyxs aide les entreprises à capter plus de prospects avec un chatbot conversationnel moderne, rapide et professionnel. Disponible 24h/24, 7j/7."
    );

    const faqItems = [
        { question: "Comment fonctionne votre chatbot ?",     user: "Comment fonctionne votre chatbot ?",     answer: "Il répond automatiquement aux visiteurs, guide la conversation, qualifie les demandes et aide votre entreprise à convertir plus de prospects." },
        { question: "Est-ce qu'il répond instantanément ?",   user: "Est-ce qu'il répond instantanément ?",   answer: "Oui. Il est conçu pour répondre immédiatement aux questions fréquentes et réduire la perte de visiteurs due à l'attente." },
        { question: "Peut-il récupérer des prospects ?",      user: "Peut-il récupérer des prospects ?",      answer: "Oui. Il peut collecter les informations importantes d'un prospect avant de transmettre une demande qualifiée à votre entreprise." },
        { question: "Est-ce qu'il s'adapte à mon entreprise ?", user: "Est-ce qu'il s'adapte à mon entreprise ?", answer: "Oui. Le chatbot peut être personnalisé selon votre activité, votre ton, vos services et votre manière de traiter les demandes." },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const solutionItems = [
        { icon: "⚡", label: "Réponses immédiates aux visiteurs" },
        { icon: "🎯", label: "Qualification automatique des prospects" },
        { icon: "🕐", label: "Présence continue 24/7" },
        { icon: "✦",  label: "Image moderne et haut de gamme" },
    ];

    return (
        <>
            {/* ── HERO — aligné à gauche, le robot 3D occupe la droite ── */}
            <motion.section
                initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ paddingTop: "clamp(120px, 16vw, 180px)", paddingBottom: "100px", minHeight: "78vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}
            >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", alignItems: "center" }}>
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.6 }}
                            style={{ display: "inline-block", padding: "9px 22px", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)", fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#ffffff", marginBottom: "32px", boxShadow: "0 0 18px rgba(255,255,255,0.12), 0 0 40px rgba(255,255,255,0.06), inset 0 0 14px rgba(255,255,255,0.04)", backdropFilter: "blur(8px)" }}
                        >
                            IA conversationnelle pour entreprises
                        </motion.div>

                        <h1 style={{ ...t.h1, maxWidth: "560px", fontSize: "clamp(30px, 6vw, 58px)" }}>
                            Transformez chaque visite en opportunité.
                        </h1>

                        <p style={{ ...t.body, maxWidth: "480px", margin: "24px 0 0" }}>
                            Novyxs aide les entreprises à capter plus de prospects avec un chatbot moderne, rapide et professionnel.
                        </p>

                        <div style={{ marginTop: "36px" }}>
                            <button style={whiteBtn} onMouseEnter={hoverIn} onMouseLeave={hoverOut}
                                    onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}>
                                Découvrir Novyxs
                            </button>
                        </div>
                    </div>

                    {/* Glow bleu discret — apporte un peu de couleur à droite du hero */}
                    <div style={{ position: "relative", minHeight: "1px" }} aria-hidden="true">
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "460px", height: "460px", maxWidth: "90%", borderRadius: "999px", background: "radial-gradient(circle, rgba(100,120,255,0.22) 0%, rgba(100,120,255,0.08) 45%, rgba(0,0,0,0) 72%)", filter: "blur(20px)" }} />
                        <div style={{ position: "absolute", top: "58%", left: "62%", width: "220px", height: "220px", borderRadius: "999px", background: "radial-gradient(circle, rgba(0,255,200,0.16) 0%, rgba(0,255,200,0.04) 50%, rgba(0,0,0,0) 72%)", filter: "blur(18px)" }} />
                    </div>
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
                    <HoverCard accent="#6478ff" icon="⏱" title="Réponses trop lentes"       desc="Quand un visiteur pose une question et n'obtient pas une réponse immédiate, il quitte souvent le site." />
                    <HoverCard accent="#6478ff" icon="💸" title="Prospects perdus"           desc="Chaque question ignorée peut représenter une vente ou un rendez-vous manqué." />
                    <HoverCard accent="#6478ff" icon="🌑" title="Pas de présence continue"   desc="Une équipe humaine ne peut pas répondre 24/7 avec la même vitesse et la même constance." />
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
                            <HoverCard key={label} accent="#6478ff" icon={icon} title={label} compact />
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
                            <div style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#6478ff" }} />
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
        </>
    );
}
