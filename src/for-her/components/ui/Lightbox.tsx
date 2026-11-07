import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_SOFT } from "../../lib/motion";

export interface LightboxPhoto {
  src: string;
  caption: string;
}

/** Full-screen photo over a soft blur. Tap anywhere (or Esc) to close. */
export function Lightbox({ photo, onClose }: { photo: LightboxPhoto | null; onClose: () => void }) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const isOpen = photo !== null;
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onCloseRef.current();
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  // Portalled to <body> so no tilted or transformed ancestor can trap the fixed overlay
  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.button
          key={photo.src}
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close photo"
          className="fixed inset-0 z-[70] flex cursor-zoom-out flex-col items-center justify-center gap-4 bg-[#46282F]/40 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src={photo.src}
            alt={photo.caption}
            className="max-h-[78dvh] max-w-full rounded-xl object-contain shadow-[0_30px_80px_-20px_rgba(40,10,20,0.7)]"
            initial={{ scale: 0.88, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 8 }}
            transition={{ duration: 0.45, ease: EASE_SOFT }}
            draggable={false}
          />
          <p className="max-w-sm text-center font-hand text-[1.7rem] leading-tight text-cream drop-shadow">
            {photo.caption}
          </p>
        </motion.button>
      )}
    </AnimatePresence>,
    document.body,
  );
}
