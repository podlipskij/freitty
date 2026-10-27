import { cx } from '@/ui/utils';
import { SubOrder } from '../../types';
import styles from './index.module.css';

interface RefNumbersProps {
  refNumber: string | null;
  subOrders: SubOrder[];
  compact?: boolean;
  defaultOpen?: boolean;
}

export function RefNumbers({ refNumber, subOrders, compact, defaultOpen }: RefNumbersProps) {
  if (subOrders.length === 0) {
    if (!refNumber) return null;
    return (
      <span className={styles.inline}>
        <span className={styles.label}>Ref N:</span>
        <span className={styles.value}>{refNumber}</span>
      </span>
    );
  }

  return (
    <details className={styles.multi} open={defaultOpen}>
      <summary>
        <span className={styles.label}>Ref N</span>
        <span className={styles.count}>{compact ? subOrders.length : `${subOrders.length} refs`}</span>
      </summary>
      <div className={styles.list}>
        {subOrders.map((sub) => (
          <div key={sub.id} className={styles.item}>
            <span className={styles.subId}>{sub.id}</span>
            <span className={styles.subRef}>{sub.refNumber}</span>
            <span className={cx(styles.subDesc)}>
              {sub.pallets} pallets
              {sub.alertMessage && <em className={styles.alert}> · ⚠ {sub.alertMessage.toLowerCase()}</em>}
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}
