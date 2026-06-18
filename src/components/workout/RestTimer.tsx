import type { RestTimer as RestTimerState } from '../../hooks/useRestTimer';
import { CheckIcon, CloseIcon, PauseIcon, PlayIcon, ResetIcon } from '../icons';

const btn =
  'inline-flex h-14 flex-1 items-center justify-center gap-1 rounded-2xl border-2 border-ink bg-surface text-lg font-black text-ink active:translate-y-0.5';

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
        className={`mx-auto max-w-md space-y-3 rounded-card border-2 border-ink p-4 shadow-stroke ${
          done ? 'animate-pulse bg-brick-500 text-white' : 'bg-surface'
        }`}
      >
        <div className="flex items-baseline justify-between px-1">
          <span className="text-sm font-black uppercase tracking-wide opacity-70">
            {done ? 'Rest done' : 'Rest'}
          </span>
          <span className="font-black tabular-nums leading-none" style={{ fontSize: '3rem' }}>
            {fmt(secondsLeft)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {done ? (
            <>
              <button className={btn} onClick={() => timer.addTime(15)} aria-label="Add 15 seconds">
                +15
              </button>
              <button className={btn} onClick={timer.reset} aria-label="Reset rest timer">
                <ResetIcon width={26} height={26} />
              </button>
              <button className={btn} onClick={timer.skip} aria-label="Dismiss rest timer">
                <CheckIcon width={28} height={28} />
              </button>
            </>
          ) : (
            <>
              <button className={btn} onClick={() => timer.addTime(-15)} aria-label="Subtract 15 seconds">
                −15
              </button>
              <button
                className={btn}
                onClick={() => (running ? timer.pause() : timer.resume())}
                aria-label={running ? 'Pause rest timer' : 'Resume rest timer'}
              >
                {running ? <PauseIcon width={26} height={26} /> : <PlayIcon width={26} height={26} />}
              </button>
              <button className={btn} onClick={() => timer.addTime(15)} aria-label="Add 15 seconds">
                +15
              </button>
              <button className={btn} onClick={timer.reset} aria-label="Reset rest timer">
                <ResetIcon width={26} height={26} />
              </button>
              <button className={btn} onClick={timer.skip} aria-label="Skip rest timer">
                <CloseIcon width={26} height={26} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
