import { useState } from 'react';
import { PICKER_GROUPS, targetLabel } from '../../data/templates';
import type { WorkoutTemplate } from '../../data/templates';
import Sheet from '../Sheet';
import { TrashIcon } from '../icons';

export default function TemplatePicker({
  templates,
  onPick,
  onDelete,
}: {
  templates: WorkoutTemplate[];
  onPick: (template: WorkoutTemplate) => void;
  onDelete: (template: WorkoutTemplate) => void;
}) {
  const [preview, setPreview] = useState<WorkoutTemplate | null>(null);

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-2xl font-black text-ink">Choose a workout</h1>
        <p className="text-sm font-semibold text-ink/50">Tap a course to preview it.</p>
      </header>

      {PICKER_GROUPS.map(({ group, label }) => {
        const items = templates.filter((tpl) => tpl.group === group);
        if (items.length === 0) return null;
        return (
          <section key={group} className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wide text-accent/70">{label}</h2>
            <ul className="space-y-3">
              {items.map((tpl) => {
                const custom = tpl.group === 'Custom';
                return (
                  <li key={tpl.id} className="relative">
                    <button
                      className="card flex w-full items-center justify-between gap-3 text-left active:translate-y-0.5"
                      onClick={() => setPreview(tpl)}
                    >
                      <div>
                        <p className="font-black text-ink">{tpl.name}</p>
                        <p className="text-sm font-semibold text-ink/50">
                          {tpl.exercises.length} exercises · ~{tpl.estMinLow}–{tpl.estMinHigh} min
                        </p>
                      </div>
                      {custom ? (
                        <span aria-hidden className="w-6 shrink-0" />
                      ) : (
                        <span aria-hidden className="text-xl font-black text-accent">
                          ›
                        </span>
                      )}
                    </button>
                    {custom && (
                      <button
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-ink/30 active:text-brick-500"
                        aria-label={`Delete ${tpl.name}`}
                        onClick={() => onDelete(tpl)}
                      >
                        <TrashIcon width={20} height={20} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      <Sheet open={!!preview} title={preview?.name ?? ''} onClose={() => setPreview(null)}>
        {preview && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-ink/60">
              {preview.exercises.length} exercises · ~{preview.estMinLow}–{preview.estMinHigh} min
            </p>
            <ul className="space-y-2">
              {preview.exercises.map((ex, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-card border-2 border-line bg-subtle px-3 py-2"
                >
                  <span className="font-bold text-ink">{ex.name}</span>
                  <span className="shrink-0 text-sm font-bold text-accent">{targetLabel(ex)}</span>
                </li>
              ))}
            </ul>
            <button className="btn-primary w-full" onClick={() => onPick(preview)}>
              Start course
            </button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
