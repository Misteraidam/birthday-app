import { motion } from "framer-motion";

const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z";

/** A softly beating heart while a stage (or the 3D scene) loads. */
export function StageLoading({ dark = false }: { dark?: boolean }) {
  return (
    <div role="status" className="grid min-h-dvh place-items-center">
      <div className="flex flex-col items-center gap-4">
        <motion.svg
          aria-hidden
          viewBox="0 0 24 24"
          className="size-10"
          animate={{ scale: [1, 1.14, 1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d={HEART_PATH} fill={dark ? "#E8D3A2" : "#C25B6E"} />
        </motion.svg>
        <p className={`font-display text-lg italic ${dark ? "text-gold-light/80" : "text-ink-soft"}`}>
          Just a moment…
        </p>
      </div>
    </div>
  );
}
