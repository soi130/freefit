import { useEffect, useState } from 'react';
import type { ExerciseMetric, WorkoutSet } from '../../types';
import { setsRepo } from '../../db/repositories';
import { useAsync } from '../../hooks/useAsync';
import { targetCount } from '../../data/templates';
import { validateReps, validateWeight } from '../../utils/validation';
import { formatSet } from '../../utils/format';
import { CheckIcon, TrashIcon } from '../icons';

const COUNT_LABEL: Record<ExerciseMetric, string> = {
  reps: 'Reps',
  time: 'Seconds',
  cardio: 'Minutes',
  rounds: 'Round',
};

export default function ExerciseCard({
  userId,
  sessionId,
  exerciseId,
  exerciseName,
  metric,
  target,
  targetSets,
  sets,
  onChanged,
  onSetLogged,
}: {
  userId: string;
  sessionId: string;
  exerciseId: string;
  exerciseName: string;
  metric: ExerciseMetric;
  target: string;
  targetSets: number;
  sets: WorkoutSet[];
  onChanged: () => void;
  onSetLogged: (metric: ExerciseMetric) => void;
}) {
  const { data: previous } = useAsync(
    () => setsRepo.previousForExercise(userId, exerciseId, sessionId),
    [userId, exerciseId, sessionId],
  );

  const showWeight = metric === 'reps' || metric === 'rounds';
  const showCount = metric !== 'rounds';

  const [weight, setWeight] = useState('');
  const [count, setCount] = useState('');
  const [error, setError] = useState('');

  // Prefill from the last set logged here, else the previous session, else the target.
  useEffect(() => {
    if (weight !== '' || count !== '') return;
    const ref = sets[sets.length - 1] ?? previous?.[previous.length - 1];
    if (showWeight && ref) setWeight(String(ref.weight));
    if (showCount) setCount(String(ref?.reps ?? targetCount(target) ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previous, sets.length]);

  async function addSet() {
    const w = showWeight ? Number(weight) : 0;
    const c = showCount ? Number(count) : 1;
    if (showWeight) {
      const wCheck = validateWeight(w);
      if (!wCheck.ok) return setError(wCheck.error);
    }
    if (showCount) {
      const cCheck = validateReps(c);
      if (!cCheck.ok) return setError(COUNT_LABEL[metric] + ' must be a positive number');
    }
    setError('');
    await setsRepo.create({
      sessionId,
      userId,
      exerciseId,
      exerciseName,
      metric,
      setNumber: sets.length + 1,
      reps: c,
      weight: w,
      completedAt: new Date().toISOString(),
    });
    onChanged();
    onSetLogged(metric);
  }

  async function removeSet(id: string) {
    await setsRepo.delete(id);
    onChanged();
  }

  const targetLabel =
    metric === 'cardio' || metric === 'rounds' ? target : `${targetSets} × ${target}`;
  const done = sets.length;
  const complete = done >= targetSets;

  // Pink while sets remain, green once the target is hit.
  const containerCls = complete ? 'border-olive-500 bg-olive-500/10' : 'border-brick-400 bg-brick-500/5';
  const chipCls = complete ? 'bg-olive-500/20 text-accent' : 'bg-brick-500/15 text-brick-500';
  const rowCls = complete ? 'border-olive-400 bg-olive-500/10' : 'border-line bg-subtle';

  return (
    <div className={`card space-y-3 ${containerCls}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-black text-ink">{exerciseName}</h3>
          <p className="text-xs font-bold text-accent/70">Target: {targetLabel}</p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-card px-2 py-1 text-xs font-black ${chipCls}`}>
          {complete && <CheckIcon width={14} height={14} />}
          {done}/{targetSets}
        </span>
      </div>

      {previous && previous.length > 0 && (
        <p className="text-xs font-semibold text-ink/50">
          Last time: {previous.map((s) => formatSet(s)).join(', ')}
        </p>
      )}

      {sets.length > 0 && (
        <ul className="space-y-1.5">
          {sets.map((s) => (
            <li
              key={s.id}
              className={`flex items-center justify-between rounded-card border-2 px-3 py-2 ${rowCls}`}
            >
              <span className="text-sm font-bold text-ink">
                <span className="text-ink/40">
                  {metric === 'rounds' ? `Round ${s.setNumber}` : `#${s.setNumber}`}
                </span>{' '}
                {formatSet(s)}
              </span>
              <button
                className="text-ink/30 active:text-brick-500"
                aria-label={`Delete set ${s.setNumber}`}
                onClick={() => removeSet(s.id)}
              >
                <TrashIcon width={16} height={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-end gap-2">
        {showWeight && (
          <div className="flex-1">
            <label className="label">Weight (kg)</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              step="0.5"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setError('');
              }}
            />
          </div>
        )}
        {showCount && (
          <div className="flex-1">
            <label className="label">{COUNT_LABEL[metric]}</label>
            <input
              className="input"
              type="number"
              inputMode="numeric"
              value={count}
              onChange={(e) => {
                setCount(e.target.value);
                setError('');
              }}
            />
          </div>
        )}
        <button className="btn-primary px-4" aria-label="Set done" onClick={addSet}>
          <CheckIcon width={22} height={22} />
        </button>
      </div>

      {error && <p className="text-sm font-bold text-brick-500">{error}</p>}
    </div>
  );
}
