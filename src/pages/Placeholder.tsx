export default function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <div className="rounded-card border-2 border-dashed border-olive-300 px-6 py-8">
        <h1 className="text-xl font-black text-olive-700">{title}</h1>
        <p className="mt-2 text-sm font-semibold text-ink/60">Coming in {phase}.</p>
      </div>
    </div>
  );
}
