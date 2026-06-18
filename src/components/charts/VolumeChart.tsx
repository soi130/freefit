import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { VolumePoint } from '../../utils/analytics';
import { formatShortDate } from '../../utils/format';
import { useResolvedTheme } from '../../hooks/useTheme';
import { chartPalette } from './palette';

export default function VolumeChart({ data }: { data: VolumePoint[] }) {
  const p = chartPalette(useResolvedTheme() === 'dark');
  const chartData = data.map((d) => ({ ...d, x: formatShortDate(d.date) }));
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={p.grid} vertical={false} />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 11, fontWeight: 700, fill: p.tick }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={12}
          />
          <YAxis
            tick={{ fontSize: 11, fill: p.tick }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            cursor={{ fill: 'rgba(127,141,63,0.12)' }}
            contentStyle={{
              borderRadius: 12,
              border: `2px solid ${p.tooltipBorder}`,
              backgroundColor: p.tooltipBg,
              color: p.tooltipText,
              fontWeight: 700,
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value.toLocaleString()} kg`, 'Volume']}
          />
          <Bar dataKey="volume" fill="#7f8d3f" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
