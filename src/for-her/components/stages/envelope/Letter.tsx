import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../../content/config";
import { EASE_SOFT } from "../../../lib/motion";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { Typewriter } from "../../ui/Typewriter";

interface LetterProps {
  /** Revisiting: skip the entrance and the typing */
  instant: boolean;
  onBegin: () => void;
}

/** The welcome letter, risen out of the envelope to fill the screen. */
export function Letter({ instant, onBegin }: LetterProps) {
  const [skipped, setSkipped] = useState(false);
  const [done, setDone] = useState(instant);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex justify-center px-4"
      style={{
        paddingTop: "calc(max(12px, env(safe-area-inset-top)) + 56px)",
        paddingBottom: "max(16px, env(safe-area-inset-bottom))",
      }}
      initial={instant ? { opacity: 0 } : { opacity: 0, y: "-4%", scale: 0.74 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: instant ? 0.4 : 0.95, ease: EASE_SOFT, opacity: { duration: 0.35 } }}
    >
      <article
        className="fh-paper relative flex h-full w-full max-w-md flex-col overflow-hidden rounded-[18px] shadow-[0_30px_60px_-24px_rgba(110,40,55,0.55)]"
        onClick={() => setSkipped(true)}
      >
        <div aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[12px] border border-gold/45" />

        <div className="flex-1 overflow-y-auto overscroll-contain px-8 pb-4 pt-10">
          <Flourish />
          <h1 className="mt-5 text-center font-display text-[2.7rem] font-medium leading-[1.05] text-ink">
            <span className="mb-1 block text-[1.4rem] italic text-gold-ink">Happy Birthday,</span>
            {config.herName}
          </h1>

          <Typewriter
            text={config.welcomeLetter}
            instant={instant}
            skipped={skipped}
            onDone={() => setDone(true)}
            className="mt-7 font-body text-[1.05rem] leading-[1.8] text-ink"
          />

          <motion.p
            className="mt-6 text-right font-display text-2xl italic text-gold-ink"
            initial={false}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 0.8, delay: done && !instant ? 0.2 : 0 }}
          >
            — {config.myName}
          </motion.p>
        </div>

        <div className="grid min-h-24 place-items-center px-8 pb-7 pt-2">
          <AnimatePresence mode="wait" initial={false}>
            {done ? (
              <motion.div
                key="begin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: instant ? 0 : 0.6, ease: EASE_SOFT }}
              >
                <PrimaryButton onClick={onBegin}>Begin ✨</PrimaryButton>
              </motion.div>
            ) : (
              <motion.p
                key="skip"
                aria-hidden
                exit={{ opacity: 0 }}
                className="text-xs uppercase tracking-[0.25em] text-ink-soft/70"
              >
                Tap to skip
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </article>
    </motion.div>
  );
}

function Flourish() {
  return (
    <svg viewBox="0 0 160 20" className="mx-auto h-4 w-36 text-gold" aria-hidden>
      <path d="M2 10 H62 M98 10 H158" stroke="currentColor" strokeWidth="1" />
      <path
        d="M80 16s-6.5-3.9-8.3-7.8C70.4 5.3 72.2 2 75.4 2c1.8 0 3.1 1 3.7 2.2C79.7 3 81 2 82.8 2c3.2 0 5 3.3 3.7 6.2C84.7 12.1 80 16 80 16z"
        fill="currentColor"
      />
    </svg>
  );
}
