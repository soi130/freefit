import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExerciseMetric } from '../types';
import type { TemplateExercise, WorkoutTemplate } from '../data/templates';
import { newId } from '../db/index';
import { customTemplatesRepo } from '../db/customTemplates';
import { PlusIcon, TrashIcon } from '../components/icons';

interface Row {
  key: string;
  name: string;
  sets: string;
  target: string;
  metric: ExerciseMetric;
}

const METRIC_OPTIONS: { value: ExerciseMetric; label: string }[] = [
  { value: 'reps', label: 'Reps' },
  { value: 'time', label: 'Time' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'rounds', label: 'Rounds' },
];

const TARGET_PLACEHOLDER: Record<ExerciseMetric, string> = {
  reps: 'e.g. 8',
  time: 'e.g. 45 sec',
  cardio: 'e.g. 15 min',
  rounds: 'e.g. 4 rounds',
};

function emptyRow(): Row {
  return { key: crypto.randomUUID(), name: '', sets: '3', target: '', metric: 'reps' };
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [error, setError] = useState('');

  function updateRow(key: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    setError('');
  }

  function addRow() {
    setRows((rs) => [...rs, emptyRow()]);
  }

  function removeRow(key: string) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== key) : rs));
  }

  async function save() {
    if (!name.trim()) return setError('Give your course a name.');
    const exercises: TemplateExercise[] = rows
      .filter((r) => r.name.trim())
      .map((r) => {
        const sets = Math.max(1, Math.round(Number(r.sets) || 1));
        const target = r.target.trim() || (r.metric === 'reps' ? '8' : '');
        return { name: r.name.trim(), metric: r.metric, sets, target };
      });
    if (exercises.length === 0) return setError('Add at least one exercise.');

    const totalSets = exercises.reduce((a, e) => a + e.sets, 0);
    const estMinLow = Math.max(10, Math.round(totalSets * 1.5));
    const tpl: WorkoutTemplate = {
      id: newId(),
      group: 'Custom',
      name: name.trim(),
      estMinLow,
      estMinHigh: estMinLow + 10,
      exercises,
    };
    await customTemplatesRepo.add(tpl);
    navigate('/workout');
  }

  return (
    <div className="space-y-5 pb-4">
      <header>
        <h1 className="text-2xl font-black text-ink">Create a course</h1>
        <p className="text-sm font-semibold text-ink/50">
          Build your own workout. It’s saved to the Workout tab.
        </p>
      </header>

      <div>
        <label className="label">Course name</label>
        <input
          className="input"
          type="text"
          placeholder="e.g. My Push Day"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
        />
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.key} className="card space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-accent">{i + 1}</span>
              <input
                className="input flex-1"
                type="text"
                placeholder="Exercise name"
                value={row.name}
                onChange={(e) => updateRow(row.key, { name: e.target.value })}
              />
              <button
                className="shrink-0 text-ink/30 active:text-brick-500"
                aria-label="Remove exercise"
                onClick={() => removeRow(row.key)}
              >
                <TrashIcon width={20} height={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="label">Sets</label>
                <input
                  className="input"
                  type="number"
                  inputMode="numeric"
                  value={row.sets}
                  onChange={(e) => updateRow(row.key, { sets: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Target</label>
                <input
                  className="input"
                  type="text"
                  placeholder={TARGET_PLACEHOLDER[row.metric]}
                  value={row.target}
                  onChange={(e) => updateRow(row.key, { target: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Type</label>
                <select
                  className="input"
                  value={row.metric}
                  onChange={(e) => updateRow(row.key, { metric: e.target.value as ExerciseMetric })}
                >
                  {METRIC_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-ghost w-full" onClick={addRow}>
        <PlusIcon width={22} height={22} />
        Add exercise
      </button>

      {error && <p className="text-sm font-bold text-brick-500">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <button className="btn-ghost" onClick={() => navigate('/')}>
          Cancel
        </button>
        <button className="btn-primary" onClick={save}>
          Save course
        </button>
      </div>
    </div>
  );
}
