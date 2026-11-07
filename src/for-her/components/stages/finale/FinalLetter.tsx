import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { config } from "../../../content/config";
import { EASE_SOFT } from "../../../lib/motion";

const HEART_PATH =
  "M12 20.5s-7.2-4.4-9.2-8.8C1.4 8.4 3.4 4.8 6.9 4.8c2 0 3.4 1.1 4.1 2.4.7-1.3 2.1-2.4 4.1-2.4 3.5 0 5.5 3.6 4.1 6.9-2 4.4-9.2 8.8-9.2 8.8z";

/** Waits for a line to be read before showing the next: longer lines get longer */
const pauseAfter = (line: string) => Math.min(3400, 1100 + line.length * 32);
/** A line counts as on screen once its top is above this share of the viewport */
const VISIBLE_AT = 0.9;

interface FinalLetterProps {
  /** Show everything at once (revisits) */
  instant: boolean;
  onSigned: () => void;
}

/**
 * The love letter, line by line. Each line waits its turn, and for her to scroll to it;
 * a tap reveals the next line straight away. Then the signature, with a heart that draws itself.
 */
export function FinalLetter({ instant, onSigned }: FinalLetterProps) {
  const lines = useMemo(() => config.finaleLetter.split("\n"), []);
  /** Position of each line in the reveal order; blank lines are gaps, not steps */
  const order = useMemo(() => {
    let n = 0;
    return lines.map((line) => (line.trim() ? n++ : -1));
  }, [lines]);
  const total = order.filter((n) => n >= 0).length;

  const [revealed, setRevealed] = useState(instant ? total : 0);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const tapped = useRef(false);
  const onSignedRef = useRef(onSigned);
  const signed = revealed >= total;

  useEffect(() => {
    onSignedRef.current = onSigned;
  }, [onSigned]);

  // Reveal the next line after a reading pause, but only once she has scrolled to it
  useEffect(() => {
    if (signed) return;
    const nextIndex = order.indexOf(revealed);
    const previousIndex = order.indexOf(revealed - 1);
    const onScreen = () => {
      const el = lineRefs.current[nextIndex];
      return !el || el.getBoundingClientRect().top < window.innerHeight * VISIBLE_AT;
    };
    const advance = () => setRevealed((r) => Math.max(r, revealed + 1));
    const onScroll = () => {
      if (!onScreen()) return;
      window.removeEventListener("scroll", onScroll);
      advance();
    };
    const timer = setTimeout(
      () => (onScreen() ? advance() : window.addEventListener("scroll", onScroll, { passive: true })),
      revealed === 0 ? 700 : pauseAfter(lines[previousIndex] ?? ""),
    );
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [revealed, signed, order, lines]);

  // A tap-revealed line might be below the fold: bring it into view
  useEffect(() => {
    if (!tapped.current || revealed === 0) return;
    tapped.current = false;
    lineRefs.current[order.indexOf(revealed - 1)]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [revealed, order]);

  useEffect(() => {
    if (signed) onSignedRef.current();
  }, [signed]);

  const revealNext = () => {
    if (signed) return;
    tapped.current = true;
    setRevealed((r) => Math.min(total, r + 1));
  };

  return (
    <motion.article
      onClick={revealNext}
      className="fh-paper relative mx-auto w-full max-w-md rounded-[22px] px-8 pb-10 pt-12 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE_SOFT }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[15px] border border-gold/45" />

      {lines.map((line, i) =>
        order[i] < 0 ? (
          <div key={i} className="h-5" />
        ) : (
          <motion.p
            key={i}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="font-display text-[1.32rem] leading-[1.6] text-ink"
            initial={false}
            animate={order[i] < revealed ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 10, filter: "blur(4px)" }}
            transition={{ duration: instant ? 0 : 1.1, ease: EASE_SOFT }}
          >
            {line}
          </motion.p>
        ),
      )}

      {/* Signature */}
      <motion.div
        className="mt-8 flex items-center justify-end gap-2"
        initial={false}
        animate={{ opacity: signed ? 1 : 0 }}
        transition={{ duration: 1, delay: signed && !instant ? 0.4 : 0 }}
      >
        <span className="font-hand text-[2.3rem] leading-none text-wine">{config.myName}</span>
        <svg viewBox="0 0 24 24" className="size-8" aria-hidden>
          <motion.path
            d={HEART_PATH}
            fill="none"
            stroke="#C25B6E"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: signed ? 1 : 0, fill: signed ? "rgba(194,91,110,0.85)" : "rgba(194,91,110,0)" }}
            transition={{
              pathLength: { duration: instant ? 0 : 1.6, delay: instant ? 0 : 1, ease: "easeInOut" },
              fill: { duration: instant ? 0 : 0.8, delay: instant ? 0 : 2.5 },
            }}
          />
        </svg>
      </motion.div>

      {!signed && (
        <p aria-hidden className="mt-6 text-center text-xs uppercase tracking-[0.25em] text-ink-soft/60">
          Tap to continue
        </p>
      )}
    </motion.article>
  );
}
