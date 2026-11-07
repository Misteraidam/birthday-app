import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue } from "framer-motion";

export type MicStatus = "idle" | "requesting" | "calibrating" | "listening" | "denied" | "unsupported" | "stopped";

// ---- Tuning: adjust here if blowing feels too hard or too easy on a real phone ----
/** Time spent measuring the room's background noise after permission is granted */
const CALIBRATION_MS = 1000;
/** Blowing must be this many times louder than the room... */
const NOISE_MULTIPLIER = 5;
/** ...and never quieter than this (RMS, 0–1), so a silent room doesn't make it hair-trigger */
const MIN_THRESHOLD = 0.06;
/** Continuous blowing required before anything happens: longer than a cough or a laugh */
const GATE_S = 0.35;
/** Further sustained blowing that takes the meter from empty to full */
const BLOW_ALL_S = 1.1;
/** If she stops, a full meter sinks back to empty over this long */
const RECOVER_S = 2.5;
/** Short dips below the threshold mid-breath don't count as stopping */
const DROPOUT_S = 0.15;
/** No candle out after this long listening: offer the tap fallback */
const NO_BLOW_HINT_MS = 10_000;

interface Options {
  candleCount: number;
  litCount: number;
  /** Called each time the meter passes the next candle's mark */
  onBlowOutOne: () => void;
}

type WebkitWindow = typeof window & { webkitAudioContext?: typeof AudioContext };

/**
 * Listens to the microphone for a sustained blow. The meter fills only while she keeps
 * blowing; candles go out one by one as it passes each mark; if she stops, it sinks back
 * (candles already out stay out).
 */
export function useBlowDetector({ candleCount, litCount, onBlowOutOne }: Options) {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [silentTooLong, setSilentTooLong] = useState(false);
  /** 0–1: how far through blowing out every candle */
  const meter = useMotionValue(candleCount ? (candleCount - litCount) / candleCount : 0);
  /** 0–1: how hard she's blowing right now (bends the flames) */
  const intensity = useMotionValue(0);

  const litRef = useRef(litCount);
  const onBlowOutOneRef = useRef(onBlowOutOne);
  const stopRef = useRef<() => void>(() => {});

  useEffect(() => {
    litRef.current = litCount;
    onBlowOutOneRef.current = onBlowOutOne;
  }, [litCount, onBlowOutOne]);

  const stop = useCallback(() => {
    stopRef.current();
    stopRef.current = () => {};
    intensity.set(0);
  }, [intensity]);

  useEffect(() => () => stopRef.current(), []);

  /** Must be called from a tap: iOS only lets an AudioContext run if it's created in a gesture. */
  const start = useCallback(() => {
    const AudioCtx = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!navigator.mediaDevices?.getUserMedia || !AudioCtx) {
      setStatus("unsupported"); // also what plain-http pages get: the mic needs HTTPS
      return;
    }

    const ctx = new AudioCtx();
    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;

    stopRef.current = () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((track) => track.stop());
      ctx.close().catch(() => {});
      setStatus((s) => (s === "denied" || s === "unsupported" ? s : "stopped"));
    };

    setStatus("requesting");
    navigator.mediaDevices
      // Phone audio processing is built to remove exactly the noise blowing makes, so turn it off
      .getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } })
      .then((s) => {
        stream = s;
        if (cancelled) {
          s.getTracks().forEach((track) => track.stop());
          return;
        }
        ctx.resume().catch(() => {});
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 1024;
        ctx.createMediaStreamSource(s).connect(analyser);
        setStatus("calibrating");
        listen(analyser);
      })
      .catch(() => {
        if (cancelled) return;
        stopRef.current = () => {};
        ctx.close().catch(() => {});
        setStatus("denied");
      });

    function listen(analyser: AnalyserNode) {
      const samples = new Float32Array(analyser.fftSize);
      const startedAt = performance.now();
      let last = startedAt;
      let floorSum = 0;
      let floorCount = 0;
      let threshold = 0;
      let listeningSince = 0;
      let outWhenListening = 0;
      let hinted = false;
      let held = 0;
      let quiet = 0;
      let progress = meter.get();

      const tick = (now: number) => {
        if (cancelled) return;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;

        analyser.getFloatTimeDomainData(samples);
        let sum = 0;
        for (const v of samples) sum += v * v;
        const rms = Math.sqrt(sum / samples.length);

        if (!threshold) {
          floorSum += rms;
          floorCount++;
          if (now - startedAt >= CALIBRATION_MS) {
            threshold = Math.max((floorSum / floorCount) * NOISE_MULTIPLIER, MIN_THRESHOLD);
            listeningSince = now;
            outWhenListening = candleCount - litRef.current;
            setStatus("listening");
          }
          raf = requestAnimationFrame(tick);
          return;
        }

        const above = rms > threshold;
        if (above) {
          held += dt;
          quiet = 0;
        } else {
          quiet += dt;
          if (quiet > DROPOUT_S) held = 0;
        }

        const strength = above ? Math.min(1, 0.35 + ((rms - threshold) / (threshold * 3)) * 0.65) : 0;
        intensity.set(intensity.get() + (strength - intensity.get()) * 0.25);

        const outCount = candleCount - litRef.current;
        const floor = outCount / candleCount;
        progress += held > GATE_S ? dt / BLOW_ALL_S : -dt / RECOVER_S;
        progress = Math.min(1, Math.max(floor, progress));
        meter.set(progress);

        if (litRef.current > 0 && progress >= (outCount + 1) / candleCount - 1e-6) {
          litRef.current -= 1;
          onBlowOutOneRef.current();
        }

        if (!hinted && outCount === outWhenListening && now - listeningSince > NO_BLOW_HINT_MS) {
          hinted = true;
          setSilentTooLong(true);
        }

        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
  }, [candleCount, meter, intensity]);

  return { status, silentTooLong, meter, intensity, start, stop };
}
