import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useJourney } from "../../lib/journey";
import { STAGES, STAGE_LABELS, stageIndex } from "../../lib/stages";

/** Back button + progress dots. Hidden on the envelope so the opening stays uncluttered. */
export function JourneyNav() {
  const { current, unlocked, back, goTo } = useJourney();
  const currentIndex = stageIndex(current);

  return (
    <AnimatePresence>
      {currentIndex > 0 && (
        <motion.nav
          aria-label="Journey progress"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="fixed inset-x-0 z-40 flex items-center justify-center"
          style={{
            top: "max(12px, env(safe-area-inset-top))",
            paddingLeft: "max(12px, env(safe-area-inset-left))",
            paddingRight: "max(12px, env(safe-area-inset-right))",
          }}
        >
          {/* Soft fade so scrolling content doesn't clash with the controls */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -z-10 bg-gradient-to-b from-blush-100 via-blush-100/85 to-transparent"
            style={{
              top: "calc(-1 * max(12px, env(safe-area-inset-top)))",
              height: "calc(max(12px, env(safe-area-inset-top)) + 64px)",
            }}
          />
          <button
            type="button"
            onClick={back}
            aria-label={`Back to ${STAGE_LABELS[STAGES[currentIndex - 1]]}`}
            className="absolute left-[max(12px,env(safe-area-inset-left))] grid size-11 place-items-center rounded-full border border-gold/40 bg-cream/80 text-ink shadow-[0_6px_18px_-8px_rgba(110,40,55,0.45)] backdrop-blur-md"
          >
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>

          <ol className="flex">
            {STAGES.map((stage, i) => {
              const reachable = i <= unlocked;
              const isCurrent = i === currentIndex;
              return (
                <li key={stage}>
                  <button
                    type="button"
                    disabled={!reachable || isCurrent}
                    onClick={() => goTo(stage)}
                    aria-label={`${STAGE_LABELS[stage]}${reachable ? "" : " (locked)"}`}
                    aria-current={isCurrent ? "step" : undefined}
                    className="grid size-11 place-items-center disabled:cursor-default"
                  >
                    <span
                      className={`block rounded-full transition-all duration-500 ${
                        isCurrent
                          ? "h-2.5 w-6 bg-gold"
                          : reachable
                            ? "size-2.5 bg-gold/60"
                            : "size-2.5 border border-ink-soft/40"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
