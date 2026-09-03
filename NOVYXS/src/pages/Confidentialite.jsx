import LegalPage from "../components/LegalPage";
import useDocumentMeta from "../hooks/useDocumentMeta";

const confidentialiteData = {
    title: "Politique de confidentialité",
    lastUpdate: "5 mai 2026",
    sections: [
        {
            title: "1. Qui sommes-nous ?",
            content: (<>
                <p>NOVYXS est un studio de développement web et logiciel sur mesure, dont le siège social est situé à Delson, Québec, Canada.</p>
                <p style={{marginTop:"10px"}}>Site web : <span style={{color:"#fff"}}>https://www.novyxs.com</span><br/>Email : <span style={{color:"#fff"}}>admin@novyxs.com</span></p>
            </>)
        },
        {
            title: "2. Quelles données collectons-nous ?",
            content: (<>
                <p style={{fontWeight:600, color:"#fff", marginBottom:"8px"}}>Via Google Analytics</p>
                <p>Lorsque vous visitez notre site, Google Analytics collecte automatiquement : votre adresse IP (anonymisée), votre pays et région, le type d'appareil et navigateur utilisé, les pages visitées et la durée de visite, et la source de votre visite. Ces données sont <strong style={{color:"#fff"}}>anonymes</strong> — nous ne pouvons pas identifier personnellement un visiteur.</p>
                <p style={{fontWeight:600, color:"#fff", margin:"16px 0 8px"}}>Via nos produits (Chatbot IA, SecuReport)</p>
                <p>Lorsque vous interagissez avec un de nos produits, nous collectons les messages ou informations que vous partagez volontairement (nom, email, besoins).</p>
                <p style={{fontWeight:600, color:"#fff", margin:"16px 0 8px"}}>Via le formulaire de contact</p>
                <p>Si vous nous contactez par email, nous collectons votre adresse email et les informations contenues dans votre message.</p>
            </>)
        },
        {
            title: "3. Pourquoi collectons-nous ces données ?",
            content: (<>
                <p>Nous collectons ces données pour comprendre le trafic et améliorer le site, répondre à vos demandes et qualifier vos besoins, et vous recontacter suite à une demande de démo.</p>
                <p style={{marginTop:"16px"}}>Nous ne vendons jamais vos données personnelles à des tiers à des fins publicitaires ou commerciales.</p>
                <p style={{marginTop:"12px"}}>Cependant, dans le cadre de notre chatbot IA, <strong style={{color:"#fff"}}>les conversations tenues avec l'assistant sont transmises à l'entreprise cliente</strong> sur le site de laquelle il est installé. En interagissant avec un chatbot Novyxs, vous acceptez que ces échanges soient partagés avec l'entreprise concernée.</p>
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

export default function Confidentialite() {
    useDocumentMeta(
        "Politique de confidentialité — NOVYXS",
        "Politique de confidentialité de NOVYXS : données collectées, finalités, durée de conservation et vos droits."
    );
    return <LegalPage {...confidentialiteData} />;
}
