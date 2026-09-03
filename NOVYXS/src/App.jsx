import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import ChatbotProject from "./pages/ChatbotProject";
import SecuReportProject from "./pages/SecuReportProject";
import Confidentialite from "./pages/Confidentialite";
import MentionsLegales from "./pages/MentionsLegales";
import NotFound from "./pages/NotFound";

// Chargé en chunk séparé : three.js/r3f ne doit pas alourdir le bundle initial.
const Background3D = lazy(() => import("./components/Background3D"));

// Un objet 3D ambiant différent par page, en lien avec son contenu.
function variantForPath(pathname) {
    if (pathname === "/chatbot") return "bot";
    if (pathname === "/secureport") return "lock";
    return "orb";
}

function AppShell() {
    const [splashDone, setSplashDone] = useState(false);
    const location = useLocation();
    const variant = variantForPath(location.pathname);

    return (
        <>
            {/* Splash — affiché jusqu'à onComplete, une seule fois par session */}
            {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}

            <ScrollToTop />
            <Navbar />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: splashDone ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh", width: "100%", fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden" }}
            >
                <Suspense fallback={null}>
                    <Background3D variant={variant} />
                </Suspense>

                {/* Glows — communs à toutes les pages */}
                <div style={{ position: "absolute", top: "-180px", left: "50%", transform: "translateX(-50%)", width: "1100px", height: "1100px", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 30%, rgba(0,0,0,0) 68%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "120px", right: "-180px", width: "480px", height: "480px", borderRadius: "999px", background: "radial-gradient(circle, rgba(100,120,255,0.18) 0%, rgba(100,120,255,0.05) 42%, rgba(0,0,0,0) 72%)", filter: "blur(28px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "620px", left: "-180px", width: "420px", height: "420px", borderRadius: "999px", background: "radial-gradient(circle, rgba(0,255,200,0.15) 0%, rgba(0,255,200,0.04) 40%, rgba(0,0,0,0) 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

                <div style={{ width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "0 24px 120px", position: "relative", zIndex: 1, boxSizing: "border-box" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chatbot" element={<ChatbotProject />} />
                        <Route path="/secureport" element={<SecuReportProject />} />
                        <Route path="/confidentialite" element={<Confidentialite />} />
                        <Route path="/mentions-legales" element={<MentionsLegales />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>

                <Footer />
            </motion.div>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}

export default App;
