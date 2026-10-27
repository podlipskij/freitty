import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AXIS_TICK, CHART_COLORS, CHART_HEIGHT, TOOLTIP_STYLE } from '../constant';
import { ChartPoint } from '../types';

interface CompletedChartProps {
  data: ChartPoint[];
}

export function CompletedChart({ data }: CompletedChartProps) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT} initialDimension={{ width: 400, height: CHART_HEIGHT }}>
      <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={8} />
        <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} width={28} />
        <Tooltip
          cursor={{ fill: CHART_COLORS.grid }}
          contentStyle={TOOLTIP_STYLE}
          formatter={(value) => [`${value} orders`, 'Completed']}
        />
        <Bar dataKey="completed" fill={CHART_COLORS.completed} radius={[4, 4, 0, 0]} maxBarSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}
