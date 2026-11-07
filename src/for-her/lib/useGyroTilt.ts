import { useEffect, useState } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

export interface GyroTilt {
  /** Left/right tilt, -1..1 (right is positive) */
  x: MotionValue<number>;
  /** Forward/back tilt, -1..1 (top edge away from her is positive) */
  y: MotionValue<number>;
  /** True once real sensor readings are arriving and calibrated */
  active: boolean;
}

/** Degrees of phone tilt that map to a full -1..1 swing */
const RANGE_DEG = 22;
/** Readings averaged to find how she's naturally holding the phone */
const CALIBRATION_SAMPLES = 10;
/** Neutral slowly follows her posture, so if she settles back on the sofa it re-centres over ~10s */
const NEUTRAL_DRIFT = 0.0015;
/** Low-pass filter on raw readings; lower = smoother */
const SMOOTHING = 0.2;

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Reads the gyroscope once for the whole stage. Neutral is calibrated to however the phone
 * is held when this starts, not flat on a table. Stays inactive if the device never sends
 * real readings (desktops, denied permission), so callers can fall back to touch tilt.
 */
export function useGyroTilt(enabled: boolean): GyroTilt {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let samples = 0;
    let neutralBeta = 0;
    let neutralGamma = 0;

    const onOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;

      if (samples < CALIBRATION_SAMPLES) {
        neutralBeta += beta / CALIBRATION_SAMPLES;
        neutralGamma += gamma / CALIBRATION_SAMPLES;
        if (++samples === CALIBRATION_SAMPLES) setActive(true);
        return;
      }

      neutralBeta += (beta - neutralBeta) * NEUTRAL_DRIFT;
      neutralGamma += (gamma - neutralGamma) * NEUTRAL_DRIFT;
      const targetX = clamp((gamma - neutralGamma) / RANGE_DEG);
      const targetY = clamp((beta - neutralBeta) / RANGE_DEG);
      x.set(x.get() + (targetX - x.get()) * SMOOTHING);
      y.set(y.get() + (targetY - y.get()) * SMOOTHING);
    };

    window.addEventListener("deviceorientation", onOrientation);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      x.set(0);
      y.set(0);
      setActive(false);
    };
  }, [enabled, x, y]);

  return { x, y, active };
}
