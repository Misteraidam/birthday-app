import { motion } from "framer-motion";

// Both halves share the same jagged crack line, so they fit together until it breaks
const LEFT_HALF = "polygon(0 0, 53% 0, 45% 30%, 55% 58%, 47% 100%, 0 100%)";
const RIGHT_HALF = "polygon(53% 0, 100% 0, 100% 100%, 47% 100%, 55% 58%, 45% 30%)";

function SealFace({ initial }: { initial: string }) {
  return (
    <div
      className="absolute inset-0 grid place-items-center"
      style={{
        borderRadius: "47% 53% 50% 50% / 52% 47% 53% 48%",
        background: "radial-gradient(circle at 34% 28%, #C9566B 0%, #9A3449 45%, #6E2033 100%)",
        boxShadow: "inset 0 -3px 6px rgba(60,10,22,0.55), inset 0 3px 5px rgba(255,190,200,0.35)",
      }}
    >
      <div className="absolute inset-[7px] rounded-full border border-gold-light/45" />
      <span
        className="font-display text-[30px] font-semibold italic leading-none text-gold-light"
        style={{ textShadow: "0 1px 0 rgba(60,10,22,0.6)" }}
      >
        {initial}
      </span>
    </div>
  );
}

export function WaxSeal({ initial, broken }: { initial: string; broken: boolean }) {
  const halves = [
    { clip: LEFT_HALF, away: { x: -20, y: 54, rotate: -28 } },
    { clip: RIGHT_HALF, away: { x: 20, y: 50, rotate: 24 } },
  ];
  return (
    <div className="relative size-16">
      {/* Drop shadow on its own layer: on the halves, the crack clip-paths would cut it into a square */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full shadow-[0_4px_10px_rgba(80,20,35,0.45)]"
        initial={false}
        animate={{ opacity: broken ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      />
      {halves.map(({ clip, away }, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ clipPath: clip }}
          initial={false}
          animate={broken ? { ...away, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.45, 0, 0.7, 1], opacity: { delay: 0.25, duration: 0.35 } }}
        >
          <SealFace initial={initial} />
        </motion.div>
      ))}
    </div>
  );
}
