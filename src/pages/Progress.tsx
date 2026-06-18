import type { ReactNode } from 'react';
import { useUser } from '../hooks/useUser';
import { useAsync } from '../hooks/useAsync';
import { sessionsRepo, setsRepo, weightRepo } from '../db/repositories';
import VolumeChart from '../components/charts/VolumeChart';
import WeightChart from '../components/charts/WeightChart';
import ConsistencyCalendar from '../components/charts/ConsistencyCalendar';
import {
  personalRecords,
  sessionVolumes,
  weightSeries,
  workoutsByDate,
} from '../utils/analytics';
import { formatWeight } from '../utils/format';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-black uppercase tracking-wide text-accent/70">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm font-semibold text-ink/50">{children}</p>;
}

export default function Progress() {
  const { user } = useUser();
  const userId = user?.id ?? '';

  const { data } = useAsync(async () => {
    if (!userId) return null;
    const [sessions, sets, weights] = await Promise.all([
      sessionsRepo.byUser(userId),
      setsRepo.byUser(userId),
      weightRepo.byUser(userId),
    ]);
    return {
      volumes: sessionVolumes(sessions, sets),
      weights: weightSeries(weights),
      counts: workoutsByDate(sessions, sets),
      records: personalRecords(sets),
    };
  }, [userId]);

  if (!user) return null;

  return (
    <div className="space-y-7">
      <h1 className="text-2xl font-black text-ink">Progress</h1>

      <Section title="Consistency">
        <div className="card space-y-3">
          <ConsistencyCalendar counts={data?.counts ?? new Map()} />
          <p className="text-xs font-semibold text-ink/50">Last 13 weeks · more color = more workouts</p>
        </div>
      </Section>

      <Section title="Volume over time">
        <div className="card">
          {data && data.volumes.length > 0 ? (
            <VolumeChart data={data.volumes} />
          ) : (
            <Empty>Log a workout to see your volume trend.</Empty>
          )}
        </div>
      </Section>

      <Section title="Body weight">
        <div className="card">
          {data && data.weights.length > 0 ? (
            <WeightChart data={data.weights} />
          ) : (
            <Empty>Log your weight to see the trend.</Empty>
          )}
        </div>
      </Section>

      <Section title="Personal records">
        <div className="card divide-y-2 divide-line">
          {data && data.records.length > 0 ? (
            data.records.map((r) => (
              <div key={r.exerciseId} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <span className="font-black text-ink">{r.exerciseName}</span>
                <span className="text-right text-sm font-bold text-accent">
                  {formatWeight(r.maxWeight)} × {r.repsAtMax}
                  <span className="block text-xs font-semibold text-ink/40">
                    ~{Math.round(r.estOneRepMax)} kg 1RM
                  </span>
                </span>
              </div>
            ))
          ) : (
            <Empty>Your heaviest lifts will show up here.</Empty>
          )}
        </div>
      </Section>
    </div>
  );
}
