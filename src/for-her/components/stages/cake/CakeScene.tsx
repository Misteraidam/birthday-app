import { useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, Sparkles } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { MathUtils, Vector3, type AmbientLight, type DirectionalLight, type Group, type PerspectiveCamera, type PointLight } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CAKE, Cake } from "./Cake";
import { CANDLE_HEIGHT, Candle } from "./Candle";

interface CakeSceneProps {
  lit: boolean[];
  blow: MotionValue<number>;
  reduceMotion: boolean;
  tappable: boolean;
  onTapCandle: (index: number) => void;
  celebrating: boolean;
  onReady: () => void;
}

const TARGET: [number, number, number] = [0, 0.75, 0];

/** One ring of up to 12 candles; any extra go in a smaller inner ring. */
function candlePositions(count: number): [number, number, number][] {
  const y = CAKE.surface + 0.03 + CANDLE_HEIGHT / 2;
  if (count === 1) return [[0, y, 0]];
  const outer = Math.min(count, 12);
  const inner = count - outer;
  const ring = (n: number, radius: number, offset: number) =>
    Array.from({ length: n }, (_, i): [number, number, number] => {
      const angle = (i / n) * Math.PI * 2 + offset;
      return [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
    });
  return [...ring(outer, outer <= 3 ? 0.45 : 0.62, Math.PI / 2), ...ring(inner, 0.3, Math.PI / 2 + 0.3)];
}

/** Pulls the camera back far enough that the whole cake fits, even on a narrow portrait phone. */
function CameraRig() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;

  useEffect(() => {
    const aspect = size.width / size.height;
    camera.fov = aspect < 0.8 ? 46 : 36;
    camera.updateProjectionMatrix();
    const halfFov = MathUtils.degToRad(camera.fov / 2);
    const distance = Math.max(2.25 / (Math.tan(halfFov) * aspect), 2.1 / Math.tan(halfFov));
    // Keep the current viewing angle, just change the distance
    const target = controls?.target ?? new Vector3(...TARGET);
    const offset = camera.position.clone().sub(target).setLength(distance);
    camera.position.copy(target).add(offset);
    controls?.update();
  }, [camera, size, controls]);

  return null;
}

/** The cake glides up into place when the stage opens. */
function Rise({ children, reduceMotion }: { children: ReactNode; reduceMotion: boolean }) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.y = reduceMotion ? 0 : MathUtils.damp(ref.current.position.y, 0, 2.2, dt);
  });
  return (
    <group ref={ref} position-y={reduceMotion ? 0 : -2.6}>
      {children}
    </group>
  );
}

/** Candlelight that dims as flames go out, and a warm wash of light for the celebration. */
function Lights({ litFraction, celebrating, reduceMotion }: { litFraction: number; celebrating: boolean; reduceMotion: boolean }) {
  const candle = useRef<PointLight>(null);
  const ambient = useRef<AmbientLight>(null);
  const warm = useRef<DirectionalLight>(null);
  const level = useRef(litFraction);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    level.current = MathUtils.damp(level.current, litFraction, 3, dt);
    const flicker = reduceMotion ? 1 : 1 + 0.08 * Math.sin(t * 11) + 0.05 * Math.sin(t * 17.3);
    if (candle.current) candle.current.intensity = 14 * level.current * flicker;
    if (ambient.current) ambient.current.intensity = MathUtils.damp(ambient.current.intensity, celebrating ? 1.1 : 0.6, 1.2, dt);
    if (warm.current) warm.current.intensity = MathUtils.damp(warm.current.intensity, celebrating ? 2.2 : 1.0, 1.2, dt);
  });

  return (
    <>
      <ambientLight ref={ambient} color="#FFE3D6" intensity={celebrating ? 1.1 : 0.6} />
      <hemisphereLight args={["#FFE9DA", "#3A1C22", 0.45]} />
      <directionalLight ref={warm} position={[3, 5, 4]} color="#FFD3A8" intensity={celebrating ? 2.2 : 1.0} />
      <directionalLight position={[-4, 3, -3]} color="#E8A4B0" intensity={0.5} />
      <pointLight ref={candle} position={[0, CAKE.surface + 0.9, 0.2]} color="#FFAE5C" distance={9} decay={2} />
    </>
  );
}

export function CakeScene({ lit, blow, reduceMotion, tappable, onTapCandle, celebrating, onReady }: CakeSceneProps) {
  const positions = candlePositions(lit.length);
  const litFraction = lit.filter(Boolean).length / lit.length;

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 40, position: [0, 3.2, 10], near: 0.1, far: 60 }}
      onCreated={onReady}
    >
      <CameraRig />
      <Lights litFraction={litFraction} celebrating={celebrating} reduceMotion={reduceMotion} />
      {/* Soft reflections for the gold, rendered once from these shapes: no HDR file to download */}
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#FFE2C4" position={[0, 4, 3]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#FFB061" position={[-3, 2, -2]} scale={2} />
        <Lightformer form="rect" intensity={0.8} color="#F2B8C0" position={[4, 1, -1]} scale={[2, 4, 1]} />
      </Environment>

      <Rise reduceMotion={reduceMotion}>
        <Cake />
        {positions.map((position, i) => (
          <Candle
            key={i}
            position={position}
            lit={lit[i]}
            seed={i * 1.7}
            blow={blow}
            reduceMotion={reduceMotion}
            tappable={tappable}
            onTap={() => onTapCandle(i)}
          />
        ))}
      </Rise>

      <Sparkles count={36} scale={[7, 5, 7]} position={[0, 2, 0]} size={2.4} speed={reduceMotion ? 0 : 0.25} opacity={0.7} color="#E8D3A2" />

      <OrbitControls
        makeDefault
        target={TARGET}
        enableZoom={false}
        enablePan={false}
        enableDamping
        rotateSpeed={0.6}
        // Look down on it, never from underneath
        minPolarAngle={0.95}
        maxPolarAngle={1.42}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.55}
      />
    </Canvas>
  );
}
