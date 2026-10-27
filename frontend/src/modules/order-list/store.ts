import { create } from 'zustand';
import { Hub, ORDER_STATUSES, OrderStatus, OrderSummary } from '@/modules/order';
import api from '@/services/api';
import { createLoader, idle } from '@/services/resource';
import { OrderCounts, OrderListStore, PaginatedOrders, PipelineColumn } from './types';

const emptyColumn = (): PipelineColumn => ({
  filters: null,
  items: [],
  total: 0,
  page: 0,
  status: 'idle',
  loadingMore: false,
  failed: false,
  exhausted: false,
});

const emptyColumns = () =>
  Object.fromEntries(ORDER_STATUSES.map((status) => [status, emptyColumn()])) as Record<OrderStatus, PipelineColumn>;

function appendUnique(items: OrderSummary[], next: OrderSummary[]): OrderSummary[] {
  const ids = new Set(items.map((order) => order.id));
  return [...items, ...next.filter((order) => !ids.has(order.id))];
}

export const useOrderListStore = create<OrderListStore>()((set, get) => {
  const loadCounts = createLoader<OrderCounts>((counts) => set({ counts }));
  const loadList = createLoader<PaginatedOrders>((list) => set({ list }));
  const loadHubs = createLoader<Hub[]>((hubs) => set({ hubs }));

  const controllers = new Map<OrderStatus, AbortController>();
  const updateColumn = (status: OrderStatus, update: (column: PipelineColumn) => Partial<PipelineColumn>) =>
    set((state) => ({
      columns: { ...state.columns, [status]: { ...state.columns[status], ...update(state.columns[status]) } },
    }));

  return {
    counts: idle(),
    list: idle(),
    hubs: idle(),
    columns: emptyColumns(),

    loadCounts: (filters) => loadCounts((signal) => api.orders.getCounts(filters, signal)),
    loadList: (filters) => loadList((signal) => api.orders.getAll(filters, signal)),
    loadHubs: () => loadHubs((signal) => api.hubs.getAll(signal)),

    loadColumn: (status, filters) => {
      controllers.get(status)?.abort();
      const controller = new AbortController();
      controllers.set(status, controller);
      updateColumn(status, () => ({ ...emptyColumn(), filters, status: 'loading' }));

      api.orders
        .getAll({ ...filters, page: 1 }, controller.signal)
        .then((page) => {
          if (controller.signal.aborted) return;
          updateColumn(status, () => ({
            items: page.items,
            total: page.total,
            page: 1,
            status: 'ready',
            exhausted: page.items.length === 0,
          }));
        })
        .catch(() => !controller.signal.aborted && updateColumn(status, () => ({ status: 'error' })));

      return () => {
        controllers.get(status)?.abort();
        controllers.delete(status);
        updateColumn(status, emptyColumn);
      };
    },

    loadMore: (status) => {
      const column = get().columns[status];
      const controller = controllers.get(status);
      const hasMore = !column.exhausted && column.items.length < column.total;
      if (!controller || !column.filters || column.status !== 'ready' || column.loadingMore || !hasMore) return;

      updateColumn(status, () => ({ loadingMore: true, failed: false }));
      api.orders
        .getAll({ ...column.filters, page: column.page + 1 }, controller.signal)
        .then((next) => {
          if (controller.signal.aborted) return;
          updateColumn(status, (current) => ({
            items: appendUnique(current.items, next.items),
            page: next.page,
            exhausted: next.items.length === 0,
            loadingMore: false,
          }));
        })
        .catch(() => !controller.signal.aborted && updateColumn(status, () => ({ loadingMore: false, failed: true })));
    },
  };
});
