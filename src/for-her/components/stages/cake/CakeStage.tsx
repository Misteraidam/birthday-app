import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { config } from "../../../content/config";
import { celebrate } from "../../../lib/confetti";
import { useJourney } from "../../../lib/journey";
import { EASE_SOFT } from "../../../lib/motion";
import { duckMusic } from "../../../lib/music";
import { useBlowDetector } from "../../../lib/useBlowDetector";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { StageLoading } from "../../ui/StageLoading";
import { BreathMeter } from "./BreathMeter";
import { CakeScene } from "./CakeScene";

const CANDLES = Math.max(1, Math.min(24, Math.round(config.candleCount)));
const FINAL_BUTTON_DELAY_MS = 3500;

export default function CakeStage() {
  const { cakeDone, finishCake, complete } = useJourney();
  const reduceMotion = useReducedMotion() ?? false;
  const [revisiting] = useState(cakeDone);
  const [lit, setLit] = useState<boolean[]>(() => Array(CANDLES).fill(!cakeDone));
  const [tapMode, setTapMode] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [showFinalButton, setShowFinalButton] = useState(cakeDone);

  const litCount = lit.filter(Boolean).length;
  const allOut = litCount === 0;

  const blowOutOne = useCallback(() => {
    setLit((prev) => {
      const i = prev.indexOf(true);
      if (i < 0) return prev;
      const next = [...prev];
      next[i] = false;
      return next;
    });
  }, []);

  const tapCandle = useCallback((index: number) => {
    setLit((prev) => {
      if (!prev[index]) return prev;
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }, []);

  const mic = useBlowDetector({ candleCount: CANDLES, litCount, onBlowOutOne: blowOutOne });
  const stopMic = mic.stop;
  const micUnavailable = mic.status === "denied" || mic.status === "unsupported";
  const tappable = !allOut && (tapMode || micUnavailable);

  // Quieter music while she's blowing, back up for the celebration
  const micActive = mic.status === "calibrating" || mic.status === "listening";
  useEffect(() => {
    if (!micActive) return;
    duckMusic(true);
    return () => duckMusic(false);
  }, [micActive]);

  // The moment the last candle goes out
  const celebrated = useRef(cakeDone);
  useEffect(() => {
    if (!allOut || celebrated.current) return;
    celebrated.current = true;
    stopMic(); // release the microphone straight away
    finishCake();
    celebrate();
  }, [allOut, stopMic, finishCake]);

  useEffect(() => {
    if (!allOut || revisiting) return;
    const timer = setTimeout(() => setShowFinalButton(true), FINAL_BUTTON_DELAY_MS);
    return () => clearTimeout(timer);
  }, [allOut, revisiting]);

  const switchToTaps = () => {
    stopMic();
    setTapMode(true);
  };

  return (
    <div className="relative h-dvh overflow-hidden">
      {/* Dark, warm room so the flames glow */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 50% 45%, #4A2A2C 0%, #2C1719 55%, #170B0D 100%)",
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: sceneReady ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <CakeScene
          lit={lit}
          blow={mic.intensity}
          reduceMotion={reduceMotion}
          tappable={tappable}
          onTapCandle={tapCandle}
          celebrating={allOut}
          onReady={() => setSceneReady(true)}
        />
      </motion.div>

      <AnimatePresence>
        {!sceneReady && (
          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <StageLoading dark />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heading */}
      <motion.h1
        className="pointer-events-none absolute inset-x-0 px-6 text-center font-display text-[2.3rem] font-medium leading-tight text-cream"
        style={{ top: "calc(max(12px, env(safe-area-inset-top)) + 64px)", textShadow: "0 2px 18px rgba(0,0,0,0.45)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: sceneReady ? 1 : 0, y: sceneReady ? 0 : 10 }}
        transition={{ duration: 1.2, delay: revisiting ? 0 : 0.9, ease: EASE_SOFT }}
      >
        Make a wish, {config.herName} ✨
      </motion.h1>

      {/* Controls under the cake */}
      <div
        className="absolute inset-x-0 bottom-0 flex min-h-[200px] flex-col items-center justify-end px-6 text-center"
        style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}
      >
        <AnimatePresence mode="wait">
          {allOut ? (
            <motion.div
              key="celebrate"
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: revisiting ? 0 : 0.6, ease: EASE_SOFT }}
            >
              <p className="max-w-[24ch] font-hand text-[2rem] leading-tight text-gold-light">{config.cakeMessage}</p>
              <div className="mt-6 min-h-12">
                <AnimatePresence>
                  {showFinalButton && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_SOFT }}>
                      <PrimaryButton onClick={() => complete("cake")}>Your final surprise 💌</PrimaryButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : tappable ? (
            <Prompt key="tap" text="Tap the candles to blow them out 🕯️" note={micUnavailable ? "No microphone? No problem." : undefined} />
          ) : mic.status === "idle" ? (
            <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: sceneReady ? 1 : 0 }} transition={{ delay: revisiting ? 0 : 1.6, duration: 0.6 }}>
              <PrimaryButton onClick={mic.start}>Ready to blow? 🌬️</PrimaryButton>
            </motion.div>
          ) : mic.status === "requesting" ? (
            <Prompt key="requesting" text="Allow the microphone so you can blow ✨" />
          ) : mic.status === "calibrating" ? (
            <Prompt key="calibrating" text="Shh… listening to the room" />
          ) : (
            <motion.div key="listening" className="flex flex-col items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-display text-[1.7rem] italic text-cream">Blow into your mic 🌬️</p>
              <BreathMeter meter={mic.meter} blow={mic.intensity} />
              <div className="min-h-11">
                {mic.silentTooLong && (
                  <button
                    type="button"
                    onClick={switchToTaps}
                    className="min-h-11 px-3 text-sm italic text-gold-light/85 underline decoration-gold-light/40 underline-offset-4"
                  >
                    Tap the candles instead
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Prompt({ text, note }: { text: string; note?: string }) {
  return (
    <motion.div className="mb-11" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <p className="font-display text-[1.6rem] italic leading-snug text-cream">{text}</p>
      {note && <p className="mt-2 text-sm italic text-gold-light/75">{note}</p>}
    </motion.div>
  );
}
