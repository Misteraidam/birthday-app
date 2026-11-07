import { motion, useTransform, type MotionValue } from "framer-motion";

/** A soft bar that fills as she blows, with a glow that breathes with how hard she's blowing. */
export function BreathMeter({ meter, blow }: { meter: MotionValue<number>; blow: MotionValue<number> }) {
  const glow = useTransform(blow, (v) => 0.15 + v * 0.85);

  return (
    <div className="w-[min(72vw,260px)]">
      <div
        aria-hidden
        className="relative h-3 overflow-hidden rounded-full bg-cream/15 ring-1 ring-gold-light/30"
      >
        <motion.div className="absolute inset-0 bg-gold-light/40 blur-[6px]" style={{ opacity: glow }} />
        <motion.div
          className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-blush-300 via-gold-light to-gold"
          style={{ scaleX: meter }}
        />
      </div>
    </div>
  );
}
