import { useEffect, useState } from 'react';
import type { WorkoutSet } from '../../types';
import { setsRepo } from '../../db/repositories';
import { useAsync } from '../../hooks/useAsync';
import { validateReps, validateWeight } from '../../utils/validation';
import { formatWeight } from '../../utils/format';
import { CheckIcon, TrashIcon } from '../icons';

export default function ExerciseCard({
  userId,
  sessionId,
  exerciseId,
  exerciseName,
  sets,
  onChanged,
  onRemove,
}: {
  userId: string;
  sessionId: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  onChanged: () => void;
  onRemove: () => void;
}) {
  const { data: previous } = useAsync(
    () => setsRepo.previousForExercise(userId, exerciseId, sessionId),
    [userId, exerciseId, sessionId],
  );

  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState('');

  // Prefill from the last set logged here, else from previous session's last set.
  useEffect(() => {
    if (weight !== '' || reps !== '') return;
    const ref = sets[sets.length - 1] ?? previous?.[previous.length - 1];
    if (ref) {
      setWeight(String(ref.weight));
      setReps(String(ref.reps));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previous, sets.length]);

  async function addSet() {
    const w = Number(weight);
    const r = Number(reps);
    const wCheck = validateWeight(w);
    if (!wCheck.ok) return setError(wCheck.error);
    const rCheck = validateReps(r);
    if (!rCheck.ok) return setError(rCheck.error);
    setError('');
    await setsRepo.create({
      sessionId,
      userId,
      exerciseId,
      exerciseName,
      setNumber: sets.length + 1,
      reps: r,
      weight: w,
      completedAt: new Date().toISOString(),
    });
    onChanged();
  }

  async function removeSet(id: string) {
    await setsRepo.delete(id);
    onChanged();
  }

  const volume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  return (
    <div className="card space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-black text-ink">{exerciseName}</h3>
        {sets.length === 0 && (
          <button
            className="text-ink/40 active:text-brick-500"
            aria-label="Remove exercise"
            onClick={onRemove}
          >
            <TrashIcon width={20} height={20} />
          </button>
        )}
      </div>

      {previous && previous.length > 0 && (
        <p className="text-xs font-semibold text-ink/50">
          Last time: {previous.map((s) => `${formatWeight(s.weight)}×${s.reps}`).join(', ')}
        </p>
      )}

      {sets.length > 0 && (
        <ul className="space-y-1.5">
          {sets.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-card border-2 border-olive-200 bg-olive-50 px-3 py-2"
            >
              <span className="text-sm font-bold text-ink">
                <span className="text-ink/40">#{s.setNumber}</span>{' '}
                {formatWeight(s.weight)} × {s.reps}
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
        <div className="flex-1">
          <label className="label">Reps</label>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => {
              setReps(e.target.value);
              setError('');
            }}
          />
        </div>
        <button className="btn-primary px-4" aria-label="Set done" onClick={addSet}>
          <CheckIcon width={22} height={22} />
        </button>
      </div>

      {error && <p className="text-sm font-bold text-brick-500">{error}</p>}
      {volume > 0 && (
        <p className="text-right text-xs font-bold text-olive-700/70">
          {volume.toLocaleString()} kg volume
        </p>
      )}
    </div>
  );
}
