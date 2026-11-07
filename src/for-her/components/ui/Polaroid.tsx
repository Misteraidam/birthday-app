import { useState } from "react";
import { motion } from "framer-motion";

interface PolaroidProps {
  src: string;
  caption: string;
  /** Resting rotation in degrees */
  tilt?: number;
  /** Play the "developing" reveal: washed-out and blurry, slowly coming into full colour */
  develop?: boolean;
  className?: string;
  captionClassName?: string;
}

const UNDEVELOPED = "blur(6px) saturate(0.15) sepia(0.35) brightness(1.35) contrast(0.7)";
const DEVELOPED = "blur(0px) saturate(1) sepia(0) brightness(1) contrast(1)";
const DEVELOP_SECONDS = 1.5;

export function Polaroid({ src, caption, tilt = 0, develop = false, className = "", captionClassName = "" }: PolaroidProps) {
  // Wait for the photo to arrive before developing it, so the effect isn't wasted on a blank frame
  const [loaded, setLoaded] = useState(false);
  const developing = develop && loaded;

  return (
    <figure
      className={`rounded-[3px] bg-[#FFFDF8] p-[6%] pb-0 shadow-[0_18px_40px_-16px_rgba(70,40,47,0.55),0_2px_6px_rgba(70,40,47,0.12)] ${className}`}
      style={{ rotate: `${tilt}deg` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE3D6]">
        <motion.img
          src={src}
          alt={caption}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className="size-full object-cover"
          initial={false}
          animate={{ filter: !develop || developing ? DEVELOPED : UNDEVELOPED }}
          transition={{ duration: developing ? DEVELOP_SECONDS : 0, ease: "easeOut" }}
          draggable={false}
        />
        {develop && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[#F8F1E4]"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: developing ? 0 : 0.85 }}
            transition={{ duration: DEVELOP_SECONDS, ease: "easeOut" }}
          />
        )}
      </div>
      <motion.figcaption
        className={`flex min-h-[3.2em] items-center justify-center px-1 py-2 text-center font-hand leading-tight text-ink ${captionClassName}`}
        // Written in left to right once the photo has mostly developed
        initial={develop ? { clipPath: "inset(0 100% 0 0)" } : false}
        animate={{ clipPath: !develop || developing ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={{ duration: 1.1, delay: developing ? DEVELOP_SECONDS * 0.7 : 0, ease: "easeInOut" }}
      >
        {caption}
      </motion.figcaption>
    </figure>
  );
}
