import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "../../../content/config";
import { useJourney } from "../../../lib/journey";
import { EASE_SOFT } from "../../../lib/motion";
import { stageIndex } from "../../../lib/stages";
import { initialOf } from "../../../lib/text";
import { Envelope, type EnvelopePhase } from "./Envelope";
import { Letter } from "./Letter";

/** How long each phase lasts before moving to the next one */
const SEQUENCE: Partial<Record<EnvelopePhase, [next: EnvelopePhase, ms: number]>> = {
  breaking: ["opening", 550],
  opening: ["rising", 800],
  rising: ["reading", 1050],
};

export default function EnvelopeStage() {
  const { complete, startExperience, unlocked } = useJourney();
  const reduceMotion = useReducedMotion();
  const revisiting = unlocked > stageIndex("envelope");
  const [phase, setPhase] = useState<EnvelopePhase>(revisiting ? "reading" : "sealed");

  useEffect(() => {
    const step = SEQUENCE[phase];
    if (!step) return;
    const [next, ms] = step;
    const timer = setTimeout(() => setPhase(next), reduceMotion ? 120 : ms);
    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  const open = () => {
    if (phase !== "sealed") return;
    startExperience(); // first tap: music + motion permission, inside the gesture
    setPhase("breaking");
  };

  const sealed = phase === "sealed";

  return (
    <div className="relative grid h-dvh place-items-center overflow-hidden px-4">
      <AnimatePresence>
        {phase !== "reading" && (
          <motion.div
            key="envelope"
            className="flex flex-col items-center gap-9 pt-24"
            exit={{ y: 160, opacity: 0, transition: { duration: 0.8, ease: EASE_SOFT } }}
          >
            <motion.button
              type="button"
              onClick={open}
              disabled={!sealed}
              aria-label="Open the envelope"
              className="rounded-[10px] disabled:cursor-default"
              animate={sealed ? { y: [0, -7, 0] } : { y: 0 }}
              transition={sealed ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
            >
              <Envelope phase={phase} initial={initialOf(config.herName)} />
            </motion.button>

            <motion.p
              aria-hidden
              className="font-display text-xl italic text-ink-soft"
              animate={sealed ? { opacity: [0.4, 1, 0.4] } : { opacity: 0 }}
              transition={sealed ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
            >
              Tap to open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "reading" && <Letter instant={revisiting} onBegin={() => complete("envelope")} />}
    </div>
  );
}
