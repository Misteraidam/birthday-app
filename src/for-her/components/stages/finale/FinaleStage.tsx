import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../../content/config";
import { snowfall } from "../../../lib/confetti";
import { useJourney } from "../../../lib/journey";
import { useMediaExists } from "../../../lib/media";
import { EASE_SOFT } from "../../../lib/motion";
import { setMusicLevel } from "../../../lib/music";
import { GoldDust } from "../../ui/GoldDust";
import { FinalLetter } from "./FinalLetter";
import { OpenWhenLetters } from "./OpenWhenLetters";
import { RisingHearts } from "./RisingHearts";
import { VideoMessage } from "./VideoMessage";

type Step = "intro" | "video" | "letter";

/** How long the intro line holds before the video (or the letter) appears */
const INTRO_MS = 3000;

export default function FinaleStage() {
  const { finaleSeen, finaleEntry, markFinaleSeen } = useJourney();
  // Captured on arrival: a rewatch gets the skip link and the letter shown in full
  const [rewatching] = useState(finaleSeen);
  const [step, setStep] = useState<Step>(() => {
    if (finaleEntry === "letters") return "letter";
    if (finaleEntry === "video" || rewatching) return "video";
    return "intro";
  });
  // null while checking. A missing video skips straight to the letter; a missing poster gets a gradient.
  const hasVideo = useMediaExists(config.finaleVideoUrl, "video");
  const hasPoster = useMediaExists(config.finaleVideoPoster, "image") === true;
  const [signed, setSigned] = useState(false);
  const lettersRef = useRef<HTMLDivElement>(null);
  const stopSnow = useRef<() => void>(() => {});

  // Music settles low as the finale opens, comes back for the letter, and is restored on the way out
  useEffect(() => {
    setMusicLevel("low", 2000);
    return () => {
      stopSnow.current();
      setMusicLevel("full", 1500);
    };
  }, []);

  useEffect(() => {
    if (step === "letter") setMusicLevel("full", 2500);
  }, [step]);

  useEffect(() => {
    if (step !== "intro") return;
    const timer = setTimeout(() => setStep("video"), INTRO_MS);
    return () => clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step === "video" && hasVideo === false) setStep("letter");
  }, [step, hasVideo]);

  // From the welcome-back screen's "Open a letter": land on the letters
  useEffect(() => {
    if (finaleEntry !== "letters" || !signed) return;
    const timer = setTimeout(() => lettersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 500);
    return () => clearTimeout(timer);
  }, [finaleEntry, signed]);

  const handleSigned = () => {
    setSigned(true);
    if (rewatching) return;
    markFinaleSeen();
    stopSnow.current = snowfall(12_000);
  };

  return (
    <div className="relative min-h-dvh">
      {/* A warm, dim room with drifting gold */}
      <div
        aria-hidden
        className="fixed inset-0"
        style={{ background: "radial-gradient(110% 70% at 50% 30%, #3E2326 0%, #241315 55%, #120809 100%)" }}
      />
      <div aria-hidden className="fixed inset-0">
        <GoldDust />
      </div>
      {signed && <RisingHearts />}

      <div
        className="relative z-[2] mx-auto w-full max-w-md px-4"
        style={{
          paddingTop: "calc(max(12px, env(safe-area-inset-top)) + 64px)",
          paddingBottom: "max(56px, env(safe-area-inset-bottom))",
        }}
      >
        <AnimatePresence mode="wait">
          {step !== "letter" ? (
            <motion.section
              key="video"
              className="flex min-h-[calc(100dvh-140px)] flex-col items-center justify-center gap-8 text-center"
              exit={{ opacity: 0, transition: { duration: 0.8 } }}
            >
              <motion.p
                className="font-display text-[2rem] italic leading-tight text-cream"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, ease: EASE_SOFT }}
              >
                {config.finaleIntro}
              </motion.p>

              {step === "video" && hasVideo && (
                <>
                  <VideoMessage
                    src={config.finaleVideoUrl}
                    poster={hasPoster ? config.finaleVideoPoster : ""}
                    onEnded={() => setStep("letter")}
                    onFailed={() => setStep("letter")}
                  />
                  <div className="min-h-11">
                    {rewatching && (
                      <button
                        type="button"
                        onClick={() => setStep("letter")}
                        className="min-h-11 px-3 text-sm italic text-gold-light/85 underline decoration-gold-light/40 underline-offset-4"
                      >
                        Skip to letter
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.section>
          ) : (
            <motion.section key="letter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <FinalLetter instant={rewatching || finaleEntry === "letters"} onSigned={handleSigned} />
              {signed && (
                <motion.div
                  ref={lettersRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: rewatching ? 0 : 3, ease: EASE_SOFT }}
                >
                  <OpenWhenLetters />
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
