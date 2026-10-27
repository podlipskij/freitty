import type { Hub, OrderStatus, OrderSummary } from '@/modules/order';
import { Resource, ResourceStatus } from '@/services/resource';

export type OrderTab = 'all' | 'cross_dock' | 'consolidation' | 'alerts' | 'drafts';

export type OrderPeriod = 'any' | 'today' | 'week' | '30d';

export interface OrderFilters {
  tab?: OrderTab;
  hubId?: string;
  status?: OrderStatus;
  period?: OrderPeriod;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrders {
  items: OrderSummary[];
  total: number;
  page: number;
  limit: number;
}

export type OrderCounts = Record<OrderTab, number>;

export type OrderListView = 'cards' | 'table' | 'pipeline';

export interface OrderListSearchState {
  filters: OrderFilters & { tab: OrderTab; period: OrderPeriod; page: number };
  view: OrderListView;
}

export interface PipelineColumn {
  filters: OrderFilters | null;
  items: OrderSummary[];
  total: number;
  page: number;
  status: ResourceStatus;
  loadingMore: boolean;
  failed: boolean;
  exhausted: boolean;
}

export interface OrderListState {
  counts: Resource<OrderCounts>;
  list: Resource<PaginatedOrders>;
  hubs: Resource<Hub[]>;
  columns: Record<OrderStatus, PipelineColumn>;
}

export interface OrderListActions {
  loadCounts: (filters: OrderFilters) => () => void;
  loadList: (filters: OrderFilters) => () => void;
  loadHubs: () => () => void;
  loadColumn: (status: OrderStatus, filters: OrderFilters) => () => void;
  loadMore: (status: OrderStatus) => void;
}

export type OrderListStore = OrderListState & OrderListActions;
