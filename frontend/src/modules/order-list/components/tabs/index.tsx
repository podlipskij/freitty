import { useEffect } from 'react';
import { Link } from 'react-router';
import { TABS } from '@/modules/order-list/constant';
import { orderListHref } from '@/modules/order-list/search-params';
import { useOrderListStore } from '@/modules/order-list/store';
import { OrderListSearchState } from '@/modules/order-list/types';
import { Skeleton } from '@/ui/components/skeleton';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface TabsProps {
  state: OrderListSearchState;
}

export function Tabs({ state }: TabsProps) {
  const { data: counts } = useOrderListStore((store) => store.counts);
  const loadCounts = useOrderListStore((store) => store.loadCounts);

  useEffect(() => loadCounts(state.filters), [loadCounts, state.filters]);

  return (
    <nav className={styles.tabs} aria-busy={!counts}>
      {TABS.map((tab) => (
        <Link
          key={tab.value}
          to={orderListHref(state, { tab: tab.value })}
          className={cx(styles.tab, state.filters.tab === tab.value && styles.active)}
        >
          {tab.label}
          {counts ? (
            <span className={cx(styles.count, tab.value === 'alerts' && counts.alerts > 0 && styles.alert)}>
              {counts[tab.value]}
            </span>
          ) : (
            <Skeleton width={22} height={14} radius={8} className={styles.countSkeleton} />
          )}
        </Link>
      ))}
    </nav>
  );
}
