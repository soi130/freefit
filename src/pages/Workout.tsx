import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExerciseMetric, WorkoutSession } from '../types';
import { useUser } from '../hooks/useUser';
import { useAsync } from '../hooks/useAsync';
import { useElapsed } from '../hooks/useElapsed';
import { useRestTimer } from '../hooks/useRestTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { exercisesRepo, sessionsRepo, setsRepo, settingsRepo } from '../db/repositories';
import { templateById } from '../data/templates';
import type { WorkoutTemplate } from '../data/templates';
import ExerciseCard from '../components/workout/ExerciseCard';
import TemplatePicker from '../components/workout/TemplatePicker';
import RestTimer from '../components/workout/RestTimer';
import { beep, vibrate } from '../utils/audio';
import { setVolume } from '../utils/analytics';
import { formatClock, formatDate, todayISO } from '../utils/format';

const ACTIVE_SESSION_KEY = 'activeSessionId';

interface ExMeta {
  exerciseId: string;
  name: string;
  metric: ExerciseMetric;
  target: string;
  sets: number;
}

export default function Workout() {
  const { user } = useUser();
  const navigate = useNavigate();
  const userId = user?.id ?? '';

  const [ready, setReady] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [template, setTemplate] = useState<WorkoutTemplate | null>(null);
  const [exMeta, setExMeta] = useState<ExMeta[]>([]);
  const initRef = useRef(false);

  const timer = useRestTimer(() => {
    beep(400);
    vibrate([300, 120, 300]);
  });
  useWakeLock(!!sessionId);

  const restSeconds = user?.defaultRestSeconds ?? 90;
  const elapsed = useElapsed(startedAt);

  async function activate(session: WorkoutSession) {
    const tpl = templateById(session.templateId);
    setSessionId(session.id);
    setStartedAt(session.createdAt);
    setTemplate(tpl ?? null);
    if (tpl) {
      const metas = await Promise.all(
        tpl.exercises.map(async (te) => {
          const ex = await exercisesRepo.findOrCreate(userId, te.name, te.metric);
          return { exerciseId: ex.id, name: ex.name, metric: te.metric, target: te.target, sets: te.sets };
        }),
      );
      setExMeta(metas);
    }
  }

  // Resume an in-progress session, or fall back to the template picker.
  useEffect(() => {
    if (!userId || initRef.current) return;
    initRef.current = true;
    (async () => {
      const existingId = await settingsRepo.get(ACTIVE_SESSION_KEY);
      if (existingId) {
        const s = await sessionsRepo.get(existingId);
        if (s && s.userId === userId) await activate(s);
      }
      setReady(true);
    })();
  }, [userId]);

  const { data, reload } = useAsync(async () => {
    if (!sessionId) return null;
    return setsRepo.bySession(sessionId);
  }, [sessionId]);

  const sets = data ?? [];

  async function startTemplate(tpl: WorkoutTemplate) {
    const created = await sessionsRepo.create({
      userId,
      date: todayISO(),
      workoutName: tpl.name,
      templateId: tpl.id,
      notes: '',
    });
    await settingsRepo.set(ACTIVE_SESSION_KEY, created.id);
    await activate(created);
  }

  async function finish() {
    if (!sessionId) return;
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

  if (!user || !ready) return null;
  if (!sessionId) return <TemplatePicker onPick={startTemplate} />;

  const totalVolume = sets.reduce((sum, s) => sum + setVolume(s), 0);

  return (
    <div className="space-y-5 pb-4">
      <header className="space-y-3">
        <p className="text-sm font-bold text-olive-700/70">{formatDate(todayISO())}</p>
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-3xl font-black tabular-nums text-ink">{formatClock(elapsed)}</p>
            {template && (
              <p className="text-xs font-bold text-ink/50">~{template.estMinLow}–{template.estMinHigh} min target</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-olive-700">{totalVolume.toLocaleString()} kg</p>
            <p className="text-xs font-semibold text-ink/40">
              {sets.length} {sets.length === 1 ? 'set' : 'sets'}
            </p>
          </div>
        </div>
        {template && <h1 className="px-1 text-base font-black text-ink">{template.name}</h1>}
      </header>

      {exMeta.map((m) => (
        <ExerciseCard
          key={m.exerciseId}
          userId={userId}
          sessionId={sessionId}
          exerciseId={m.exerciseId}
          exerciseName={m.name}
          metric={m.metric}
          target={m.target}
          targetSets={m.sets}
          sets={sets
            .filter((s) => s.exerciseId === m.exerciseId)
            .sort((a, b) => a.setNumber - b.setNumber)}
          onChanged={reload}
          onSetLogged={(metric) => {
            if (metric !== 'cardio') timer.start(restSeconds);
          }}
        />
      ))}

      <div className="grid grid-cols-2 gap-3">
        <button className="btn-ghost" onClick={cancel}>
          Cancel
        </button>
        <button className="btn-primary" onClick={finish} disabled={sets.length === 0}>
          Finish
        </button>
      </div>

      {timer.active && <div className="h-16" aria-hidden />}

      <RestTimer timer={timer} />
    </div>
  );
}
