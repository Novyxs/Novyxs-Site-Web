import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER ANIMÉ
// ─────────────────────────────────────────────────────────────────────────────
export default function AnimatedDivider() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <div ref={ref} style={{ width: "100%", height: "1px", overflow: "hidden" }}>
            <motion.div
                initial={{ scaleX: 0, originX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                    transformOrigin: "left",
                }}
            />
        </div>
    );
}
