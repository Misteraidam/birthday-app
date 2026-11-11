import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { EASE_SOFT } from "../../../lib/motion";
import { setMusicLevel } from "../../../lib/music";

interface VideoMessageProps {
  src: string;
  poster: string;
  onEnded: () => void;
  /** The video couldn't load: move on rather than leave her stuck */
  onFailed: () => void;
}

/** The video in a soft gold frame. Music pauses while it plays and fades back when it ends. */
export function VideoMessage({ src, poster, onEnded, onFailed }: VideoMessageProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  // Portrait until the video says otherwise, so the frame has a sensible size from the start
  const [aspect, setAspect] = useState(9 / 16);

  const play = () => {
    const v = video.current;
    if (!v) return;
    setStarted(true);
    setMusicLevel("off", 300);
    // play() inside the tap, so phones allow sound
    v.play().catch(() => setStarted(false));
  };

  return (
    <motion.div
      className="relative mx-auto max-w-full rounded-[26px] bg-gradient-to-b from-gold-light via-gold/80 to-gold-light/70 p-[3px] shadow-[0_0_60px_-6px_rgba(232,211,162,0.55),0_30px_60px_-20px_rgba(0,0,0,0.6)]"
      style={{ aspectRatio: aspect, width: `min(86vw, calc(58dvh * ${aspect}))` }}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE_SOFT }}
    >
      <video
        ref={video}
        src={src}
        poster={poster || undefined}
        // Inline on iPhone instead of jumping to fullscreen
        playsInline
        preload="metadata"
        controls={started}
        onLoadedMetadata={(event) => {
          const { videoWidth, videoHeight } = event.currentTarget;
          if (videoWidth && videoHeight) setAspect(videoWidth / videoHeight);
        }}
        onPlay={() => {
          setStarted(true);
          setMusicLevel("off", 300);
        }}
        onEnded={() => {
          setMusicLevel("full", 2500);
          onEnded();
        }}
        onError={onFailed}
        className="block size-full rounded-[23px] object-contain"
        // Shows when there's no poster: a soft warm gradient rather than a black box
        style={{ background: "radial-gradient(120% 80% at 50% 30%, #6B3A3E 0%, #3A1E21 55%, #1C0D0F 100%)" }}
      />

      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label="Play your video message"
          className="absolute inset-0 grid place-items-center rounded-[23px] bg-black/15"
        >
          <motion.span
            className="grid size-20 place-items-center rounded-full bg-cream/90 text-wine shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5)] backdrop-blur"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Play size={30} fill="currentColor" className="ml-1" />
          </motion.span>
        </button>
      )}
    </motion.div>
  );
}
