import { config } from "../content/config";

const FADE_IN_MS = 2500;

export type MusicLevel = "full" | "low" | "off";
const VOLUME: Record<MusicLevel, number> = { full: 0.6, low: 0.12, off: 0 };

let audio: HTMLAudioElement | null = null;
let playing = false;
/** Where the music should be right now; "off" means paused (e.g. while her video plays) */
let level: MusicLevel = "full";
/** Bumped on every fade so a newer fade cancels an older one */
let fadeToken = 0;

function getAudio() {
  if (!config.musicUrl) return null;
  if (!audio) {
    audio = new Audio(config.musicUrl);
    audio.loop = true;
    audio.preload = "auto";
    // Pause when she switches apps, pick up again when she comes back (unless it's meant to be off)
    document.addEventListener("visibilitychange", () => {
      if (!audio) return;
      if (document.hidden) audio.pause();
      else if (playing && level !== "off") audio.play().catch(() => {});
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
    .then(() => {
      playing = true;
      fade(a, level, FADE_IN_MS);
    })
    // Missing file or blocked playback: the journey simply carries on in silence
    .catch(() => {});
}

export function setMusicMuted(muted: boolean) {
  if (audio) audio.muted = muted;
}

/**
 * Fades the music to a level. "low" sits under the mic and the finale intro, "off" pauses
 * it for her video, "full" brings it back. Also resumes playback, since iOS can pause audio
 * while the microphone is in use.
 */
export function setMusicLevel(next: MusicLevel, ms = 1200) {
  level = next;
  if (!audio || !playing) return;
  if (next !== "off" && audio.paused && !document.hidden) audio.play().catch(() => {});
  fade(audio, next, ms);
}

/**
 * Volume is read-only on iOS, so there the fades are instant: "low" stays at full volume,
 * and "off" still pauses.
 */
function fade(a: HTMLAudioElement, target: MusicLevel, ms: number) {
  const token = ++fadeToken;
  const from = a.volume;
  const to = VOLUME[target];
  const start = performance.now();
  const step = (now: number) => {
    if (token !== fadeToken) return;
    const t = Math.min(1, (now - start) / ms);
    a.volume = from + (to - from) * t;
    if (t < 1) requestAnimationFrame(step);
    else if (target === "off") a.pause();
  };
  requestAnimationFrame(step);
}
