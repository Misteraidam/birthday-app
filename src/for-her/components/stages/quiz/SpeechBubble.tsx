import { motion } from "framer-motion";

/** The playful reaction to a wrong answer. Re-key it to make it pop again. */
export function SpeechBubble({ text }: { text: string }) {
  return (
    <motion.div
      role="status"
      className="relative mx-auto w-fit max-w-[92%] rounded-[20px] rounded-bl-[6px] border border-blush-300 bg-paper px-4 py-2.5 shadow-[0_10px_24px_-14px_rgba(110,40,55,0.6)]"
      style={{ transformOrigin: "0% 100%" }}
      initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
      animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
    >
      <p className="font-hand text-[1.45rem] leading-tight text-wine">{text}</p>
    </motion.div>
  );
}
