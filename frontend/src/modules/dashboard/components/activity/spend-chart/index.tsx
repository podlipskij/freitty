import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import format from '@/services/format';
import { AXIS_TICK, CHART_COLORS, CHART_HEIGHT, TOOLTIP_STYLE } from '../constant';
import { ChartPoint } from '../types';

interface SpendChartProps {
  data: ChartPoint[];
  best: ChartPoint | null;
}

export function SpendChart({ data, best }: SpendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT} initialDimension={{ width: 400, height: CHART_HEIGHT }}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
        <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={8} />
        <YAxis tickFormatter={format.compactMoney} tick={AXIS_TICK} axisLine={false} tickLine={false} width={44} />
        <Tooltip
          cursor={{ stroke: CHART_COLORS.axis, strokeDasharray: '3 3' }}
          contentStyle={TOOLTIP_STYLE}
          formatter={(value) => [format.money(Number(value)), 'Spend']}
        />
        <Area
          type="monotone"
          dataKey="spend"
          stroke={CHART_COLORS.spend}
          strokeWidth={2}
          fill={CHART_COLORS.spend}
          fillOpacity={0.12}
          dot={{ r: 4, fill: CHART_COLORS.spend, stroke: CHART_COLORS.surface, strokeWidth: 2 }}
          activeDot={{ r: 6, stroke: CHART_COLORS.surface, strokeWidth: 2 }}
        />
        {best && (
          <ReferenceDot
            x={best.label}
            y={best.spend}
            r={7}
            fill={CHART_COLORS.spend}
            stroke={CHART_COLORS.surface}
            strokeWidth={2}
            ifOverflow="extendDomain"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
