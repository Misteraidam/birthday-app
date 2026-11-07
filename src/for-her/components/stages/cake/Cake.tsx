import { useLayoutEffect, useRef } from "react";
import { Object3D, type InstancedMesh } from "three";

/** Cake dimensions, shared with the candles so they sit exactly on top */
export const CAKE = {
  plateTop: 0.08,
  bottomRadius: 1.45,
  bottomHeight: 0.85,
  topRadius: 1.0,
  topHeight: 0.7,
  get bottomTop() {
    return this.plateTop + this.bottomHeight;
  },
  get topBase() {
    return this.bottomTop + 0.06;
  },
  get surface() {
    return this.topBase + this.topHeight;
  },
};

const COLORS = {
  blush: "#F0BDB6",
  cream: "#FFF3E2",
  frosting: "#FFF8EE",
  gold: "#E2BE76",
  plate: "#FBF4EA",
};

/** Deterministic pseudo-random so the drips look hand-made but never reshuffle */
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const dummy = new Object3D();

/** Frosting drips hanging over the top edge of a tier */
function Drips({ count, radius, top, thickness, color, seed }: { count: number; radius: number; top: number; thickness: number; color: string; seed: number }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand(seed + i) * 0.15;
      const length = 0.08 + rand(seed + i * 7) * 0.3;
      dummy.position.set(Math.cos(angle) * radius, top - length / 2, Math.sin(angle) * radius);
      dummy.scale.set(1, length, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, radius, top, seed]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <capsuleGeometry args={[thickness, 1, 3, 8]} />
      <meshStandardMaterial color={color} roughness={0.32} />
    </instancedMesh>
  );
}

/** A ring of small spheres: gold pearls or frosting rosettes */
function Ring({ count, radius, y, size, color, metal = false }: { count: number; radius: number; y: number; size: number; color: string; metal?: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, radius, y]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[size, 10, 8]} />
      <meshStandardMaterial color={color} metalness={metal ? 0.6 : 0} roughness={metal ? 0.3 : 0.45} />
    </instancedMesh>
  );
}

/** Two tiers in blush and cream, frosting drips, gold pearl borders, on a gold-rimmed plate. */
export function Cake() {
  const { plateTop, bottomRadius, bottomHeight, bottomTop, topRadius, topHeight, topBase, surface } = CAKE;

  return (
    <group>
      {/* Plate */}
      <mesh position-y={plateTop / 2}>
        <cylinderGeometry args={[2.0, 1.9, plateTop, 48]} />
        <meshStandardMaterial color={COLORS.plate} roughness={0.25} />
      </mesh>
      <mesh position-y={plateTop} rotation-x={Math.PI / 2}>
        <torusGeometry args={[2.0, 0.035, 8, 64]} />
        <meshStandardMaterial color={COLORS.gold} metalness={0.6} roughness={0.28} />
      </mesh>

      {/* Bottom tier: blush with cream frosting */}
      <mesh position-y={plateTop + bottomHeight / 2}>
        <cylinderGeometry args={[bottomRadius, bottomRadius, bottomHeight, 48]} />
        <meshStandardMaterial color={COLORS.blush} roughness={0.7} />
      </mesh>
      <mesh position-y={bottomTop + 0.03}>
        <cylinderGeometry args={[bottomRadius + 0.03, bottomRadius + 0.03, 0.08, 48]} />
        <meshStandardMaterial color={COLORS.frosting} roughness={0.3} />
      </mesh>
      <Drips count={22} radius={bottomRadius + 0.01} top={bottomTop + 0.04} thickness={0.07} color={COLORS.frosting} seed={1} />
      <Ring count={42} radius={bottomRadius + 0.03} y={plateTop + 0.06} size={0.055} color={COLORS.gold} metal />

      {/* Top tier: cream with blush frosting */}
      <mesh position-y={topBase + topHeight / 2}>
        <cylinderGeometry args={[topRadius, topRadius, topHeight, 48]} />
        <meshStandardMaterial color={COLORS.cream} roughness={0.7} />
      </mesh>
      <mesh position-y={surface}>
        <cylinderGeometry args={[topRadius + 0.03, topRadius + 0.03, 0.07, 48]} />
        <meshStandardMaterial color={COLORS.blush} roughness={0.3} />
      </mesh>
      <Drips count={16} radius={topRadius + 0.01} top={surface + 0.02} thickness={0.055} color={COLORS.blush} seed={40} />
      <Ring count={30} radius={topRadius + 0.03} y={topBase + 0.05} size={0.05} color={COLORS.gold} metal />
      <Ring count={14} radius={topRadius - 0.1} y={surface + 0.06} size={0.065} color={COLORS.frosting} />
    </group>
  );
}
