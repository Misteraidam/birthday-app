export type MotionPermission = "unknown" | "granted" | "denied" | "unsupported";

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/**
 * Asks for gyroscope access (used by the timeline's tilt cards).
 * On iOS this MUST be called synchronously inside a tap handler, and only works over HTTPS.
 * Other browsers don't ask, so they resolve to "granted" straight away.
 */
export function requestMotionPermission(): Promise<MotionPermission> {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
    return Promise.resolve("unsupported");
  }
  const DOE = DeviceOrientationEvent as IOSDeviceOrientationEvent;
  if (typeof DOE.requestPermission !== "function") return Promise.resolve("granted");
  return DOE.requestPermission()
    .then((result): MotionPermission => (result === "granted" ? "granted" : "denied"))
    .catch((): MotionPermission => "denied");
}
