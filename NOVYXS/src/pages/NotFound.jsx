import { Link } from "react-router-dom";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { t, whiteBtn, hoverIn, hoverOut } from "../theme";

export default function NotFound() {
    useDocumentMeta("Page introuvable — NOVYXS", "Cette page n'existe pas ou plus.");

    return (
        <section style={{ textAlign: "center", paddingTop: "clamp(140px, 20vw, 220px)", paddingBottom: "160px" }}>
            <p style={{ ...t.label, marginBottom: "16px" }}>404</p>
            <h1 style={{ ...t.h2, margin: "0 auto 20px", maxWidth: "600px" }}>Cette page n'existe pas.</h1>
            <p style={{ ...t.body, maxWidth: "480px", margin: "0 auto 36px" }}>
                Le lien est peut-être obsolète, ou la page a été déplacée.
            </p>
            <Link to="/" style={{ ...whiteBtn, display: "inline-block", textDecoration: "none" }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                Retour à l'accueil
            </Link>
        </section>
    );
}
