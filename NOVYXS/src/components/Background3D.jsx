import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";

// Suit la souris sans dépendre des pointer-events du canvas (qui reste pointer-events:none).
function usePointerTarget() {
    const target = useRef({ x: 0, y: 0 });
    useEffect(() => {
        const handleMove = (e) => {
            target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", handleMove, { passive: true });
        return () => window.removeEventListener("pointermove", handleMove);
    }, []);
    return target;
}

function useReducedMotion() {
    const [reduced, setReduced] = useState(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = (e) => setReduced(e.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return reduced;
}

// Rotation continue + lissage du parallax souris, partagés par les 3 objets 3D.
// Ne lance pas son propre useFrame : chaque objet appelle tick(delta) dans le sien.
function useAmbientMotion() {
    const pointer = usePointerTarget();
    const state = useRef({ angle: 0, x: 0, y: 0 });

    return (delta, reducedMotion) => {
        if (!reducedMotion) state.current.angle += delta * 0.05;
        state.current.x += (pointer.current.x - state.current.x) * 0.02;
        state.current.y += (pointer.current.y - state.current.y) * 0.02;
        return state.current;
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// ORB — accueil : sphère distordue, marque abstraite du studio
// ─────────────────────────────────────────────────────────────────────────────
function Orb({ reducedMotion, compact }) {
    const groupRef = useRef(null);
    const shellRef = useRef(null);
    const tick = useAmbientMotion();

    useFrame((_, delta) => {
        const { angle, x, y } = tick(delta, reducedMotion);
        if (groupRef.current) {
            groupRef.current.rotation.y = angle + x * 0.35;
            groupRef.current.rotation.x = y * 0.2;
        }
        if (shellRef.current) {
            shellRef.current.rotation.y = -angle * 0.6;
            shellRef.current.rotation.z = angle * 0.15;
        }
    });

    return (
        <group position={compact ? [0, 0.6, -2] : [2.6, 0.3, -1.6]} scale={compact ? 0.6 : 1}>
            <group ref={groupRef}>
                <mesh>
                    <icosahedronGeometry args={[1.7, 16]} />
                    <MeshDistortMaterial
                        color="#0c0d14"
                        emissive="#0b0e2e"
                        emissiveIntensity={0.5}
                        roughness={0.25}
                        metalness={0.55}
                        distort={0.32}
                        speed={reducedMotion ? 0 : 1.3}
                    />
                </mesh>
            </group>
            <mesh ref={shellRef}>
                <icosahedronGeometry args={[2.05, 1]} />
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.06} />
            </mesh>
        </group>
    );
}

// Dessine un emoji sur un canvas 2D (rendu natif du navigateur, fiable et
// toujours "joli") et l'expose comme texture pour un plan 3D — bien plus sûr
// que de sculpter un robot/cadenas à la main en primitives three.js.
function useEmojiTexture(emoji, size) {
    return useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        ctx.font = `${Math.floor(size * 0.7)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emoji, size / 2, size / 2 + size * 0.04);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        return texture;
    }, [emoji, size]);
}

// ─────────────────────────────────────────────────────────────────────────────
// EMOJI ORB — un emoji flottant dans une cage filaire lumineuse : sert de socle
// pour le robot (Chatbot) et le cadenas (SecuReport), en lien direct avec le
// contenu de chaque page sans risquer une géométrie "qui fait peur".
// ─────────────────────────────────────────────────────────────────────────────
function EmojiOrb({ emoji, glowColor, reducedMotion, compact, position, scale }) {
    const innerRef = useRef(null);
    const cageRef = useRef(null);
    const tick = useAmbientMotion();
    const texture = useEmojiTexture(emoji, compact ? 192 : 256);

    useFrame((state, delta) => {
        const { angle, x, y } = tick(delta, reducedMotion);
        if (innerRef.current) {
            innerRef.current.position.y = (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.9) * 0.14) + y * 0.3;
            innerRef.current.position.x = x * 0.3;
        }
        if (cageRef.current && !reducedMotion) {
            cageRef.current.rotation.y = angle;
            cageRef.current.rotation.x = angle * 0.4;
        }
    });

    return (
        <group position={position} scale={scale}>
            <group ref={innerRef}>
                <mesh ref={cageRef}>
                    <icosahedronGeometry args={[1.15, 1]} />
                    <meshBasicMaterial color={glowColor} wireframe transparent opacity={0.18} />
                </mesh>
                <mesh position={[0, 0, 0.04]}>
                    <circleGeometry args={[0.92, 32]} />
                    <meshBasicMaterial color={glowColor} transparent opacity={0.16} toneMapped={false} />
                </mesh>
                <mesh position={[0, 0, 0.08]}>
                    <planeGeometry args={[1.5, 1.5]} />
                    <meshBasicMaterial map={texture} transparent alphaTest={0.05} toneMapped={false} />
                </mesh>
            </group>
        </group>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// BOT — page Chatbot
// ─────────────────────────────────────────────────────────────────────────────
function Bot({ reducedMotion, compact }) {
    return (
        <EmojiOrb
            emoji="🤖"
            glowColor="#6478ff"
            reducedMotion={reducedMotion}
            compact={compact}
            position={compact ? [0, -1.4, -2] : [2.6, 0.2, -1]}
            scale={compact ? 0.55 : 1}
        />
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOCK — page SecuReport
// ─────────────────────────────────────────────────────────────────────────────
function Lock({ reducedMotion, compact }) {
    return (
        <EmojiOrb
            emoji="🔒"
            glowColor="#00ffc8"
            reducedMotion={reducedMotion}
            compact={compact}
            position={compact ? [0, -1.9, -2] : [2.5, 1.1, -1.2]}
            scale={compact ? 0.55 : 1}
        />
    );
}

function Scene({ reducedMotion, compact, variant }) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight color="#6478ff" position={[4, 3, 4]} intensity={60} distance={20} />
            <pointLight color="#00ffc8" position={[-4, -2, 2]} intensity={40} distance={20} />
            <pointLight color="#ffffff" position={[0, 4, 5]} intensity={20} distance={20} />

            {variant === "bot" && <Bot reducedMotion={reducedMotion} compact={compact} />}
            {variant === "lock" && <Lock reducedMotion={reducedMotion} compact={compact} />}
            {variant === "orb" && <Orb reducedMotion={reducedMotion} compact={compact} />}

            {!compact && (
                <Sparkles count={70} scale={[10, 7, 5]} size={2} speed={reducedMotion ? 0 : 0.25} opacity={0.35} color="#ffffff" />
            )}
        </>
    );
}

function supportsWebGL() {
    try {
        const canvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
    } catch {
        return false;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// FOND 3D — un objet ambiant différent par page (orbe / robot / cadenas), fixe
// derrière tout le contenu, ne capte jamais le clic/scroll (pointer-events:
// none) et se dégrade proprement si WebGL n'est pas supporté.
// ─────────────────────────────────────────────────────────────────────────────
export default function Background3D({ variant = "orb" }) {
    const [ready] = useState(supportsWebGL);
    const [compact, setCompact] = useState(() => window.innerWidth < 720);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const onResize = () => setCompact(window.innerWidth < 720);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (!ready) return null;

    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} aria-hidden="true">
            <Canvas
                dpr={[1, compact ? 1 : 1.5]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                camera={{ position: [0, 0, 6], fov: 45 }}
            >
                <Suspense fallback={null}>
                    <Scene reducedMotion={reducedMotion} compact={compact} variant={variant} />
                </Suspense>
            </Canvas>
        </div>
    );
}
