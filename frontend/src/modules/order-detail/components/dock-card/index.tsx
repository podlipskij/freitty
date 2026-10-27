import { OrderDetail } from '@/modules/order-detail/types';
import format from '@/services/format';
import styles from './index.module.css';
import { dockNumber } from './utils';

interface DockCardProps {
  order: OrderDetail;
}

export function DockCard({ order }: DockCardProps) {
  const number = order.dock ? dockNumber(order.dock) : null;

  return (
    <div className={styles.card}>
      <div className={styles.title}>Your assigned dock</div>
      {order.dock && number !== null ? (
        <>
          <div className={styles.schema}>
            <div className={styles.wall}>{order.hub.name.toUpperCase()} HUB</div>
            {number > 1 && <div className={`${styles.dock} ${styles.left}`}>{number - 1}</div>}
            <div className={`${styles.dock} ${styles.current}`}>DOCK {number}</div>
            <div className={`${styles.dock} ${styles.right}`}>{number + 1}</div>
            {order.trailerNumber && <div className={styles.trailer}>🚚 {order.trailerNumber}</div>}
          </div>
          <div className={styles.info}>
            <strong>{order.dock}</strong>
            {order.dockAssignedAt && (
              <div className={styles.muted}>Assigned {format.dateTime(order.dockAssignedAt)}</div>
            )}
            {order.status === 'in_progress' && order.trailerNumber && (
              <div className={styles.live}>● Trailer docked · {order.nextAction?.toLowerCase() ?? 'in progress'}</div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.empty}>Dock is not assigned yet</div>
      )}
    </div>
  );
}
