import type { OrderSummary } from '@/modules/order';
import { Resource } from '@/services/resource';

export type OperationKind = 'unloading' | 'disposal' | 'restack' | 'loading';

export interface OrderOperation {
  id: string;
  kind: OperationKind;
  billable: boolean;
  trailer: string | null;
  quantity: number;
  unit: string;
  appliedAt: string;
  messagesCount: number;
  photosCount: number;
}

export interface OrderSupply {
  id: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderDelta {
  field: string;
  expected: number;
  actual: number;
  diff: number;
}

export interface OrderDetail extends OrderSummary {
  customer: string;
  services: string[];
  carrierPhone: string | null;
  truckNumber: string | null;
  trailerNumber: string | null;
  trailerType: string | null;
  dock: string | null;
  dockAssignedAt: string | null;
  assignedTo: string | null;
  warehouseNote: string | null;
  photosCount: number;
  photosRequired: number;
  messagesCount: number;
  completedAt: string | null;
  deltas: OrderDelta[];
}

export interface OrderSupplies {
  items: OrderSupply[];
  subtotal: number;
}

export interface OrderDetailState {
  order: Resource<OrderDetail>;
  operations: Resource<OrderOperation[]>;
  supplies: Resource<OrderSupplies>;
}

export interface OrderDetailActions {
  loadOrder: (number: string) => () => void;
  loadOperations: (number: string) => () => void;
  loadSupplies: (number: string) => () => void;
}

export type OrderDetailStore = OrderDetailState & OrderDetailActions;
