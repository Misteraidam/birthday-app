/** Temporary screen for stages that haven't been built yet. */
export function StagePlaceholder({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return (
    <div className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-sm uppercase tracking-[0.3em] text-gold-ink">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink">{title}</h1>
        <p className="mt-4 italic text-ink-soft">{note}</p>
      </div>
    </div>
  );
}
