import { todayISO } from '../../utils/format';

const WEEKS = 13;

function isoOf(d: Date): string {
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function cellColor(count: number): string {
  if (count <= 0) return '#e4e7cf';
  if (count === 1) return '#9aa654';
  if (count === 2) return '#6b7d3a';
  return '#3f4825';
}

// GitHub-style heatmap of the last 13 weeks (columns = weeks, rows = Mon–Sun).
export default function ConsistencyCalendar({ counts }: { counts: Map<string, number> }) {
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
                backgroundColor: cell.future ? 'transparent' : cellColor(cell.count),
                border: cell.future ? 'none' : '1px solid rgba(51,50,28,0.12)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
