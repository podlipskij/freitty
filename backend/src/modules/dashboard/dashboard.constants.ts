import { ActivityPeriod } from './dto/dashboard.query';

export interface BucketConfig {
  unit: 'day' | 'week' | 'month' | 'quarter';
  step: string;
  count: number;
  window: string;
}

export const BUCKETS: Record<ActivityPeriod, BucketConfig> = {
  day: { unit: 'day', step: '1 day', count: 14, window: 'last 14 days' },
  cw: { unit: 'week', step: '1 week', count: 12, window: 'last 12 weeks' },
  month: { unit: 'month', step: '1 month', count: 12, window: 'last 12 months' },
  quarter: { unit: 'quarter', step: '3 months', count: 8, window: 'last 8 quarters' },
};

export const RECENT_ORDERS_LIMIT = 4;
export const ATTENTION_PREVIEW_LIMIT = 3;
