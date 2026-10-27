import { Badge } from '@/ui/components/badge';
import { STATUS_LABELS, STATUS_TONES, TYPE_LABELS, TYPE_TONES } from '../../constant';
import { OrderSummary } from '../../types';
import styles from './index.module.css';

interface OrderBadgesProps {
  order: Pick<OrderSummary, 'type' | 'status' | 'alertMessage'>;
  hideType?: boolean;
}

export function OrderBadges({ order, hideType }: OrderBadgesProps) {
  return (
    <span className={styles.root}>
      {!hideType && <Badge tone={TYPE_TONES[order.type]}>{TYPE_LABELS[order.type]}</Badge>}
      {order.alertMessage ? (
        <Badge tone="red" title={order.alertMessage}>
          Alert
        </Badge>
      ) : (
        <Badge tone={STATUS_TONES[order.status]}>{STATUS_LABELS[order.status]}</Badge>
      )}
    </span>
  );
}
