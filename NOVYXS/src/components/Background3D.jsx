import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";

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

function Orb({ reducedMotion, compact }) {
    const groupRef = useRef(null);
    const shellRef = useRef(null);
    const angle = useRef(0);
    const smoothed = useRef({ x: 0, y: 0 });
    const pointer = usePointerTarget();

    useFrame((_, delta) => {
        if (!reducedMotion) angle.current += delta * 0.05;
        smoothed.current.x += (pointer.current.x - smoothed.current.x) * 0.02;
        smoothed.current.y += (pointer.current.y - smoothed.current.y) * 0.02;

        if (groupRef.current) {
            groupRef.current.rotation.y = angle.current + smoothed.current.x * 0.35;
            groupRef.current.rotation.x = smoothed.current.y * 0.2;
        }
        if (shellRef.current) {
            shellRef.current.rotation.y = -angle.current * 0.6;
            shellRef.current.rotation.z = angle.current * 0.15;
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

function Scene({ reducedMotion, compact }) {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight color="#6478ff" position={[4, 3, 4]} intensity={60} distance={20} />
            <pointLight color="#00ffc8" position={[-4, -2, 2]} intensity={40} distance={20} />
            <pointLight color="#ffffff" position={[0, 4, 5]} intensity={20} distance={20} />
            <Orb reducedMotion={reducedMotion} compact={compact} />
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
// FOND 3D — orbe distordu ambiant, fixe derrière tout le contenu, ne capte
// jamais le clic/scroll (pointer-events: none) et se dégrade proprement si
// WebGL n'est pas supporté.
// ─────────────────────────────────────────────────────────────────────────────
export default function Background3D() {
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
                    <Scene reducedMotion={reducedMotion} compact={compact} />
                </Suspense>
            </Canvas>
        </div>
    );
}
