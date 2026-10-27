import { create } from 'zustand';
import type { OrderSummary } from '@/modules/order';
import api from '@/services/api';
import { createLoader, idle } from '@/services/resource';
import { Activity, DashboardKpis, DashboardStore } from './types';

export const useDashboardStore = create<DashboardStore>()((set) => {
  const loadKpis = createLoader<DashboardKpis>((kpis) => set({ kpis }));
  const loadRecentOrders = createLoader<OrderSummary[]>((recentOrders) => set({ recentOrders }));
  const loadActivity = createLoader<Activity>((activity) => set({ activity }));

  return {
    kpis: idle(),
    recentOrders: idle(),
    activity: idle(),

    loadKpis: () => loadKpis(api.dashboard.getKpis),
    loadRecentOrders: () => loadRecentOrders(api.dashboard.getRecentOrders),
    loadActivity: (period) => loadActivity((signal) => api.dashboard.getActivity(period, signal)),
  };
});
