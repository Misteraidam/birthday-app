import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { config } from "../../../content/config";
import { useJourney } from "../../../lib/journey";
import { EASE_SOFT } from "../../../lib/motion";
import { useGyroTilt } from "../../../lib/useGyroTilt";
import { Lightbox, type LightboxPhoto } from "../../ui/Lightbox";
import { PrimaryButton } from "../../ui/PrimaryButton";
import { MemoryCard } from "./MemoryCard";

export default function TimelineStage() {
  const { motionPermission, complete } = useJourney();
  const reduceMotion = useReducedMotion();
  const tiltEnabled = !reduceMotion;
  // Gyro only with permission from the first tap; otherwise cards fall back to touch tilt
  const gyro = useGyroTilt(tiltEnabled && motionPermission === "granted");
  const [openPhoto, setOpenPhoto] = useState<LightboxPhoto | null>(null);

  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });
  const lineProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <div
      className="mx-auto w-full max-w-md px-4 md:max-w-4xl"
      style={{
        paddingTop: "calc(max(12px, env(safe-area-inset-top)) + 76px)",
        paddingBottom: "max(48px, env(safe-area-inset-bottom))",
      }}
    >
      <header className="mb-14 text-center">
        <p className="font-display text-sm uppercase tracking-[0.3em] text-gold-ink">Chapter three</p>
        <h1 className="mt-2 font-display text-[2.8rem] font-medium leading-none text-ink">Our story</h1>
        <AnimatePresence>
          {tiltEnabled && (
            <motion.p
              key={gyro.active ? "gyro" : "touch"}
              className="mt-3 text-sm italic text-ink-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {gyro.active ? "Tilt your phone gently ✨" : "Scroll slowly ✨"}
            </motion.p>
          )}
        </AnimatePresence>
      </header>

      <div className="relative">
        {/* The gold line: a faint track, and the bright part drawing itself as she scrolls */}
        <div aria-hidden className="absolute bottom-6 left-[22px] top-12 w-0.5 -translate-x-1/2 md:left-1/2">
          <div className="absolute inset-0 rounded-full bg-gold/20" />
          <motion.div
            className="absolute inset-0 origin-top rounded-full bg-gradient-to-b from-gold-light via-gold to-gold shadow-[0_0_10px_rgba(201,162,95,0.6)]"
            style={{ scaleY: lineProgress }}
          />
        </div>

        <ol ref={listRef} className="relative flex flex-col gap-16">
          {config.memories.map((memory, i) => (
            <MemoryCard
              key={i}
              memory={memory}
              side={i % 2 === 0 ? "left" : "right"}
              gyro={gyro}
              tiltEnabled={tiltEnabled}
              onOpenPhoto={() => setOpenPhoto({ src: memory.photo, caption: memory.title })}
            />
          ))}
        </ol>
      </div>

      <motion.footer
        className="mt-24 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: EASE_SOFT }}
      >
        <p className="max-w-[18ch] font-display text-[2.1rem] italic leading-tight text-ink">{config.timelineOutro}</p>
        <div className="mt-10">
          <PrimaryButton onClick={() => complete("timeline")}>One more surprise 🎂</PrimaryButton>
        </div>
      </motion.footer>

      <Lightbox photo={openPhoto} onClose={() => setOpenPhoto(null)} />
    </div>
  );
}
