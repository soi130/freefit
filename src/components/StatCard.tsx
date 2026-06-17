import type { ReactNode } from 'react';

export default function StatCard({
  label,
  value,
  hint,
  accent = 'olive',
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: 'olive' | 'brick';
}) {
  return (
    <div className="card">
      <p className="text-xs font-bold uppercase tracking-wide text-olive-700/70">{label}</p>
      <p
        className={`mt-1 text-2xl font-black ${
          accent === 'brick' ? 'text-brick-500' : 'text-olive-700'
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs font-semibold text-ink/50">{hint}</p>}
    </div>
  );
}
