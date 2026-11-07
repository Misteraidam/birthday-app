import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface TypewriterProps {
  text: string;
  /** Show everything at once (e.g. when she revisits) */
  instant?: boolean;
  /** Flip to true to finish typing immediately (tap-to-skip) */
  skipped?: boolean;
  onDone?: () => void;
  className?: string;
}

const START_DELAY_MS = 500;

function delayAfter(char: string | undefined) {
  if (char === undefined) return START_DELAY_MS;
  if (char === "\n") return 260;
  if (/[.!?]/.test(char)) return 360;
  if (/[,;:—]/.test(char)) return 170;
  return 26 + Math.random() * 26;
}

/**
 * Types text out like handwriting appearing. The untyped remainder is rendered invisibly,
 * so the layout is fixed from the start and nothing jumps as it types.
 */
export function Typewriter({ text, instant, skipped, onDone, className }: TypewriterProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const caretRef = useRef<HTMLSpanElement>(null);
  const onDoneRef = useRef(onDone);

  const shown = instant || skipped || reduceMotion ? text.length : count;
  const done = shown >= text.length;

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (done) return;
    const timer = setTimeout(() => setCount((c) => c + 1), delayAfter(text[count - 1]));
    return () => clearTimeout(timer);
  }, [count, done, text]);

  // Keep the line being typed in view on small screens
  useEffect(() => {
    if (!done) caretRef.current?.scrollIntoView({ block: "nearest" });
  }, [shown, done]);

  useEffect(() => {
    if (done) onDoneRef.current?.();
  }, [done]);

  return (
    <p className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="whitespace-pre-line">
        {text.slice(0, shown)}
        {!done && <span ref={caretRef} className="fh-caret" />}
        <span className="invisible">{text.slice(shown)}</span>
      </span>
    </p>
  );
}
