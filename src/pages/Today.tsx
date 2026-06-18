import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { useAsync } from '../hooks/useAsync';
import { sessionsRepo, setsRepo, weightRepo } from '../db/repositories';
import { setVolume } from '../utils/analytics';
import StatCard from '../components/StatCard';
import Sheet from '../components/Sheet';
import WeightForm from '../components/forms/WeightForm';
import { PlusIcon, ScaleIcon } from '../components/icons';
import { formatDate, formatRest, formatWeight, startOfWeekISO, todayISO } from '../utils/format';

export default function Today() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [weightOpen, setWeightOpen] = useState(false);
  const userId = user?.id ?? '';

  const { data, reload } = useAsync(async () => {
    if (!userId) return null;
    const [sessions, latestWeight] = await Promise.all([
      sessionsRepo.byUser(userId),
      weightRepo.latest(userId),
    ]);
    const weekStart = startOfWeekISO();
    const thisWeek = sessions.filter((s) => s.date >= weekStart).length;
    const last = sessions[0];
    let lastSummary = 'No workouts yet';
    if (last) {
      const sets = await setsRepo.bySession(last.id);
      const volume = sets.reduce((sum, s) => sum + setVolume(s), 0);
      lastSummary = `${last.workoutName || 'Workout'} · ${sets.length} sets · ${volume.toLocaleString()} kg vol`;
    }
    return { latestWeight, thisWeek, last, lastSummary };
  }, [userId]);

  if (!user) return null;

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-bold text-accent/70">{formatDate(todayISO())}</p>
        <h1 className="text-2xl font-black text-ink">Today</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <button className="btn-primary h-20 flex-col text-base" onClick={() => navigate('/workout')}>
          <PlusIcon width={28} height={28} />
          Start Workout
        </button>
        <button className="btn-brick h-20 flex-col text-base" onClick={() => setWeightOpen(true)}>
          <ScaleIcon width={28} height={28} />
          Log Weight
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Latest weight"
          value={data?.latestWeight ? formatWeight(data.latestWeight.weight) : '—'}
          hint={data?.latestWeight ? formatDate(data.latestWeight.date) : 'Tap Log Weight'}
        />
        <StatCard
          label="This week"
          value={data ? `${data.thisWeek}` : '—'}
          hint="workouts logged"
          accent="brick"
        />
      </div>

      <StatCard
        label="Last workout"
        value={<span className="text-base">{data?.lastSummary ?? '—'}</span>}
        hint={data?.last ? formatDate(data.last.date) : undefined}
      />

      <StatCard label="Default rest timer" value={formatRest(user.defaultRestSeconds)} />

      <Sheet open={weightOpen} title="Log body weight" onClose={() => setWeightOpen(false)}>
        <WeightForm
          userId={userId}
          onSaved={() => {
            setWeightOpen(false);
            reload();
          }}
        />
      </Sheet>
    </div>
  );
}
