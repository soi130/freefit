import { todayISO } from '../../utils/format';
import { useChartPalette } from './palette';

const WEEKS = 13;

function isoOf(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

// Brighter = more workouts. The ramp (light→dark or dark→light) is chosen per
// theme so "more" always stands out against the background.
function cellColor(count: number, empty: string, ramp: [string, string, string]): string {
  if (count <= 0) return empty;
  if (count === 1) return ramp[0];
  if (count === 2) return ramp[1];
  return ramp[2];
}

// GitHub-style heatmap of the last 13 weeks (columns = weeks, rows = Mon–Sun).
export default function ConsistencyCalendar({ counts }: { counts: Map<string, number> }) {
  const p = useChartPalette();
  const today = new Date();
  const todayIso = todayISO();
  const dow = (today.getDay() + 6) % 7; // Monday = 0
  const start = new Date(today);
  start.setDate(today.getDate() - dow - (WEEKS - 1) * 7);

  const columns = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const cur = new Date(start);
      cur.setDate(start.getDate() + w * 7 + d);
      const iso = isoOf(cur);
      return { iso, count: counts.get(iso) ?? 0, future: iso > todayIso };
    }),
  );

  return (
    <div className="flex justify-between gap-1">
      {columns.map((col, i) => (
        <div key={i} className="flex flex-1 flex-col gap-1">
          {col.map((cell) => (
            <div
              key={cell.iso}
              title={`${cell.iso}: ${cell.count} workout${cell.count === 1 ? '' : 's'}`}
              className="aspect-square w-full rounded-[3px]"
              style={{
                backgroundColor: cell.future ? 'transparent' : cellColor(cell.count, p.emptyCell, p.ramp),
                border: cell.future ? 'none' : `1px solid ${p.cellBorder}`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
