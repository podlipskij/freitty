import { useEffect } from 'react';
import { NotFound } from '@/modules/main';
import { useOrderDetailStore } from '@/modules/order-detail/store';
import { LoadError } from '@/ui/components/load-error';
import { Skeleton } from '@/ui/components/skeleton';
import { ActionBar } from '../action-bar';
import { DockCard } from '../dock-card';
import { MetaGrid } from '../meta-grid';
import { OrderHeader } from '../order-header';
import { QuantityCards } from '../quantity-cards';
import { SubOrdersTable } from '../sub-orders-table';
import styles from './index.module.css';

interface OrderDetailsProps {
  number: string;
}

export function OrderDetails({ number }: OrderDetailsProps) {
  const { data: order, status, errorCode } = useOrderDetailStore((state) => state.order);
  const loadOrder = useOrderDetailStore((state) => state.loadOrder);

  useEffect(() => loadOrder(number), [loadOrder, number]);

  if (errorCode === 404) return <NotFound />;
  if (status === 'error') return <LoadError message="Could not load the order." onRetry={() => loadOrder(number)} />;
  if (!order) return <OrderDetailsSkeleton number={number} />;

  return (
    <div className={styles.page}>
      <OrderHeader order={order} />
      <ActionBar order={order} />
      <MetaGrid order={order} />

      <div className={styles.dockRow}>
        <DockCard order={order} />
        <QuantityCards order={order} />
      </div>

      {order.subOrders.length > 0 && <SubOrdersTable subOrders={order.subOrders} />}
    </div>
  );
}

const META_ROWS = 7;

function OrderDetailsSkeleton({ number }: OrderDetailsProps) {
  return (
    <div className={styles.page} aria-busy="true">
      <div className={styles.crumbs}>
        Orders <span>›</span> {number}
      </div>
      <div className={styles.row}>
        <Skeleton width={40} height={40} radius={8} />
        <Skeleton width={240} height={20} />
      </div>
      <div className={styles.row}>
        <Skeleton width={36} height={30} />
        <Skeleton width={180} height={18} />
        <Skeleton width={200} height={18} radius={10} />
      </div>
      <div className={styles.row}>
        {[48, 64, 36, 36, 36].map((width, index) => (
          <Skeleton key={index} width={width} height={30} />
        ))}
      </div>

      <div className={`${styles.block} ${styles.metaGrid}`}>
        {Array.from({ length: META_ROWS * 2 }, (_, index) => (
          <Skeleton key={index} height={14} width={index % 2 ? '60%' : '75%'} />
        ))}
      </div>

      <div className={styles.dockRow}>
        <div className={styles.block}>
          <Skeleton width={120} height={10} />
          <Skeleton height={150} radius={8} />
          <Skeleton width={140} height={12} />
        </div>
        <div className={styles.qtyCards}>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className={styles.block}>
              <Skeleton width={100} height={10} />
              <Skeleton width={48} height={28} />
              <Skeleton width="70%" height={10} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
