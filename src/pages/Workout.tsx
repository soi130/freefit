import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAsync } from '../hooks/useAsync';
import {
  exercisesRepo,
  sessionsRepo,
  setsRepo,
  settingsRepo,
} from '../db/repositories';
import Sheet from '../components/Sheet';
import ExerciseCard from '../components/workout/ExerciseCard';
import ExercisePicker from '../components/workout/ExercisePicker';
import { PlusIcon } from '../components/icons';
import { formatDate, todayISO } from '../utils/format';

const ACTIVE_SESSION_KEY = 'activeSessionId';

export default function Workout() {
  const { user } = useUser();
  const navigate = useNavigate();
  const userId = user?.id ?? '';

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [localNames, setLocalNames] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const initRef = useRef(false);

  // Resume the in-progress session or start a fresh one.
  useEffect(() => {
    if (!userId || initRef.current) return;
    initRef.current = true;
    (async () => {
      const existingId = await settingsRepo.get(ACTIVE_SESSION_KEY);
      if (existingId) {
        const s = await sessionsRepo.get(existingId);
        if (s && s.userId === userId) {
          setSessionId(s.id);
          setName(s.workoutName);
          return;
        }
      }
      const created = await sessionsRepo.create({
        userId,
        date: todayISO(),
        workoutName: '',
        notes: '',
      });
      await settingsRepo.set(ACTIVE_SESSION_KEY, created.id);
      setSessionId(created.id);
    })();
  }, [userId]);

  const { data, reload } = useAsync(async () => {
    if (!sessionId) return null;
    const [sets, exercises] = await Promise.all([
      setsRepo.bySession(sessionId),
      exercisesRepo.byUser(userId),
    ]);
    return { sets, exercises };
  }, [sessionId]);

  const sets = data?.sets ?? [];
  const exercises = data?.exercises ?? [];

  // Make sure any exercise that already has logged sets is shown.
  useEffect(() => {
    const fromSets: string[] = [];
    for (const s of sets) if (!fromSets.includes(s.exerciseId)) fromSets.push(s.exerciseId);
    setOrder((prev) => {
      const missing = fromSets.filter((id) => !prev.includes(id));
      return missing.length ? [...prev, ...missing] : prev;
    });
  }, [sets]);

  function nameFor(exerciseId: string): string {
    return (
      localNames[exerciseId] ??
      sets.find((s) => s.exerciseId === exerciseId)?.exerciseName ??
      exercises.find((e) => e.id === exerciseId)?.name ??
      'Exercise'
    );
  }

  async function pickExercise(rawName: string) {
    const ex = await exercisesRepo.findOrCreate(userId, rawName);
    setLocalNames((m) => ({ ...m, [ex.id]: ex.name }));
    setOrder((o) => (o.includes(ex.id) ? o : [...o, ex.id]));
    setPickerOpen(false);
    reload();
  }

  function removeExercise(exerciseId: string) {
    setOrder((o) => o.filter((id) => id !== exerciseId));
  }

  async function saveName() {
    if (!sessionId) return;
    await sessionsRepo.update(sessionId, { workoutName: name.trim() });
  }

  async function finish() {
    if (!sessionId) return;
    await saveName();
    if (sets.length === 0) await sessionsRepo.delete(sessionId);
    await settingsRepo.set(ACTIVE_SESSION_KEY, '');
    navigate('/');
  }

  async function cancel() {
    if (!sessionId) return;
    if (sets.length > 0 && !confirm('Discard this workout and all its sets?')) return;
    await setsRepo.deleteBySession(sessionId);
    await sessionsRepo.delete(sessionId);
    await settingsRepo.set(ACTIVE_SESSION_KEY, '');
    navigate('/');
  }

  if (!user || !sessionId) return null;

  const totalVolume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  return (
    <div className="space-y-5 pb-4">
      <header className="space-y-2">
        <p className="text-sm font-bold text-olive-700/70">{formatDate(todayISO())}</p>
        <input
          className="input"
          type="text"
          placeholder="Workout name (e.g. Push day)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
        />
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-bold text-ink/60">
            {sets.length} {sets.length === 1 ? 'set' : 'sets'}
          </span>
          <span className="text-sm font-black text-olive-700">
            {totalVolume.toLocaleString()} kg volume
          </span>
        </div>
      </header>

      {order.map((id) => (
        <ExerciseCard
          key={id}
          userId={userId}
          sessionId={sessionId}
          exerciseId={id}
          exerciseName={nameFor(id)}
          sets={sets.filter((s) => s.exerciseId === id).sort((a, b) => a.setNumber - b.setNumber)}
          onChanged={reload}
          onRemove={() => removeExercise(id)}
        />
      ))}

      <button className="btn-ghost w-full" onClick={() => setPickerOpen(true)}>
        <PlusIcon width={22} height={22} />
        Add exercise
      </button>

      <div className="grid grid-cols-2 gap-3">
        <button className="btn-ghost" onClick={cancel}>
          Cancel
        </button>
        <button className="btn-primary" onClick={finish} disabled={sets.length === 0}>
          Finish
        </button>
      </div>

      <Sheet open={pickerOpen} title="Add exercise" onClose={() => setPickerOpen(false)}>
        <ExercisePicker exercises={exercises} activeIds={order} onPick={pickExercise} />
      </Sheet>
    </div>
  );
}
