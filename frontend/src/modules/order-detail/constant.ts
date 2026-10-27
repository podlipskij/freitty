import type { OrderStatus } from '@/modules/order';
import { OperationKind } from './types';

export const STATUS_FLOW: OrderStatus[] = ['draft', 'new', 'in_progress', 'completed'];

export const OPERATION_LABELS: Record<OperationKind, string> = {
  unloading: 'Unloading',
  disposal: 'Disposal',
  restack: 'Restack',
  loading: 'Loading',
};
