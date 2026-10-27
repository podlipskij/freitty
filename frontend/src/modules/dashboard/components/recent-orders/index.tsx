import { useEffect } from 'react';
import { useDashboardStore } from '@/modules/dashboard/store';
import { OrderCard, OrderCardSkeleton } from '@/modules/order';
import { EmptyState } from '@/ui/components/empty-state';
import { LoadError } from '@/ui/components/load-error';
import styles from './index.module.css';

const SKELETON_CARDS = 4;

export function RecentOrders() {
  const { data: recentOrders, status } = useDashboardStore((state) => state.recentOrders);
  const loadRecentOrders = useDashboardStore((state) => state.loadRecentOrders);

  useEffect(() => loadRecentOrders(), [loadRecentOrders]);

  if (status === 'error') return <LoadError message="Could not load orders." onRetry={loadRecentOrders} />;
  if (!recentOrders) return <RecentOrdersSkeleton />;
  if (recentOrders.length === 0) return <EmptyState title="No orders yet" />;

  return (
    <div className={styles.cards}>
      {recentOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function RecentOrdersSkeleton() {
  return (
    <div className={styles.cards}>
      {Array.from({ length: SKELETON_CARDS }, (_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
}
