import format from '@/services/format';
import { TYPE_LABELS } from '../../constant';
import { OrderSummary } from '../../types';

function formatTimeLeft(iso: string, now = Date.now()): string | null {
  const minutes = Math.round((new Date(iso).getTime() - now) / 60_000);
  if (minutes <= 0) return null;
  const days = Math.floor(minutes / 1440);
  if (days > 0) return `${days}d ${Math.floor((minutes % 1440) / 60)}h`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function orderSubtitle(order: OrderSummary, compact: boolean): string {
  const type = TYPE_LABELS[order.type];
  if (order.type === 'consolidation') {
    if (order.status === 'draft' && order.subOrders.length === 0) return `${type} · incomplete`;
    return `${type} · ${order.subOrders.length} ${compact ? 'sub' : 'sub-orders'}`;
  }
  return order.serviceType ? `${type} · ${order.serviceType}` : type;
}

export function nextStep(order: OrderSummary): { text: string; timeLeft: string | null } {
  if (order.status === 'completed' && order.totalAmount !== null) {
    return {
      text: ['Paid', format.money(order.totalAmount), order.invoiceNumber].filter(Boolean).join(' · '),
      timeLeft: null,
    };
  }
  return {
    text: order.nextAction ?? '—',
    timeLeft: order.nextActionAt ? formatTimeLeft(order.nextActionAt) : null,
  };
}
