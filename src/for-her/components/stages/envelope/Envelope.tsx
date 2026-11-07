import { motion } from "framer-motion";
import { EASE_SOFT } from "../../../lib/motion";
import { WaxSeal } from "./WaxSeal";

export type EnvelopePhase = "sealed" | "breaking" | "opening" | "rising" | "reading";

const FLAP_SHAPE = "polygon(0 0, 100% 0, 50% 100%)";
/** The front pocket: everything except the V where the flap tucks in */
const POCKET_SHAPE = "polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)";

/**
 * A CSS-3D envelope. The flap swings open on its top hinge (rotateX inside a perspective
 * container) and the letter lifts out towards the viewer (translateZ).
 */
export function Envelope({ phase, initial }: { phase: EnvelopePhase; initial: string }) {
  const flapOpen = phase === "opening" || phase === "rising" || phase === "reading";
  const letterOut = phase === "rising" || phase === "reading";

  return (
    <div className="relative aspect-[3/2] w-[min(84vw,340px)]" style={{ perspective: 1100 }}>
      {/* Back of the envelope */}
      <div
        className="absolute inset-0 rounded-[10px]"
        style={{
          background: "linear-gradient(180deg, #E9BFB5 0%, #DFA99E 100%)",
          boxShadow: "0 28px 50px -20px rgba(110,40,55,0.5)",
        }}
      />

      {/* The letter, tucked inside */}
      <motion.div
        className="fh-paper absolute inset-x-[7%] top-[5%] bottom-[5%] z-[2] rounded-[4px] px-[9%] pt-[8%] shadow-[0_6px_16px_-8px_rgba(70,40,47,0.35)]"
        initial={false}
        animate={letterOut ? { y: "-60%", z: 50, rotateX: -4 } : { y: 0, z: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: EASE_SOFT }}
      >
        <p className="text-center font-display text-lg italic text-gold-ink">Happy Birthday</p>
        <div className="mx-auto mt-3 space-y-2 opacity-40" aria-hidden>
          {[92, 100, 84, 96, 60].map((w, i) => (
            <div key={i} className="h-px bg-ink-soft" style={{ width: `${w}%` }} />
          ))}
        </div>
      </motion.div>

      {/* Front pocket */}
      <div
        className="absolute inset-0 z-[3] rounded-[10px]"
        style={{
          clipPath: POCKET_SHAPE,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%), linear-gradient(180deg, #F3D2CA 0%, #EBBFB5 100%)",
        }}
      />
      {/* Fold lines from the bottom corners */}
      <svg
        className="pointer-events-none absolute inset-0 z-[3] size-full"
        viewBox="0 0 300 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 200 L150 112 L300 200" fill="none" stroke="rgba(142,47,66,0.16)" strokeWidth="1.2" />
      </svg>

      {/* Flap: two faces back to back so the inside lining shows once it flips open */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[58%]"
        style={{ transformOrigin: "50% 0%", transformStyle: "preserve-3d", zIndex: letterOut ? 1 : 4 }}
        initial={false}
        animate={{ rotateX: flapOpen ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.5, 0, 0.25, 1] }}
      >
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{
            clipPath: FLAP_SHAPE,
            background: "linear-gradient(180deg, #E7B6AB 0%, #F0C9C0 100%)",
          }}
        />
        <div
          className="absolute inset-0 [backface-visibility:hidden]"
          style={{
            clipPath: FLAP_SHAPE,
            transform: "rotateX(180deg)",
            background:
              "repeating-linear-gradient(135deg, rgba(201,162,95,0.16) 0 6px, rgba(201,162,95,0) 6px 12px), #FBEDE6",
          }}
        />
      </motion.div>

      {/* Seal sits on the tip of the flap */}
      <div className="absolute left-1/2 top-[58%] z-[5] -translate-x-1/2 -translate-y-1/2">
        <WaxSeal initial={initial} broken={phase !== "sealed"} />
      </div>
    </div>
  );
}
