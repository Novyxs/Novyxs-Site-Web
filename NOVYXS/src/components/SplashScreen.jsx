import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import logoBlanc from "../assets/LogoBlanc.png";

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH SCREEN — particule (classe hors composant, requis par eslint-plugin-react-hooks)
// ─────────────────────────────────────────────────────────────────────────────
class Dot {
    constructor(i, total, W, H, cx, cy) {
        const cols = Math.ceil(Math.sqrt(total * W / H));
        const col  = i % cols;
        const rows = Math.ceil(total / cols);
        const row  = Math.floor(i / cols);

        this.cx = cx;
        this.cy = cy;
        this.targetX = (col / Math.max(cols - 1, 1)) * W;
        this.targetY = (row / Math.max(rows - 1, 1)) * H;

        this.x = cx + (Math.random() - 0.5) * 40;
        this.y = cy + (Math.random() - 0.5) * 40;

        const dx = this.targetX - cx;
        const dy = this.targetY - cy;
        this.distFromCenter = Math.sqrt(dx * dx + dy * dy);
        this.maxDist        = Math.sqrt(cx * cx + cy * cy);

        this.formDelay = (this.distFromCenter / this.maxDist) * 700;
        this.alpha  = 0;
        this.size   = 1.8 + Math.random() * 2;
        this.formed = false;

        const angle = Math.atan2(this.targetY - cy, this.targetX - cx);
        const speed = 400 + Math.random() * 600;
        this.dissolveVX = Math.cos(angle) * speed;
        this.dissolveVY = Math.sin(angle) * speed;

        this.dissolveDelay   = (this.distFromCenter / this.maxDist) * 400;
        this.dissolveStarted = false;
        this.dissolveT       = 0;
    }

    update(elapsed, dt, phase) {
        if (phase === 'forming') {
            const t = elapsed - this.formDelay;
            if (t < 0) return;
            const progress = Math.min(t / 500, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            this.x = this.cx + (this.targetX - this.cx) * ease;
            this.y = this.cy + (this.targetY - this.cy) * ease;
            this.alpha = ease * 0.15;
            if (progress >= 1) this.formed = true;
        }

        if (phase === 'dissolving') {
            if (!this.dissolveStarted) {
                const t = elapsed - this.dissolveDelay;
                if (t < 0) return;
                this.dissolveStarted = true;
                this.dissolveT = 0;
                this.startX = this.x;
                this.startY = this.y;
            }
            this.dissolveT += dt;
            const progress = Math.min(this.dissolveT / 1400, 1);
            const ease = 1 - Math.pow(1 - progress, 2);
            this.x = this.startX + this.dissolveVX * ease * 0.5;
            this.y = this.startY + this.dissolveVY * ease * 0.5;
            this.alpha = (1 - progress) * 0.18;
        }
    }

    draw(ctx) {
        if (this.alpha <= 0.005) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.alpha.toFixed(3)})`;
        ctx.fill();
    }
}

export default function SplashScreen({ onComplete }) {
    const canvasRef   = useRef(null);
    const logoRef     = useRef(null);
    const phaseRef    = useRef('forming');
    const rafRef      = useRef(null);
    const startRef    = useRef(0);
    const lastRef     = useRef(0);
    const particlesRef = useRef([]);
    const timersRef    = useRef([]);
    const [dissolving, setDissolving] = useState(false);
    const [hidden, setHidden]         = useState(false);

    const runCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const W = canvas.width  = window.innerWidth;
        const H = canvas.height = window.innerHeight;
        const cx = W / 2, cy = H / 2;

        // Init particles
        const count = 600;
        particlesRef.current = Array.from({ length: count }, (_, i) => new Dot(i, count, W, H, cx, cy));
        phaseRef.current = 'forming';
        startRef.current = performance.now();
        lastRef.current  = startRef.current;

        // Render loop
        const loop = (ts) => {
            const dt      = ts - lastRef.current;
            lastRef.current = ts;
            const elapsed = ts - startRef.current;
            const phase   = phaseRef.current;

            ctx.clearRect(0, 0, W, H);
            particlesRef.current.forEach(p => { p.update(elapsed, dt, phase); p.draw(ctx); });
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        // Forming → dissolving après 1.2s
        timersRef.current = [];
        const t1 = setTimeout(() => {
            setDissolving(true);
            phaseRef.current = 'dissolving';
            startRef.current = performance.now();

            // Fade out splash après 900ms
            const t2 = setTimeout(() => {
                cancelAnimationFrame(rafRef.current);
                onComplete();
                const t3 = setTimeout(() => setHidden(true), 700);
                timersRef.current.push(t3);
            }, 900);
            timersRef.current.push(t2);
        }, 1200);
        timersRef.current.push(t1);
    }, [onComplete]);

    useEffect(() => {
        runCanvas();
        return () => {
            cancelAnimationFrame(rafRef.current);
            timersRef.current.forEach(clearTimeout);
        };
    }, [runCanvas]);

    if (hidden) return null;

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#000",
            opacity: hidden ? 0 : 1,
            transition: "opacity 0.7s ease",
            pointerEvents: "all",
        }}>
            <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }} />

            {/* Logo */}
            <motion.div
                ref={logoRef}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    position: "fixed", inset: 0,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: "18px", zIndex: 10000,
                    opacity: dissolving ? 0 : 1,
                    filter: dissolving ? "blur(10px)" : "none",
                    transform: dissolving ? "scale(1.1)" : "scale(1)",
                    transition: "opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease",
                }}
            >
                <motion.img
                    src={logoBlanc}
                    alt="NOVYXS"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ height: "150px", width: "auto", objectFit: "contain" }}
                />
            </motion.div>
        </div>
    );
}
