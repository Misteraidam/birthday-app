import { Volume2, VolumeX } from "lucide-react";
import { useJourney } from "../../lib/journey";

export function MuteToggle() {
  const { muted, toggleMuted } = useJourney();
  return (
    <button
      type="button"
      onClick={toggleMuted}
      aria-label={muted ? "Unmute music" : "Mute music"}
      aria-pressed={muted}
      className="fixed z-50 grid size-11 place-items-center rounded-full border border-gold/40 bg-cream/80 text-ink shadow-[0_6px_18px_-8px_rgba(110,40,55,0.45)] backdrop-blur-md transition-colors hover:bg-cream"
      style={{
        top: "max(12px, env(safe-area-inset-top))",
        right: "max(12px, env(safe-area-inset-right))",
      }}
    >
      {muted ? <VolumeX size={19} strokeWidth={1.75} /> : <Volume2 size={19} strokeWidth={1.75} />}
    </button>
  );
}
