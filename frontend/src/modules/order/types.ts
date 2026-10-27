import type { UserShort } from '@/modules/user';

export interface Hub {
  id: string;
  name: string;
  province: string;
}

export type OrderType = 'cross_dock' | 'consolidation';

export type OrderStatus = 'draft' | 'new' | 'in_progress' | 'completed';

export interface SubOrder {
  id: string;
  refNumber: string;
  pallets: number;
  alertMessage: string | null;
}

export interface OrderQuantity {
  standard: number;
  xl: number;
  total: number;
  label: string;
  actual: number | null;
}

export interface OrderSummary {
  id: string;
  number: string;
  type: OrderType;
  status: OrderStatus;
  serviceType: string | null;
  refNumber: string | null;
  subOrders: SubOrder[];
  alertMessage: string | null;
  requiresClientAction: boolean;
  hub: Hub;
  scheduledAt: string;
  quantity: OrderQuantity;
  carrier: string | null;
  destination: string | null;
  destinationNote: string | null;
  trailersCount: number | null;
  createdBy: UserShort;
  nextAction: string | null;
  nextActionAt: string | null;
  totalAmount: number | null;
  invoiceNumber: string | null;
}
