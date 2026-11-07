import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import type { Memory } from "../../../content/config";
import { EASE_SOFT } from "../../../lib/motion";
import { useCardTilt } from "../../../lib/useCardTilt";
import type { GyroTilt } from "../../../lib/useGyroTilt";

interface MemoryCardProps {
  memory: Memory;
  /** Which side of the centre line on wide screens; phones always sit right of the line */
  side: "left" | "right";
  gyro: GyroTilt;
  tiltEnabled: boolean;
  onOpenPhoto: () => void;
}

/** Each layer reveals a beat after the one beneath it */
const layer = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_SOFT } },
};

export function MemoryCard({ memory, side, gyro, tiltEnabled, onOpenPhoto }: MemoryCardProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [lit, setLit] = useState(false);
  const { x, y, rotateX, rotateY, handlers } = useCardTilt(gyro, tiltEnabled);

  // The dot lights once the card's top crosses the middle of the screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setLit(v > 0));

  // The photo drifts the other way inside its frame: the "looking through a window" feel
  const photoX = useTransform(x, (v) => v * -9);
  const photoY = useTransform(y, (v) => v * -9);

  return (
    <li ref={ref} className="relative pl-12 md:pl-0">
      {/* Dot on the line */}
      <span
        aria-hidden
        className={`absolute left-[15px] top-12 size-3.5 rounded-full border transition-all duration-700 md:left-1/2 md:-ml-[7px] ${
          lit
            ? "border-gold bg-gold shadow-[0_0_0_5px_rgba(201,162,95,0.22),0_0_18px_4px_rgba(232,211,162,0.9)]"
            : "border-gold/60 bg-cream"
        }`}
      />

      <motion.div
        className={`md:w-1/2 ${side === "right" ? "md:ml-auto md:pl-12" : "md:pr-12"}`}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 48 },
          shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_SOFT, staggerChildren: 0.14 } },
        }}
      >
        <div style={{ perspective: 900 }}>
          <motion.div
            {...handlers}
            className="relative"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", touchAction: "pan-y" }}
          >
            {/* Layer 1: the frame */}
            <div className="fh-paper absolute inset-0 rounded-[22px] border border-gold/30 shadow-[0_26px_50px_-24px_rgba(110,40,55,0.55)]" />

            <div className="relative p-3.5 pb-6" style={{ transformStyle: "preserve-3d" }}>
              {/* Layer 2: the photo */}
              <motion.div variants={layer} style={{ z: 22 }}>
                <button
                  type="button"
                  onClick={onOpenPhoto}
                  aria-label={`Open photo: ${memory.title}`}
                  className="block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[14px] bg-[#EDE3D6]"
                >
                  <motion.img
                    src={memory.photo}
                    alt=""
                    loading="lazy"
                    draggable={false}
                    className="size-full object-cover"
                    style={{ x: photoX, y: photoY, scale: 1.1 }}
                  />
                </button>
              </motion.div>

              {/* Layer 3: the words, closest to her */}
              <motion.div variants={layer} className="px-2.5 pt-5" style={{ z: 40 }}>
                <p className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.25em] text-gold-ink">
                  {memory.date}
                </p>
                <h3 className="mt-1.5 font-display text-[1.75rem] font-medium leading-[1.12] text-ink">
                  {memory.title}
                </h3>
                <p className="mt-2.5 font-body text-[0.98rem] leading-[1.7] text-ink-soft">{memory.caption}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </li>
  );
}
