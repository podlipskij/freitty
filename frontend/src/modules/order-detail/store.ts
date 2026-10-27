import { create } from 'zustand';
import api from '@/services/api';
import { createLoader, idle } from '@/services/resource';
import { OrderDetail, OrderDetailStore, OrderOperation, OrderSupplies } from './types';

export const useOrderDetailStore = create<OrderDetailStore>()((set) => {
  const loadOrder = createLoader<OrderDetail>((order) => set({ order }));
  const loadOperations = createLoader<OrderOperation[]>((operations) => set({ operations }));
  const loadSupplies = createLoader<OrderSupplies>((supplies) => set({ supplies }));

  return {
    order: idle(),
    operations: idle(),
    supplies: idle(),

    loadOrder: (number) => loadOrder((signal) => api.orders.getByNumber(number, signal)),
    loadOperations: (number) => loadOperations((signal) => api.orders.getOperations(number, signal)),
    loadSupplies: (number) => loadSupplies((signal) => api.orders.getSupplies(number, signal)),
  };
});
