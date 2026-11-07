import type { CSSProperties } from "react";

const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z";

/** Deterministic pseudo-random in [0, 1), so the layout doesn't reshuffle on re-render. */
const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const HEARTS = Array.from({ length: 12 }, (_, i) => ({
  left: 4 + rand(i + 1) * 92,
  top: 6 + rand(i + 31) * 88,
  size: 10 + rand(i + 7) * 16,
  duration: 20 + rand(i + 13) * 14,
  delay: rand(i + 19) * 30,
  drift: (rand(i + 23) - 0.5) * 70,
  opacity: 0.25 + rand(i + 29) * 0.3,
  gold: i % 3 === 0,
}));

/** Soft gradient with slow floating hearts. Sits behind every stage so transitions never flash. */
export function Backdrop() {
  return (
    <div aria-hidden className="fh-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {HEARTS.map((h, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`fh-heart ${h.gold ? "text-gold" : "text-blush-400"}`}
          style={
            {
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
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
    </div>
  );
}
