import { Suspense, useEffect } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { stageComponents } from "./components/stages";
import WelcomeBack from "./components/stages/welcome/WelcomeBack";
import { Backdrop } from "./components/ui/Backdrop";
import { JourneyNav } from "./components/ui/JourneyNav";
import { MuteToggle } from "./components/ui/MuteToggle";
import { StageLoading } from "./components/ui/StageLoading";
import { JourneyProvider, useJourney } from "./lib/journey";
import { EASE_SOFT } from "./lib/motion";
import { DARK_STAGES, STAGES, stageIndex } from "./lib/stages";

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
  const { current, welcomeBack } = useJourney();
  const Stage = stageComponents[current];

  useEffect(() => {
    // Returning visitors are most likely headed for the finale
    const next = welcomeBack ? "finale" : STAGES[stageIndex(current) + 1];
    if (next) stageComponents[next].preload?.();
  }, [current, welcomeBack]);

  return (
    // Each stage starts at the top, once the previous one has faded out
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.main
        key={welcomeBack ? "welcome" : current}
        className="relative min-h-dvh"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.55, ease: EASE_SOFT }}
      >
        {welcomeBack ? (
          <WelcomeBack />
        ) : (
          <Suspense fallback={<StageLoading dark={DARK_STAGES.has(current)} />}>
            <Stage />
          </Suspense>
        )}
      </motion.main>
    </AnimatePresence>
  );
}
