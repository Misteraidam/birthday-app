import { Suspense, useEffect } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { stageComponents } from "./components/stages";
import { Backdrop } from "./components/ui/Backdrop";
import { JourneyNav } from "./components/ui/JourneyNav";
import { MuteToggle } from "./components/ui/MuteToggle";
import { JourneyProvider, useJourney } from "./lib/journey";
import { EASE_SOFT } from "./lib/motion";
import { STAGES, stageIndex } from "./lib/stages";

export default function App() {
  return (
    // "user": transform animations switch off for anyone with reduced motion turned on
    <MotionConfig reducedMotion="user">
      <JourneyProvider>
        <Backdrop />
        <JourneyNav />
        <MuteToggle />
        <StageView />
      </JourneyProvider>
    </MotionConfig>
  );
}

function StageView() {
  const { current } = useJourney();
  const Stage = stageComponents[current];

  useEffect(() => {
    const next = STAGES[stageIndex(current) + 1];
    if (next) stageComponents[next].preload?.();
  }, [current]);

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={current}
        className="relative min-h-dvh"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.55, ease: EASE_SOFT }}
      >
        <Suspense fallback={null}>
          <Stage />
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
}
