import { config } from "../content/config";

const TARGET_VOLUME = 0.6;
const FADE_IN_MS = 2500;

let audio: HTMLAudioElement | null = null;

function getAudio() {
  if (!config.musicUrl) return null;
  if (!audio) {
    audio = new Audio(config.musicUrl);
    audio.loop = true;
    audio.preload = "auto";
    // Pause when she switches apps, pick up again when she comes back
    document.addEventListener("visibilitychange", () => {
      if (!audio) return;
      if (document.hidden) audio.pause();
      else audio.play().catch(() => {});
    });
  }
  return audio;
}

/**
 * Must be called synchronously inside a tap/click handler: browsers only allow
 * audio that starts from a user gesture.
 */
export function startMusic(muted: boolean) {
  const a = getAudio();
  if (!a) return;
  a.muted = muted;
  a.volume = 0;
  a.play()
    .then(() => fadeVolume(a, TARGET_VOLUME, FADE_IN_MS))
    // Missing file or blocked playback: the journey simply carries on in silence
    .catch(() => {});
}

export function setMusicMuted(muted: boolean) {
  if (audio) audio.muted = muted;
}

/** No-op on iOS, where volume is read-only; the music then just starts at full volume. */
function fadeVolume(a: HTMLAudioElement, target: number, ms: number) {
  const from = a.volume;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    a.volume = from + (target - from) * t;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
