import { TEMPLATE_GROUPS, TEMPLATES } from '../../data/templates';
import type { WorkoutTemplate } from '../../data/templates';

export default function TemplatePicker({
  onPick,
}: {
  onPick: (template: WorkoutTemplate) => void;
}) {
  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-2xl font-black text-ink">Choose a workout</h1>
        <p className="text-sm font-semibold text-ink/50">Pick a template to start.</p>
      </header>

      {TEMPLATE_GROUPS.map((group) => (
        <section key={group} className="space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-olive-700/70">{group}</h2>
          <ul className="space-y-3">
            {TEMPLATES.filter((tpl) => tpl.group === group).map((tpl) => (
              <li key={tpl.id}>
                <button
                  className="card flex w-full items-center justify-between gap-3 text-left active:translate-y-0.5"
                  onClick={() => onPick(tpl)}
                >
                  <div>
                    <p className="font-black text-ink">{tpl.name}</p>
                    <p className="text-sm font-semibold text-ink/50">
                      {tpl.exercises.length} exercises · ~{tpl.estMinLow}–{tpl.estMinHigh} min
                    </p>
                  </div>
                  <span aria-hidden className="text-xl font-black text-olive-600">
                    ›
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
