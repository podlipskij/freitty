import { Tone } from '@/ui/types';
import { OrderStatus, OrderType } from './types';

export const STATUS_TONES: Record<OrderStatus, Tone> = {
  draft: 'gray',
  new: 'green',
  in_progress: 'blue',
  completed: 'gray',
};

export const TYPE_TONES: Record<OrderType, Tone> = {
  cross_dock: 'cyan',
  consolidation: 'violet',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  draft: 'Draft',
  new: 'New',
  in_progress: 'In progress',
  completed: 'Completed',
};

export const TYPE_LABELS: Record<OrderType, string> = {
  cross_dock: 'Cross-Dock',
  consolidation: 'Consolidation',
};

export const ORDER_STATUSES = Object.keys(STATUS_LABELS) as OrderStatus[];
