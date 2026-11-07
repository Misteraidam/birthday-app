import { useEffect, type PointerEvent } from "react";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import type { GyroTilt } from "./useGyroTilt";

/** Maximum card rotation in degrees */
export const MAX_TILT_DEG = 8;
const SPRING = { stiffness: 110, damping: 18, mass: 0.6 };

/**
 * Tilt for one card. Follows the shared gyroscope when it's live; otherwise follows a
 * finger dragging across the card (or the mouse on desktop). Disabled = perfectly still.
 */
export function useCardTilt(gyro: GyroTilt, enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // Springs smooth out both sensor noise and jumpy pointer input
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  const rotateY = useTransform(x, (v) => v * MAX_TILT_DEG);
  const rotateX = useTransform(y, (v) => -v * MAX_TILT_DEG);

  const useGyro = enabled && gyro.active;
  const usePointer = enabled && !gyro.active;

  useEffect(() => {
    if (!useGyro) return;
    rawX.set(gyro.x.get());
    rawY.set(gyro.y.get());
    const stopX = gyro.x.on("change", (v) => rawX.set(v));
    const stopY = gyro.y.on("change", (v) => rawY.set(v));
    return () => {
      stopX();
      stopY();
      rawX.set(0);
      rawY.set(0);
    };
  }, [useGyro, gyro.x, gyro.y, rawX, rawY]);

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const handlers = usePointer
    ? {
        onPointerMove: (event: PointerEvent<HTMLElement>) => {
          const rect = event.currentTarget.getBoundingClientRect();
          rawX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
          rawY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
        },
        onPointerLeave: reset,
        // Fires when a vertical drag turns into a page scroll
        onPointerCancel: reset,
        onPointerUp: (event: PointerEvent<HTMLElement>) => {
          if (event.pointerType !== "mouse") reset();
        },
      }
    : {};

  return { x, y, rotateX, rotateY, handlers };
}
