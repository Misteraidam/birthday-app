import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { QuizItem } from "../../../content/config";
import { burstFrom } from "../../../lib/confetti";
import { EASE_SOFT } from "../../../lib/motion";
import { Polaroid } from "../../ui/Polaroid";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { AnswerCard, type AnswerState } from "./AnswerCard";
import { SpeechBubble } from "./SpeechBubble";

interface QuestionViewProps {
  item: QuizItem;
  /** Tilt for this question's polaroid, so they don't all sit at the same angle */
  tilt: number;
  /** Called once, the moment she picks the right answer */
  onAnswered: (firstTry: boolean) => void;
  onNext: () => void;
}

const MARKERS = "ABCDEFGH";
/** Long enough to enjoy the confetti before the photo takes over */
const REVEAL_DELAY_MS = 1000;

export function QuestionView({ item, tilt, onAnswered, onNext }: QuestionViewProps) {
  const reduceMotion = useReducedMotion();
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [shake, setShake] = useState({ option: -1, count: 0 });
  const [solved, setSolved] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!solved) return;
    const timer = setTimeout(() => setRevealed(true), reduceMotion ? 350 : REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [solved, reduceMotion]);

  const pick = (option: number, event: MouseEvent<HTMLButtonElement>) => {
    if (solved) return;
    if (option === item.correctIndex) {
      setSolved(true);
      burstFrom(event.currentTarget);
      onAnswered(wrongPicks.length === 0);
    } else {
      // Never a fail state: tint it, wobble it, tease her, let her try again
      setWrongPicks((picks) => (picks.includes(option) ? picks : [...picks, option]));
      setShake((s) => ({ option, count: s.count + 1 }));
    }
  };

  const stateOf = (option: number): AnswerState =>
    solved && option === item.correctIndex ? "right" : wrongPicks.includes(option) ? "wrong" : "idle";

  return (
    <motion.section
      className="flex flex-1 flex-col"
      initial={{ opacity: 0, x: 36 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -36 }}
      transition={{ duration: 0.5, ease: EASE_SOFT }}
    >
      <h2 className="text-balance text-center font-display text-[2rem] font-medium leading-[1.12] text-ink">
        {item.question}
      </h2>

      <AnimatePresence mode="wait" initial={false}>
        {!revealed ? (
          <motion.div
            key="answers"
            className="mt-5 flex flex-col"
            exit={{ opacity: 0, y: 12, transition: { duration: 0.35 } }}
          >
            {/* Fixed-height slot so the answers don't jump when a reaction appears */}
            <div className="flex min-h-[76px] items-end justify-center pb-4">
              <AnimatePresence mode="wait">
                {shake.count > 0 && !solved && <SpeechBubble key={shake.count} text={item.wrongReaction} />}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3">
              {item.options.map((option, i) => (
                <AnswerCard
                  key={i}
                  label={option}
                  marker={MARKERS[i] ?? String(i + 1)}
                  state={stateOf(i)}
                  shakeSignal={shake.option === i ? shake.count : 0}
                  disabled={solved}
                  onPick={(event) => pick(i, event)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="reveal" className="mt-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -70, rotate: tilt - 10 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 15, opacity: { duration: 0.25 } }}
            >
              <Polaroid
                src={item.unlockPhoto}
                caption={item.unlockCaption}
                tilt={tilt}
                develop
                className="w-[min(70vw,270px)]"
                captionClassName="text-[1.6rem]"
              />
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0.3 : 2.4, duration: 0.5, ease: EASE_SOFT }}
            >
              <PrimaryButton onClick={onNext}>Next 💛</PrimaryButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
