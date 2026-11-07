import { motion, type HTMLMotionProps } from "framer-motion";

/** The gold pill used for every "move forward" action. */
export function PrimaryButton({ className = "", children, ...props }: HTMLMotionProps<"button">) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      className={`min-h-12 rounded-full bg-gradient-to-b from-gold-light to-gold px-9 py-3 font-display text-xl font-semibold tracking-wide text-ink shadow-[0_10px_24px_-10px_rgba(122,90,34,0.7),inset_0_1px_0_rgba(255,255,255,0.6)] ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
