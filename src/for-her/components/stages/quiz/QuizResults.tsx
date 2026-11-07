import { motion } from "framer-motion";
import { config } from "../../../content/config";
import { EASE_SOFT } from "../../../lib/motion";
import { Polaroid } from "../../ui/Polaroid";
import { PrimaryButton } from "../../ui/PrimaryButton";

function verdictFor(score: number, total: number) {
  if (score === total) return config.quizVerdicts.perfect;
  if (score >= total / 2) return config.quizVerdicts.great;
  return config.quizVerdicts.needMoreDates;
}

/** Spreads n items across an arc: -1 at the far left, 1 at the far right. */
const spread = (i: number, n: number) => (n === 1 ? 0 : (i / (n - 1)) * 2 - 1);

export function QuizResults({ firstTry, onContinue }: { firstTry: boolean[]; onContinue: () => void }) {
  const score = firstTry.filter(Boolean).length;
  const total = firstTry.length;
  const photos = config.quiz;

  return (
    <motion.section
      className="flex flex-1 flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_SOFT }}
    >
      {/* Every unlocked photo, fanned out behind the card */}
      <div aria-hidden className="relative h-44 w-full">
        {photos.map((item, i) => {
          const t = spread(i, photos.length);
          return (
            <motion.div
              key={i}
              className="absolute bottom-0 left-1/2 w-[92px]"
              style={{ marginLeft: -46, transformOrigin: "50% 120%" }}
              initial={{ x: 0, y: 30, rotate: 0, opacity: 0 }}
              animate={{ x: t * 105, y: Math.abs(t) * 18, rotate: t * 16, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.08, type: "spring", stiffness: 120, damping: 16 }}
            >
              <Polaroid src={item.unlockPhoto} caption="" captionClassName="min-h-[1.6em] text-xs" />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="fh-paper relative -mt-10 w-full max-w-sm rounded-[22px] px-7 pb-8 pt-9 text-center shadow-[0_30px_60px_-24px_rgba(110,40,55,0.55)]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7, ease: EASE_SOFT }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[15px] border border-gold/45" />
        <p className="font-display text-sm uppercase tracking-[0.3em] text-gold-ink">You know us</p>
        <p className="mt-2 font-display text-[3.6rem] font-semibold leading-none text-ink">
          {score}/{total} <span className="text-[2.6rem]">💛</span>
        </p>
        <p className="mx-auto mt-4 max-w-[26ch] font-hand text-[1.7rem] leading-tight text-wine">
          {verdictFor(score, total)}
        </p>
        <p className="mt-3 text-sm italic text-ink-soft">right on the first try</p>
        <div className="mt-7">
          <PrimaryButton onClick={onContinue}>Continue ✨</PrimaryButton>
        </div>
      </motion.div>
    </motion.section>
  );
}
