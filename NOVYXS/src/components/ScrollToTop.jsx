import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Remet le scroll en haut à chaque changement de route (react-router ne le fait
// pas automatiquement, contrairement à une navigation classique).
export default function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}
