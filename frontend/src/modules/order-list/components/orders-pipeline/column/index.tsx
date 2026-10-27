import { useEffect } from 'react';
import { OrderCardSkeleton, OrderStatus, STATUS_LABELS } from '@/modules/order';
import { PIPELINE_SKELETON_CARDS } from '@/modules/order-list/constant';
import { useOrderListStore } from '@/modules/order-list/store';
import { OrderFilters } from '@/modules/order-list/types';
import { LoadError } from '@/ui/components/load-error';
import { ColumnList } from './column-list';
import styles from './index.module.css';
import { columnFilters, isColumnEnabled } from './utils';

interface ColumnProps {
  status: OrderStatus;
  filters: OrderFilters;
}

export function Column({ status, filters }: ColumnProps) {
  const column = useOrderListStore((store) => store.columns[status]);
  const loadColumn = useOrderListStore((store) => store.loadColumn);
  const enabled = isColumnEnabled(filters, status);

  useEffect(() => {
    if (enabled) return loadColumn(status, columnFilters(filters, status));
  }, [loadColumn, status, filters, enabled]);

  if (enabled && column.status === 'error') {
    return (
      <section className={styles.column}>
        <header className={styles.header}>{STATUS_LABELS[status]}</header>
        <LoadError onRetry={() => loadColumn(status, columnFilters(filters, status))} />
      </section>
    );
  }
  if (enabled && column.status !== 'ready') return <ColumnSkeleton status={status} />;

  return (
    <section className={styles.column}>
      <header className={styles.header}>
        {STATUS_LABELS[status]}
        <span className={styles.count}>{enabled ? column.total : 0}</span>
      </header>
      {enabled && column.items.length > 0 ? (
        <ColumnList status={status} />
      ) : (
        <div className={styles.empty}>No orders</div>
      )}
    </section>
  );
}

function ColumnSkeleton({ status }: { status: OrderStatus }) {
  return (
    <section className={styles.column} aria-busy="true">
      <header className={styles.header}>{STATUS_LABELS[status]}</header>
      <div className={styles.items}>
        {Array.from({ length: PIPELINE_SKELETON_CARDS }, (_, index) => (
          <OrderCardSkeleton key={index} variant="compact" />
        ))}
      </div>
    </section>
  );
}
