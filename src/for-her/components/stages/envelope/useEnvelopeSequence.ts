import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { EnvelopePhase } from "./Envelope";

/** How long each phase lasts before moving to the next one */
const SEQUENCE: Partial<Record<EnvelopePhase, [next: EnvelopePhase, ms: number]>> = {
  breaking: ["opening", 550],
  opening: ["rising", 800],
  rising: ["reading", 1050],
};

/** Seal cracks → flap opens → letter rises → reading. Call `open()` to start. */
export function useEnvelopeSequence(initial: EnvelopePhase) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<EnvelopePhase>(initial);

  useEffect(() => {
    const step = SEQUENCE[phase];
    if (!step) return;
    const [next, ms] = step;
    const timer = setTimeout(() => setPhase(next), reduceMotion ? 120 : ms);
    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  const open = useCallback(() => setPhase((p) => (p === "sealed" ? "breaking" : p)), []);
  return [phase, open] as const;
}
