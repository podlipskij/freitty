import { OrderBadges, RefNumbers, TYPE_LABELS } from '@/modules/order';
import { OrderDetail } from '@/modules/order-detail/types';
import { UserChip } from '@/modules/user';
import { Badge } from '@/ui/components/badge';
import { Button } from '@/ui/components/button';
import styles from './index.module.css';

interface OrderHeaderProps {
  order: OrderDetail;
}

export function OrderHeader({ order }: OrderHeaderProps) {
  return (
    <header>
      <div className={styles.crumbs}>
        Orders <span>›</span> {order.number}
      </div>

      <div className={styles.titleBar}>
        <div className={styles.logo}>F</div>
        <h1>{TYPE_LABELS[order.type]} management</h1>
      </div>

      <div className={styles.row}>
        <Button href="/orders" size="sm" title="Back to orders">
          ←
        </Button>
        <span className={styles.icon}>📦</span>
        <span className={styles.label}>Order#:</span>
        <strong className={styles.number}>{order.number}</strong>
        <OrderBadges order={order} />
        <RefNumbers refNumber={order.refNumber} subOrders={order.subOrders} />
        <span className={styles.author}>
          <UserChip user={order.createdBy} variant="pill" />
        </span>
        {order.deltas.length > 0 && <Badge tone="amber">⚠ Actual ≠ Expected</Badge>}
      </div>

      {order.alertMessage && (
        <div className={styles.alert}>
          ⚠ {order.alertMessage} — {order.nextAction ?? 'action required'}
        </div>
      )}
    </header>
  );
}
