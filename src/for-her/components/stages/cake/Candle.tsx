import { useRef } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import { AdditiveBlending, MathUtils, type Group, type Mesh, type MeshBasicMaterial, type Sprite, type SpriteMaterial } from "three";
import { getDigitGeometry } from "./digits";
import { getFlameGeometry, getTextures } from "./textures";

export const CANDLE_HEIGHT = 0.5;
/** Height of the sculpted number candles */
export const NUMBER_HEIGHT = 0.62;
const CANDLE_RADIUS = 0.045;
const SMOKE_PUFFS = 5;
const SMOKE_SECONDS = 2.6;

interface FlameProps {
  lit: boolean;
  /** Per-candle offset so the flames don't flicker in sync */
  seed: number;
  /** 0–1 how hard she's blowing right now */
  blow: MotionValue<number>;
  reduceMotion: boolean;
  /** Tap fallback: tapping the candle puts it out */
  tappable: boolean;
  onTap: () => void;
}

interface CandleProps extends FlameProps {
  /** "3", "0"... gets a sculpted number candle when there's a shape for it; anything else a classic one */
  char: string;
  /** Where the candle stands on the cake (its base) */
  position: [number, number, number];
}

/** Tap handler shared by the flame and the candle body. A drag to rotate the cake isn't a tap. */
function useTap({ tappable, lit, onTap }: Pick<FlameProps, "tappable" | "lit" | "onTap">) {
  return (event: ThreeEvent<MouseEvent>) => {
    if (!tappable || !lit || event.delta > 8) return;
    event.stopPropagation();
    onTap();
  };
}

export function Candle({ char, position, ...flame }: CandleProps) {
  const textures = getTextures();
  const digit = getDigitGeometry(char);
  const handleTap = useTap(flame);
  const height = digit ? NUMBER_HEIGHT : CANDLE_HEIGHT;

  return (
    <group position={position}>
      {digit ? (
        <mesh geometry={digit} scale={NUMBER_HEIGHT} onClick={handleTap}>
          <meshStandardMaterial color="#E9C67E" metalness={0.65} roughness={0.24} emissive="#5A3A10" emissiveIntensity={0.15} />
        </mesh>
      ) : (
        <mesh position-y={CANDLE_HEIGHT / 2} onClick={handleTap}>
          <cylinderGeometry args={[CANDLE_RADIUS, CANDLE_RADIUS, CANDLE_HEIGHT, 16]} />
          <meshStandardMaterial map={textures.stripes} roughness={0.5} />
        </mesh>
      )}
      <group position-y={height}>
        <Flame {...flame} />
      </group>
    </group>
  );
}

/** Wick, flickering flame, smoke wisp when it goes out, and the tap target/hint for the fallback. */
function Flame({ lit, seed, blow, reduceMotion, tappable, onTap }: FlameProps) {
  const textures = getTextures();
  const flame = useRef<Group>(null);
  const glow = useRef<Sprite>(null);
  const smoke = useRef<Group>(null);
  const hint = useRef<Mesh>(null);
  const level = useRef(lit ? 1 : 0);
  const wasLit = useRef(lit);
  /** Clock time it went out; null = no smoke (still lit, or already out when the stage opened) */
  const outAt = useRef<number | null>(null);
  const handleTap = useTap({ tappable, lit, onTap });

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (wasLit.current && !lit) outAt.current = t;
    wasLit.current = lit;

    // Fades in gently, snuffs out fast
    level.current = MathUtils.damp(level.current, lit ? 1 : 0, lit ? 2.5 : 9, dt);
    const strength = blow.get();
    const flicker = reduceMotion
      ? 1 + 0.03 * Math.sin(t * 2 + seed)
      : 1 + 0.09 * Math.sin(t * 13 + seed) + 0.05 * Math.sin(t * 23.7 + seed * 2.3);

    if (flame.current) {
      // Blowing bends the flame away and squashes it down
      const s = level.current * (1 - 0.45 * strength);
      flame.current.scale.set(s * (1 + 0.15 * strength), s * flicker * (1 - 0.25 * strength), s);
      flame.current.rotation.z = -strength * (0.55 + 0.25 * Math.sin(seed)) + (reduceMotion ? 0 : 0.05 * Math.sin(t * 6 + seed));
      flame.current.visible = level.current > 0.01;
    }
    if (glow.current) {
      (glow.current.material as SpriteMaterial).opacity = 0.65 * level.current * flicker * (1 - 0.4 * strength);
    }

    if (hint.current) {
      // Pulsing ring that says "tap me" in the fallback mode
      (hint.current.material as MeshBasicMaterial).opacity = reduceMotion ? 0.5 : 0.3 + 0.25 * Math.sin(t * 3 + seed);
    }

    if (smoke.current) {
      const since = outAt.current === null ? Infinity : t - outAt.current;
      smoke.current.children.forEach((child, i) => {
        const puff = child as Sprite;
        const age = since - i * 0.16;
        const alive = age > 0 && age < SMOKE_SECONDS;
        puff.visible = alive;
        if (!alive) return;
        const life = age / SMOKE_SECONDS;
        puff.position.set(Math.sin(age * 2.4 + i + seed) * 0.05 * age, 0.12 + age * 0.42, 0);
        puff.scale.setScalar(0.07 + age * 0.13);
        (puff.material as SpriteMaterial).opacity = 0.42 * (1 - life) * Math.min(1, age * 4);
      });
    }
  });

  return (
    <>
      {/* Wick */}
      <mesh position-y={0.03}>
        <cylinderGeometry args={[0.008, 0.006, 0.06, 6]} />
        <meshStandardMaterial color="#2B1D18" />
      </mesh>

      {/* Flame, pivoting at its base so it bends like a real one */}
      <group ref={flame} position-y={0.05}>
        <sprite ref={glow} position-y={0.09} scale={[0.46, 0.56, 1]}>
          <spriteMaterial map={textures.glow} color="#FFB45E" transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </sprite>
        <mesh geometry={getFlameGeometry()} scale={[0.07, 0.17, 0.07]}>
          <meshBasicMaterial color="#FFC966" toneMapped={false} />
        </mesh>
        <mesh geometry={getFlameGeometry()} scale={[0.035, 0.09, 0.035]} position-y={0.008}>
          <meshBasicMaterial color="#FFF6DE" toneMapped={false} />
        </mesh>
      </group>

      {/* Smoke wisp after it goes out */}
      <group ref={smoke}>
        {Array.from({ length: SMOKE_PUFFS }, (_, i) => (
          <sprite key={i} visible={false}>
            <spriteMaterial map={textures.smoke} transparent depthWrite={false} opacity={0} />
          </sprite>
        ))}
      </group>

      {tappable && lit && (
        <>
          {/* Generous invisible tap target around the flame */}
          <mesh position-y={0.12} onClick={handleTap}>
            <sphereGeometry args={[0.22, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <Billboard position-y={0.15}>
            <mesh ref={hint}>
              <ringGeometry args={[0.17, 0.19, 32]} />
              <meshBasicMaterial color="#E8D3A2" transparent opacity={0.4} depthWrite={false} toneMapped={false} />
            </mesh>
          </Billboard>
        </>
      )}
    </>
  );
}
