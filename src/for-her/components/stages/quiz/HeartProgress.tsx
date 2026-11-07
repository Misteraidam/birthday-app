import { motion } from "framer-motion";

const HEART_PATH =
  "M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.6.7-1.4 2.2-2.6 4.3-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z";

/** One heart per question; each fills in once that question is answered. */
export function HeartProgress({ total, answered, current }: { total: number; answered: number; current: number }) {
  return (
    <div className="flex justify-center gap-2.5">
      <p className="sr-only">
        Question {Math.min(current + 1, total)} of {total}
      </p>
      {Array.from({ length: total }, (_, i) => {
        const filled = i < answered;
        const isCurrent = i === current && !filled;
        return (
          <motion.svg
            key={i}
            aria-hidden
            viewBox="0 0 24 24"
            className="size-[22px]"
            initial={false}
            animate={{ scale: filled ? [1, 1.35, 1] : isCurrent ? 1.1 : 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <path d={HEART_PATH} fill="none" stroke={isCurrent ? "#C9A25F" : "#C9A5A8"} strokeWidth="1.6" />
            <motion.path
              d={HEART_PATH}
              fill="#C25B6E"
              initial={false}
              animate={{ opacity: filled ? 1 : 0 }}
              transition={{ duration: 0.35 }}
            />
          </motion.svg>
        );
      })}
    </div>
  );
}
