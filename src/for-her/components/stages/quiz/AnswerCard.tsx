import { useEffect, type MouseEvent } from "react";
import { Check } from "lucide-react";
import { motion, useAnimationControls } from "framer-motion";

export type AnswerState = "idle" | "wrong" | "right";

interface AnswerCardProps {
  label: string;
  /** "A", "B", "C"... */
  marker: string;
  state: AnswerState;
  /** Increments every time this card should shake */
  shakeSignal: number;
  disabled: boolean;
  onPick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const STYLES: Record<AnswerState, string> = {
  idle: "border-gold/35 bg-cream/90",
  wrong: "border-blush-400/70 bg-[#FBE0DB]",
  right: "border-gold bg-gradient-to-b from-[#FFF4DC] to-[#F6E2B6] shadow-[0_0_0_4px_rgba(201,162,95,0.22)]",
};

export function AnswerCard({ label, marker, state, shakeSignal, disabled, onPick }: AnswerCardProps) {
  const controls = useAnimationControls();

  // A gentle "nope" wobble. Reduced motion turns this into nothing (MotionConfig skips transforms).
  useEffect(() => {
    if (shakeSignal > 0) controls.start({ x: [0, -9, 8, -6, 4, -2, 0], transition: { duration: 0.45 } });
  }, [shakeSignal, controls]);

  return (
    <motion.button
      type="button"
      onClick={onPick}
      disabled={disabled}
      animate={controls}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`flex min-h-[60px] w-full items-center gap-3.5 rounded-2xl border px-4 py-3 text-left shadow-[0_6px_16px_-12px_rgba(110,40,55,0.5)] transition-[background-color,border-color,opacity] duration-300 ${STYLES[state]} ${
        disabled && state !== "right" ? "opacity-55" : ""
      }`}
    >
      <span
        aria-hidden
        className={`grid size-8 shrink-0 place-items-center rounded-full border font-display text-base font-semibold transition-colors duration-300 ${
          state === "right" ? "border-gold bg-gold text-cream" : "border-gold/50 text-gold-ink"
        }`}
      >
        {state === "right" ? <Check size={16} strokeWidth={2.5} /> : marker}
      </span>
      <span className="font-body text-[1.04rem] leading-snug text-ink">{label}</span>
    </motion.button>
  );
}
