import { useEffect } from "react";

// Met à jour le <title> et la meta description au montage de chaque page.
// Les balises Open Graph statiques (index.html) restent génériques : les
// crawlers de partage social n'exécutent pas le JS, seul Google en profite.
export default function useDocumentMeta(title, description) {
    useEffect(() => {
        if (title) document.title = title;

        if (description) {
            let tag = document.querySelector('meta[name="description"]');
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("name", "description");
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", description);
        }
    }, [title, description]);
}
