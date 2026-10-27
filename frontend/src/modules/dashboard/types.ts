import type { OrderSummary } from '@/modules/order';
import { Resource } from '@/services/resource';

export type ActivityPeriod = 'day' | 'cw' | 'month' | 'quarter';

export interface NeedAttention {
  total: number;
  awaitingAction: number;
  alerts: number;
  alertOrders: { number: string; message: string }[];
}

export interface ActivityBucket {
  start: string;
  completed: number;
  spend: number;
}

export interface Activity {
  period: ActivityPeriod;
  window: string;
  buckets: ActivityBucket[];
  completedTotal: number;
  spendTotal: number;
  completedChangePct: number | null;
  avgSpendPerOrder: number;
  best: { start: string; spend: number } | null;
}

export interface DashboardKpis {
  activeOrders: { value: number; createdThisWeek: number };
  completed30d: { value: number; previous: number };
  needAttention: NeedAttention;
}

export interface DashboardState {
  kpis: Resource<DashboardKpis>;
  recentOrders: Resource<OrderSummary[]>;
  activity: Resource<Activity>;
}

export interface DashboardActions {
  loadKpis: () => () => void;
  loadRecentOrders: () => () => void;
  loadActivity: (period: ActivityPeriod) => () => void;
}

export type DashboardStore = DashboardState & DashboardActions;
