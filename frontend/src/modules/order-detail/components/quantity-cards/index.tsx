import { OrderDetail } from '@/modules/order-detail/types';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface QuantityCardsProps {
  order: OrderDetail;
}

const MAX_THUMBS = 2;

export function QuantityCards({ order }: QuantityCardsProps) {
  const delta = order.deltas.find((d) => d.field === 'quantity');
  const extraPhotos = order.photosCount - MAX_THUMBS;

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.label}>Expected (BOL)</div>
        <div className={styles.value}>{order.quantity.total || '—'}</div>
        <div className={styles.caption}>{order.quantity.label}</div>
      </div>

      <div className={cx(styles.card, delta && styles.warn)}>
        <div className={styles.label}>Actual (warehouse)</div>
        <div className={styles.value}>
          {order.quantity.actual ?? '—'}
          {delta && (
            <span className={styles.diff}>
              {delta.diff > 0 ? '+' : ''}
              {delta.diff}
            </span>
          )}
        </div>
        <div className={styles.caption}>{delta ? 'Delta from BOL · read-only' : 'Matches BOL'}</div>
      </div>

      <div className={styles.card}>
        <div className={styles.label}>Warehouse note</div>
        <div className={styles.note}>
          {order.warehouseNote ? `“${order.warehouseNote}”` : 'No notes from the warehouse.'}
        </div>
        {order.photosCount > 0 && (
          <div className={styles.thumbs}>
            {Array.from({ length: Math.min(order.photosCount, MAX_THUMBS) }, (_, index) => (
              <div key={index} className={styles.thumb}>
                📷
              </div>
            ))}
            {extraPhotos > 0 && <div className={styles.thumb}>+{extraPhotos}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
