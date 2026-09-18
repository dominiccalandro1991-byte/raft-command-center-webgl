import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { Color, PlaneGeometry } from "three";
import type { TheaterId } from "./catalog";

type SceneMode = "inspect" | "simulate";

function Log({
  position,
  length,
  radius,
  color,
}: {
  position: [number, number, number];
  length: number;
  radius: number;
  color: string;
}) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
      <cylinderGeometry args={[radius * 0.92, radius, length, 14]} />
      <meshStandardMaterial color={color} roughness={0.86} metalness={0.02} />
    </mesh>
  );
}

export function RaftModel() {
  const deck = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);
  const lash = useMemo(() => [0, 1, 2, 3, 4], []);

  return (
    <group>
      <Log position={[0, -0.18, -1.05]} length={5.4} radius={0.28} color="#5c4033" />
      <Log position={[0, -0.18, 1.05]} length={5.4} radius={0.28} color="#4e3528" />
      <Log position={[0, -0.22, -0.35]} length={5.2} radius={0.22} color="#6a4a34" />
      <Log position={[0, -0.22, 0.35]} length={5.2} radius={0.22} color="#5a3c2c" />

      {deck.map((i) => (
        <mesh
          key={i}
          position={[-2.2 + i * 0.4, 0.12, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.08, 2.55, 8]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#8b5a2b" : "#7a4e24"} roughness={0.8} />
        </mesh>
      ))}

      {lash.map((i) => (
        <group key={`lash-${i}`}>
          <mesh position={[-2 + i, 0.02, -1.05]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.32, 0.025, 6, 16]} />
            <meshStandardMaterial color="#3d2a1c" roughness={0.9} />
          </mesh>
          <mesh position={[-2 + i, 0.02, 1.05]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.32, 0.025, 6, 16]} />
            <meshStandardMaterial color="#3d2a1c" roughness={0.9} />
          </mesh>
        </group>
      ))}

      <mesh position={[2.15, 1.15, 0.55]} rotation={[0, 0, -0.42]} castShadow>
        <cylinderGeometry args={[0.045, 0.055, 2.6, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.75} />
      </mesh>
      <mesh position={[2.15, 1.15, -0.55]} rotation={[0, 0, -0.42]} castShadow>
        <cylinderGeometry args={[0.045, 0.055, 2.6, 8]} />
        <meshStandardMaterial color="#5c3b22" roughness={0.75} />
      </mesh>
      <mesh position={[1.65, 2.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.15, 8]} />
        <meshStandardMaterial color="#4a3424" />
      </mesh>
      <mesh position={[1.55, 1.35, 0]} rotation={[0.55, 0, -0.15]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 3.6, 8]} />
        <meshStandardMaterial color="#6b4e32" roughness={0.7} />
      </mesh>
    </group>
  );
}

function RaftRig({ drift }: { drift: number }) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const group = ref.current;
    if (!group) return;
    group.position.y = Math.sin(t * 1.15) * 0.055;
    group.rotation.z = Math.sin(t * 0.75) * 0.028;
    group.rotation.x = Math.sin(t * 0.55) * 0.018;
    group.position.x = Math.sin(t * 0.18) * drift;
  });

  return (
    <group ref={ref}>
      <RaftModel />
    </group>
  );
}

function Water({ chop }: { chop: number }) {
  const meshRef = useRef<Mesh>(null);
  const geometry = useMemo(() => new PlaneGeometry(48, 48, 52, 52), []);
  const color = useMemo(() => new Color("#16343c"), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = geometry.attributes.position;
    if (!pos) return;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z =
        Math.sin(x * 0.38 + t * (0.9 + chop)) * (0.06 + chop * 0.04) +
        Math.sin(y * 0.31 + t * 0.72) * 0.045;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.72, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={0.18}
        metalness={0.28}
        transparent
        opacity={0.94}
      />
    </mesh>
  );
}

function Banks() {
  return (
    <group>
      <mesh position={[0, -1.4, 0]} receiveShadow>
        <boxGeometry args={[56, 1.2, 56]} />
        <meshStandardMaterial color="#12100e" roughness={1} />
      </mesh>
      <mesh position={[0, -0.35, -18]} rotation={[-0.08, 0, 0]} receiveShadow>
        <boxGeometry args={[56, 1.4, 8]} />
        <meshStandardMaterial color="#2a241c" roughness={0.95} />
      </mesh>
      <mesh position={[0, -0.45, 18]} rotation={[0.1, 0, 0]} receiveShadow>
        <boxGeometry args={[56, 1.2, 8]} />
        <meshStandardMaterial color="#241e18" roughness={0.95} />
      </mesh>
    </group>
  );
}

function SceneContents({ mode, theater }: { mode: SceneMode; theater: TheaterId }) {
  const chop = theater === "mississippi" ? 1.15 : 0.35;
  const drift = mode === "simulate" ? (theater === "mississippi" ? 0.55 : 0.12) : 0.08;

  return (
    <>
      <color attach="background" args={["#0a1418"]} />
      <fog attach="fog" args={["#0a1418", 10, 32]} />
      <hemisphereLight args={["#9eb4bc", "#1a120c", 0.55]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[9, 14, 6]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <Banks />
      <Water chop={chop} />
      <RaftRig drift={drift} />
      <OrbitControls
        enablePan
        enableZoom
        maxPolarAngle={Math.PI / 2.05}
        minDistance={4}
        maxDistance={18}
        target={[0, 0.4, 0]}
      />
    </>
  );
}

export function RaftViewport({ mode, theater }: { mode: SceneMode; theater: TheaterId }) {
  return (
    <Canvas
      className="h-full w-full touch-none"
      shadows
      dpr={[1, 2]}
      camera={{ position: [6.5, 4.2, 6.5], fov: 46 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <SceneContents mode={mode} theater={theater} />
    </Canvas>
  );
}
