import { motion } from "framer-motion";
import { config } from "../../../content/config";
import { useJourney } from "../../../lib/journey";
import { useMediaExists } from "../../../lib/media";
import { EASE_SOFT } from "../../../lib/motion";
import { PrimaryButton } from "../../ui/PrimaryButton";

const SECONDARY =
  "min-h-12 w-full max-w-[280px] rounded-full border border-gold/50 bg-cream/70 px-6 py-3 font-display text-lg font-semibold text-ink shadow-[0_8px_20px_-14px_rgba(110,40,55,0.6)] backdrop-blur";

/** Shown instead of the journey when she comes back after finishing it. */
export default function WelcomeBack() {
  const { herName, finaleVideoUrl, openWhen } = config;
  const { startExperience, relive, revisitFinale } = useJourney();
  const hasVideo = useMediaExists(finaleVideoUrl, "video") === true;

  // Every choice is her first tap of the visit, so it also starts the music
  const choose = (action: () => void) => () => {
    startExperience();
    action();
  };

  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE_SOFT }}
      >
        <p className="font-display text-sm uppercase tracking-[0.3em] text-gold-ink">You came back</p>
        <h1 className="mt-3 font-display text-[2.6rem] font-medium leading-tight text-ink">
          Welcome back,
          <br />
          {herName}
        </h1>

        <div className="mt-10 flex w-full flex-col items-center gap-3.5">
          <PrimaryButton onClick={choose(relive)} className="w-full max-w-[280px]">
            Relive it from the start
          </PrimaryButton>
          {hasVideo && (
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={choose(() => revisitFinale("video"))} className={SECONDARY}>
              Watch your video again
            </motion.button>
          )}
          {openWhen.length > 0 && (
            <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={choose(() => revisitFinale("letters"))} className={SECONDARY}>
              Open a letter
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
