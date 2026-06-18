import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { WeightPoint } from '../../utils/analytics';
import { formatShortDate } from '../../utils/format';
import { useResolvedTheme } from '../../hooks/useTheme';
import { chartPalette } from './palette';

export default function WeightChart({ data }: { data: WeightPoint[] }) {
  const p = chartPalette(useResolvedTheme() === 'dark');
  const chartData = data.map((d) => ({ ...d, x: formatShortDate(d.date) }));
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
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
            domain={['dataMin - 1', 'dataMax + 1']}
            tick={{ fontSize: 11, fill: p.tick }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: `2px solid ${p.tooltipBorder}`,
              backgroundColor: p.tooltipBg,
              color: p.tooltipText,
              fontWeight: 700,
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value} kg`, 'Weight']}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#bf4a2e"
            strokeWidth={3}
            dot={{ r: 3, fill: '#bf4a2e' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
