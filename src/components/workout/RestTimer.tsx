import type { RestTimer as RestTimerState } from '../../hooks/useRestTimer';
import { CheckIcon, CloseIcon, PauseIcon, PlayIcon, ResetIcon } from '../icons';

const ctrl =
  'inline-flex h-14 items-center justify-center rounded-2xl border-2 border-ink bg-surface font-black text-ink active:translate-y-0.5';

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function RestTimer({ timer }: { timer: RestTimerState }) {
  if (!timer.active) return null;
  const { running, done, secondsLeft } = timer;

  return (
    <div
      className="fixed inset-x-0 z-30 px-3"
      style={{ bottom: 'calc(72px + env(safe-area-inset-bottom))' }}
    >
      <div
        className={`mx-auto max-w-md space-y-3 rounded-card border-2 border-ink p-5 text-white shadow-stroke ${
          done ? 'animate-pulse bg-brick-500' : 'bg-olive-500'
        }`}
      >
        <p className="text-center text-sm font-black uppercase tracking-[0.2em] opacity-80">
          {done ? "Time's up" : 'Rest'}
        </p>

        {/* [reset] [timer] [dismiss] */}
        <div className="flex items-center gap-3">
          <button className={`${ctrl} w-14 shrink-0`} onClick={timer.reset} aria-label="Restart rest timer">
            <ResetIcon width={26} height={26} />
          </button>
          <span className="flex-1 text-center font-black tabular-nums leading-none" style={{ fontSize: '3.25rem' }}>
            {fmt(secondsLeft)}
          </span>
          <button className={`${ctrl} w-14 shrink-0`} onClick={timer.skip} aria-label="Dismiss rest timer">
            <CloseIcon width={26} height={26} />
          </button>
        </div>

        {/* [-15] [pause/resume or done] [+15] */}
        <div className="flex items-stretch gap-3">
          <button className={`${ctrl} flex-1 text-lg`} onClick={() => timer.addTime(-15)} aria-label="Subtract 15 seconds">
            −15
          </button>
          {done ? (
            <button className={`${ctrl} flex-1`} onClick={timer.skip} aria-label="Done resting">
              <CheckIcon width={28} height={28} />
            </button>
          ) : (
            <button
              className={`${ctrl} flex-1`}
              onClick={() => (running ? timer.pause() : timer.resume())}
              aria-label={running ? 'Pause rest timer' : 'Resume rest timer'}
            >
              {running ? <PauseIcon width={26} height={26} /> : <PlayIcon width={26} height={26} />}
            </button>
          )}
          <button className={`${ctrl} flex-1 text-lg`} onClick={() => timer.addTime(15)} aria-label="Add 15 seconds">
            +15
          </button>
        </div>
      </div>
    </div>
  );
}
