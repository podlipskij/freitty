import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { ORDER_STATUSES, OrderStatus } from '@/modules/order';
import { DEFAULT_PERIOD, DEFAULT_VIEW, PAGE_SIZE, PERIODS, TABS, VIEWS } from './constant';
import { OrderFilters, OrderListSearchState, OrderListView } from './types';

const oneOf = <T extends string>(value: string | null, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

export function parseOrderListState(params: URLSearchParams): OrderListSearchState {
  const view = oneOf(
    params.get('view'),
    VIEWS.map((v) => v.value),
    DEFAULT_VIEW,
  );
  const status = params.get('status');
  const page = Number(params.get('page'));

  return {
    view,
    filters: {
      tab: oneOf(
        params.get('tab'),
        TABS.map((t) => t.value),
        'all',
      ),
      period: oneOf(
        params.get('period'),
        PERIODS.map((p) => p.value),
        DEFAULT_PERIOD,
      ),
      status: ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined,
      hubId: params.get('hubId') || undefined,
      search: params.get('search')?.trim() || undefined,
      page: Number.isInteger(page) && page > 0 ? page : 1,
      limit: PAGE_SIZE[view],
    },
  };
}

export function useOrderListState(): OrderListSearchState {
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  return useMemo(() => parseOrderListState(new URLSearchParams(query)), [query]);
}

export function orderListHref(
  state: OrderListSearchState,
  changes: Partial<OrderFilters & { view: OrderListView }>,
): string {
  const next = { ...state.filters, view: state.view, page: 'page' in changes ? changes.page : 1, ...changes };
  const params = new URLSearchParams();

  if (next.tab !== 'all') params.set('tab', next.tab!);
  if (next.hubId) params.set('hubId', next.hubId);
  if (next.status) params.set('status', next.status);
  if (next.period !== DEFAULT_PERIOD) params.set('period', next.period!);
  if (next.search) params.set('search', next.search);
  if (next.view !== DEFAULT_VIEW) params.set('view', next.view);
  if (next.page && next.page > 1) params.set('page', String(next.page));

  const query = params.toString();
  return query ? `/orders?${query}` : '/orders';
}
