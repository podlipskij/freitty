import type { OrderStatus } from '@/modules/order';
import { OrderFilters } from '@/modules/order-list/types';

export function isColumnEnabled(filters: OrderFilters, status: OrderStatus): boolean {
  if (filters.status) return filters.status === status;
  if (filters.tab === 'drafts') return status === 'draft';
  return true;
}

export function columnFilters({ page: _page, ...filters }: OrderFilters, status: OrderStatus): OrderFilters {
  return { ...filters, status };
}
