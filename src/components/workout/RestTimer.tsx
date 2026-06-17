import type { RestTimer as RestTimerState } from '../../hooks/useRestTimer';
import { CheckIcon, CloseIcon, PauseIcon, PlayIcon, ResetIcon } from '../icons';

const btn =
  'inline-flex h-10 min-w-[2.5rem] items-center justify-center gap-1 rounded-xl border-2 border-ink bg-white px-2 text-sm font-extrabold text-ink active:translate-y-0.5';

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
      className="fixed inset-x-0 z-30 px-4"
      style={{ bottom: 'calc(68px + env(safe-area-inset-bottom))' }}
    >
      <div
        className={`mx-auto flex max-w-md items-center gap-3 rounded-card border-2 border-ink p-2.5 shadow-stroke ${
          done ? 'animate-pulse bg-brick-500 text-white' : 'bg-white'
        }`}
      >
        <div className="flex flex-col items-center px-1 leading-none">
          <span className="text-[10px] font-black uppercase tracking-wide opacity-70">
            {done ? 'Rest done' : 'Rest'}
          </span>
          <span className="font-black tabular-nums" style={{ fontSize: '1.6rem' }}>
            {fmt(secondsLeft)}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1.5">
          {done ? (
            <>
              <button className={btn} onClick={() => timer.addTime(15)} aria-label="Add 15 seconds">
                +15
              </button>
              <button className={btn} onClick={timer.reset} aria-label="Reset rest timer">
                <ResetIcon width={18} height={18} />
              </button>
              <button className={btn} onClick={timer.skip} aria-label="Dismiss rest timer">
                <CheckIcon width={18} height={18} />
              </button>
            </>
          ) : (
            <>
              <button className={btn} onClick={() => timer.addTime(-15)} aria-label="Subtract 15 seconds">
                -15
              </button>
              <button
                className={btn}
                onClick={() => (running ? timer.pause() : timer.resume())}
                aria-label={running ? 'Pause rest timer' : 'Resume rest timer'}
              >
                {running ? <PauseIcon width={18} height={18} /> : <PlayIcon width={18} height={18} />}
              </button>
              <button className={btn} onClick={() => timer.addTime(15)} aria-label="Add 15 seconds">
                +15
              </button>
              <button className={btn} onClick={timer.reset} aria-label="Reset rest timer">
                <ResetIcon width={18} height={18} />
              </button>
              <button className={btn} onClick={timer.skip} aria-label="Skip rest timer">
                <CloseIcon width={18} height={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
