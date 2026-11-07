import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { OpenWhenLetter } from "../../../content/config";
import { config } from "../../../content/config";
import { EASE_SOFT } from "../../../lib/motion";
import { initialOf } from "../../../lib/text";
import { Envelope } from "../envelope/Envelope";
import { useEnvelopeSequence } from "../envelope/useEnvelopeSequence";

interface OpenWhenModalProps {
  letter: OpenWhenLetter;
  /** Already opened on an earlier visit: skip straight to the letter */
  alreadyOpen: boolean;
  onOpened: () => void;
  onClose: () => void;
}

/** Cracks the seal (same sequence as the intro), then shows the letter. Esc or the X closes it. */
export function OpenWhenModal({ letter, alreadyOpen, onOpened, onClose }: OpenWhenModalProps) {
  const [phase, open] = useEnvelopeSequence(alreadyOpen ? "reading" : "sealed");
  const onCloseRef = useRef(onClose);
  const onOpenedRef = useRef(onOpened);

  useEffect(() => {
    onCloseRef.current = onClose;
    onOpenedRef.current = onOpened;
  }, [onClose, onOpened]);

  // She already tapped the envelope to get here, so it starts opening straight away
  useEffect(() => {
    const timer = setTimeout(open, 350);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (phase === "reading") onOpenedRef.current();
  }, [phase]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onCloseRef.current();
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    html.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={letter.label}
      className="fixed inset-0 z-[70] grid place-items-center bg-[#170B0D]/70 px-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={(event) => event.target === event.currentTarget && phase === "reading" && onClose()}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close letter"
        autoFocus
        className="fixed z-10 grid size-11 place-items-center rounded-full border border-gold-light/40 bg-cream/90 text-ink"
        style={{ top: "max(12px, env(safe-area-inset-top))", right: "max(12px, env(safe-area-inset-right))" }}
      >
        <X size={20} />
      </button>

      <AnimatePresence mode="wait">
        {phase !== "reading" ? (
          <motion.div key="envelope" className="pt-24" exit={{ opacity: 0, y: 60, transition: { duration: 0.5 } }}>
            <Envelope phase={phase} initial={initialOf(config.myName)} peek="For you" className="w-[min(80vw,320px)]" />
          </motion.div>
        ) : (
          <motion.article
            key="letter"
            className="fh-paper relative max-h-[78dvh] w-full max-w-md overflow-y-auto rounded-[20px] px-8 pb-9 pt-10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
            initial={{ opacity: 0, y: alreadyOpen ? 12 : -30, scale: alreadyOpen ? 1 : 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_SOFT }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-2.5 rounded-[13px] border border-gold/45" />
            <h2 className="font-display text-[1.9rem] font-medium leading-tight text-ink">{letter.label}</h2>
            <p className="mt-5 whitespace-pre-line font-body text-[1.05rem] leading-[1.8] text-ink">{letter.letter}</p>
            <p className="mt-6 text-right font-hand text-[2rem] text-wine">{config.myName}</p>
          </motion.article>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body,
  );
}
