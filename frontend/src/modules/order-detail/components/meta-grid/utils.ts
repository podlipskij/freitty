import { OrderDetail } from '@/modules/order-detail/types';

export function declaredLabel(order: OrderDetail): string {
  const { standard, xl } = order.quantity;
  if (standard && !xl) return `${standard} Std · 48×40`;
  if (xl && !standard) return `${xl} XL · 48×48`;
  return order.quantity.label;
}
