import { CSSProperties } from 'react';
import { ActivityPeriod } from '@/modules/dashboard/types';

export const PERIODS: { value: ActivityPeriod; label: string; bucket: string }[] = [
  { value: 'day', label: 'Day', bucket: 'day' },
  { value: 'cw', label: 'CW', bucket: 'week' },
  { value: 'month', label: 'Month', bucket: 'month' },
  { value: 'quarter', label: 'Quarter', bucket: 'quarter' },
];

export const CHART_HEIGHT = 160;

export const CHART_COLORS = {
  completed: '#16A34A',
  spend: '#ED1C2E',
  grid: '#F1F5F9',
  axis: '#94A3B8',
  surface: '#FFFFFF',
};

export const AXIS_TICK = { fontSize: 10, fill: CHART_COLORS.axis };

export const TOOLTIP_STYLE: CSSProperties = {
  borderRadius: 8,
  border: '1px solid #E5E7EB',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  fontSize: 12,
  padding: '6px 10px',
};
