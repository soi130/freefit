import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { WorkoutSession, WorkoutSet } from '../types';
import { useUser } from '../hooks/useUser';
import { useAsync } from '../hooks/useAsync';
import { sessionsRepo, setsRepo, weightRepo } from '../db/repositories';
import Sheet from '../components/Sheet';
import { formatDate, formatWeight } from '../utils/format';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-black uppercase tracking-wide text-olive-700/70">{title}</h2>
      {children}
    </section>
  );
}

interface SessionStat {
  setCount: number;
  volume: number;
}

function SessionDetail({ session, sets }: { session: WorkoutSession; sets: WorkoutSet[] }) {
  const groups = useMemo(() => {
    const order: string[] = [];
    const byExercise = new Map<string, WorkoutSet[]>();
    for (const s of [...sets].sort((a, b) => a.setNumber - b.setNumber)) {
      if (!byExercise.has(s.exerciseId)) {
        byExercise.set(s.exerciseId, []);
        order.push(s.exerciseId);
      }
      byExercise.get(s.exerciseId)!.push(s);
    }
    return order.map((id) => ({ id, name: byExercise.get(id)![0].exerciseName, sets: byExercise.get(id)! }));
  }, [sets]);

  const volume = sets.reduce((sum, s) => sum + s.weight * s.reps, 0);

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-ink/60">
        {formatDate(session.date)} · {sets.length} sets · {volume.toLocaleString()} kg
      </p>
      {groups.map((g) => (
        <div key={g.id} className="space-y-1.5">
          <h3 className="font-black text-ink">{g.name}</h3>
          <ul className="space-y-1">
            {g.sets.map((s) => (
              <li
                key={s.id}
                className="flex justify-between rounded-card border-2 border-olive-200 bg-olive-50 px-3 py-1.5 text-sm font-bold"
              >
                <span className="text-ink/40">#{s.setNumber}</span>
                <span>
                  {formatWeight(s.weight)} × {s.reps}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function History() {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data } = useAsync(async () => {
    if (!userId) return null;
    const [sessions, sets, weights] = await Promise.all([
      sessionsRepo.byUser(userId),
      setsRepo.byUser(userId),
      weightRepo.byUser(userId),
    ]);
    const stats = new Map<string, SessionStat>();
    for (const s of sets) {
      const cur = stats.get(s.sessionId) ?? { setCount: 0, volume: 0 };
      cur.setCount += 1;
      cur.volume += s.weight * s.reps;
      stats.set(s.sessionId, cur);
    }
    const logged = sessions.filter((s) => stats.has(s.id));
    return {
      sessions: logged,
      stats,
      setsBySession: sets,
      weights: [...weights].reverse(),
    };
  }, [userId]);

  if (!user) return null;

  const selected = data?.sessions.find((s) => s.id === selectedId) ?? null;
  const selectedSets = selected
    ? (data?.setsBySession.filter((s) => s.sessionId === selected.id) ?? [])
    : [];

  return (
    <div className="space-y-7">
      <h1 className="text-2xl font-black text-ink">History</h1>

      <Section title="Workouts">
        {data && data.sessions.length > 0 ? (
          <ul className="space-y-3">
            {data.sessions.map((s) => {
              const stat = data.stats.get(s.id)!;
              return (
                <li key={s.id}>
                  <button
                    className="card flex w-full items-center justify-between text-left active:translate-y-0.5"
                    onClick={() => setSelectedId(s.id)}
                  >
                    <div>
                      <p className="font-black text-ink">{s.workoutName || 'Workout'}</p>
                      <p className="text-sm font-semibold text-ink/50">{formatDate(s.date)}</p>
                    </div>
                    <div className="text-right text-sm font-bold text-olive-700">
                      {stat.volume.toLocaleString()} kg
                      <span className="block text-xs font-semibold text-ink/40">
                        {stat.setCount} sets
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm font-semibold text-ink/50">
            No workouts logged yet.
          </p>
        )}
      </Section>

      <Section title="Weight log">
        {data && data.weights.length > 0 ? (
          <ul className="card divide-y-2 divide-olive-100">
            {data.weights.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-bold text-ink">{formatWeight(w.weight)}</p>
                  {w.note && <p className="text-xs font-semibold text-ink/40">{w.note}</p>}
                </div>
                <span className="text-sm font-semibold text-ink/50">{formatDate(w.date)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm font-semibold text-ink/50">
            No weight entries yet.
          </p>
        )}
      </Section>

      <Sheet
        open={!!selected}
        title={selected?.workoutName || 'Workout'}
        onClose={() => setSelectedId(null)}
      >
        {selected && <SessionDetail session={selected} sets={selectedSets} />}
      </Sheet>
    </div>
  );
}
