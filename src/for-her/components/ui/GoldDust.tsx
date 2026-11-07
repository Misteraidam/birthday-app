import type { CSSProperties } from "react";

const rand = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const MOTES = Array.from({ length: 26 }, (_, i) => ({
  left: rand(i + 3) * 100,
  top: 20 + rand(i + 41) * 85,
  size: 3 + rand(i + 11) * 7,
  duration: 14 + rand(i + 17) * 14,
  delay: rand(i + 23) * 28,
  drift: (rand(i + 29) - 0.5) * 60,
  opacity: 0.35 + rand(i + 37) * 0.5,
}));

/** Slow-drifting golden motes for the finale's dim, warm room. */
export function GoldDust() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="fh-dust"
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              "--dur": `${m.duration}s`,
              "--delay": `-${m.delay}s`,
              "--drift": `${m.drift}px`,
              "--op": m.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
