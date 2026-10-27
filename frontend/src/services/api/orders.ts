import type { OrderDetail, OrderOperation, OrderSupplies } from '@/modules/order-detail';
import type { OrderCounts, OrderFilters, PaginatedOrders } from '@/modules/order-list';
import { makeRequest } from './client';

const orderPath = (number: string) => `/orders/${encodeURIComponent(number)}`;

const orders = {
  getAll: (filters: OrderFilters, abortSignal?: AbortSignal) =>
    makeRequest<PaginatedOrders>('/orders', { query: filters, abortSignal }),

  getCounts: ({ tab: _tab, page: _page, limit: _limit, ...filters }: OrderFilters, abortSignal?: AbortSignal) =>
    makeRequest<OrderCounts>('/orders/counts', { query: filters, abortSignal }),

  getByNumber: (number: string, abortSignal?: AbortSignal) =>
    makeRequest<OrderDetail>(orderPath(number), { abortSignal }),

  getOperations: (number: string, abortSignal?: AbortSignal) =>
    makeRequest<OrderOperation[]>(`${orderPath(number)}/operations`, { abortSignal }),

  getSupplies: (number: string, abortSignal?: AbortSignal) =>
    makeRequest<OrderSupplies>(`${orderPath(number)}/supplies`, { abortSignal }),
};

export default orders;
