import { OrderListView, OrderPeriod, OrderTab } from './types';

export const DEFAULT_PERIOD: OrderPeriod = '30d';
export const DEFAULT_VIEW: OrderListView = 'cards';

export const PAGE_SIZE: Record<OrderListView, number> = { cards: 12, table: 20, pipeline: 10 };

export const TABS: { value: OrderTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'cross_dock', label: 'Cross-Dock' },
  { value: 'consolidation', label: 'Consolidation' },
  { value: 'alerts', label: 'Alerts' },
  { value: 'drafts', label: 'Drafts' },
];

export const PERIODS: { value: OrderPeriod; label: string }[] = [
  { value: '30d', label: 'Last 30 days' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This week' },
  { value: 'any', label: 'Any time' },
];

export const VIEWS: { value: OrderListView; label: string }[] = [
  { value: 'cards', label: '⊞ Cards' },
  { value: 'table', label: '☰ Table' },
  { value: 'pipeline', label: '⎔ Pipeline' },
];

export const PIPELINE_SKELETON_CARDS = 2;
