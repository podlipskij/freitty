import type { Activity, ActivityPeriod, DashboardKpis, NeedAttention } from '@/modules/dashboard';
import type { OrderSummary } from '@/modules/order';
import { makeRequest } from './client';

const dashboard = {
  getKpis: (abortSignal?: AbortSignal) => makeRequest<DashboardKpis>('/dashboard/kpis', { abortSignal }),

  getRecentOrders: (abortSignal?: AbortSignal) =>
    makeRequest<OrderSummary[]>('/dashboard/recent-orders', { abortSignal }),

  getActivity: (period: ActivityPeriod, abortSignal?: AbortSignal) =>
    makeRequest<Activity>('/dashboard/activity', { query: { period }, abortSignal }),

  getAttention: (abortSignal?: AbortSignal) => makeRequest<NeedAttention>('/dashboard/attention', { abortSignal }),
};

export default dashboard;
