import LegalPage from "../components/LegalPage";
import useDocumentMeta from "../hooks/useDocumentMeta";

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

export default function MentionsLegales() {
    useDocumentMeta(
        "Mentions légales — NOVYXS",
        "Mentions légales de NOVYXS : éditeur du site, hébergement, propriété intellectuelle et droit applicable."
    );
    return <LegalPage {...mentionsLegalesData} />;
}
