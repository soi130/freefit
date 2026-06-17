import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { VolumePoint } from '../../utils/analytics';
import { formatShortDate } from '../../utils/format';

export default function VolumeChart({ data }: { data: VolumePoint[] }) {
  const chartData = data.map((d) => ({ ...d, x: formatShortDate(d.date) }));
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e7cf" vertical={false} />
          <XAxis
            dataKey="x"
            tick={{ fontSize: 11, fontWeight: 700, fill: '#525e2e' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={12}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#525e2e' }}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <Tooltip
            cursor={{ fill: 'rgba(127,141,63,0.12)' }}
            contentStyle={{
              borderRadius: 12,
              border: '2px solid #33321c',
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
