import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { config } from "../../../content/config";
import { useJourney } from "../../../lib/journey";
import { EASE_SOFT } from "../../../lib/motion";
import { initialOf } from "../../../lib/text";
import { Envelope } from "../envelope/Envelope";
import { OpenWhenModal } from "./OpenWhenModal";

/** A row of sealed "open when" envelopes she can come back to. Opened ones stay unsealed. */
export function OpenWhenLetters() {
  const { openedLetters, markLetterOpened } = useJourney();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const letters = config.openWhen;
  if (letters.length === 0) return null;

  return (
    <section aria-labelledby="open-when-heading" className="mt-20">
      <h2 id="open-when-heading" className="text-center font-display text-[2rem] font-medium text-cream">
        A few letters for later 💌
      </h2>
      <p className="mt-2 text-center text-sm italic text-gold-light/75">Open them whenever you need them.</p>

      {/* Swipeable row on phones, a wrapped grid on wider screens */}
      <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-6 pt-14 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {letters.map((letter, i) => {
          const opened = openedLetters.includes(i);
          return (
            <motion.li
              key={i}
              className="shrink-0 snap-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE_SOFT }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="flex w-[150px] flex-col items-center gap-4 rounded-xl text-center"
                aria-label={`${letter.label}${opened ? " (opened)" : ""}`}
              >
                {/* The full-size envelope, shrunk: keeps the seal and flap proportions */}
                <div className="h-[100px] w-[150px]">
                  <div className="w-[300px] origin-top-left scale-50">
                    <Envelope
                      phase={opened ? "opening" : "sealed"}
                      initial={initialOf(config.myName)}
                      peek="For you"
                      className="w-[300px]"
                    />
                  </div>
                </div>
                <span className={`font-hand text-[1.35rem] leading-tight ${opened ? "text-gold-light/60" : "text-cream"}`}>
                  {letter.label}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      <AnimatePresence>
        {openIndex !== null && (
          <OpenWhenModal
            key={openIndex}
            letter={letters[openIndex]}
            alreadyOpen={openedLetters.includes(openIndex)}
            onOpened={() => markLetterOpened(openIndex)}
            onClose={() => setOpenIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
