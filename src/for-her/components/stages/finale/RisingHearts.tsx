import type { CSSProperties } from "react";
import { motion } from "framer-motion";

const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z";

const rand = (seed: number) => {
  const x = Math.sin(seed * 7919 + 104729) * 15485863;
  return x - Math.floor(x);
};

const HEARTS = Array.from({ length: 14 }, (_, i) => ({
  left: 3 + rand(i + 1) * 94,
  top: 10 + rand(i + 50) * 80,
  size: 12 + rand(i + 5) * 18,
  duration: 12 + rand(i + 9) * 10,
  delay: rand(i + 15) * 20,
  drift: (rand(i + 21) - 0.5) * 80,
  opacity: 0.35 + rand(i + 27) * 0.4,
  color: ["#E4928A", "#C25B6E", "#E8D3A2", "#F6D3CC"][i % 4],
}));

/** Hearts floating up through the finale once the letter is signed. Reuses the backdrop's float animation. */
export function RisingHearts() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {HEARTS.map((h, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="fh-heart"
          style={
            {
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              color: h.color,
              "--top": `${h.top}%`,
              "--dur": `${h.duration}s`,
              "--delay": `-${h.delay}s`,
              "--drift": `${h.drift}px`,
              "--op": h.opacity,
            } as CSSProperties
          }
        >
          <path d={HEART_PATH} fill="currentColor" />
        </svg>
      ))}
    </motion.div>
  );
}
