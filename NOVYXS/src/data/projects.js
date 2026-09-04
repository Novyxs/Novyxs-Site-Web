// Source unique pour la section "Nos projets" de la page d'accueil.
// Ajouter un projet = une entrée ici, pas de nouveau JSX.
export const projects = [
    {
        id: "chatbot",
        name: "Chatbot IA",
        tagline: "Assistant conversationnel qui répond, qualifie et convertit vos visiteurs, 24/7.",
        icon: "💬",
        href: "/chatbot",
        status: "live", // badge : "En ligne"
        accent: "#6478ff",
    },
    {
        id: "secureport",
        name: "SecuReport",
        tagline: "La sécurité de votre bâtiment, digitalisée — rapports et rondes centralisés.",
        icon: "🛡️",
        href: "/secureport",
        status: "soon", // badge : "Bientôt disponible"
        accent: "#00ffc8",
    },
];

export const statusLabels = {
    live: "En ligne",
    soon: "Bientôt disponible",
};
