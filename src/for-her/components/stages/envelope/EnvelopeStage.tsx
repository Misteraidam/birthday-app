import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../../content/config";
import { useJourney } from "../../../lib/journey";
import { EASE_SOFT } from "../../../lib/motion";
import { stageIndex } from "../../../lib/stages";
import { initialOf } from "../../../lib/text";
import { Envelope } from "./Envelope";
import { Letter } from "./Letter";
import { useEnvelopeSequence } from "./useEnvelopeSequence";

export default function EnvelopeStage() {
  const { complete, startExperience, unlocked } = useJourney();
  const revisiting = unlocked > stageIndex("envelope");
  const [phase, openEnvelope] = useEnvelopeSequence(revisiting ? "reading" : "sealed");

  const open = () => {
    if (phase !== "sealed") return;
    startExperience(); // first tap: music + motion permission, inside the gesture
    openEnvelope();
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
