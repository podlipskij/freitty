import { useEffect } from 'react';
import { OrderCard, OrderCardSkeleton } from '@/modules/order';
import { PAGE_SIZE } from '@/modules/order-list/constant';
import { useOrderListStore } from '@/modules/order-list/store';
import { OrderListSearchState, OrderListView } from '@/modules/order-list/types';
import { EmptyState } from '@/ui/components/empty-state';
import { LoadError } from '@/ui/components/load-error';
import { OrdersTable, OrdersTableSkeleton } from '../orders-table';
import { Pagination } from '../pagination';
import styles from './index.module.css';

interface OrdersListProps {
  state: OrderListSearchState;
}

export function OrdersList({ state }: OrdersListProps) {
  const { data: page, status } = useOrderListStore((store) => store.list);
  const loadList = useOrderListStore((store) => store.loadList);

  useEffect(() => loadList(state.filters), [loadList, state.filters]);

  if (status === 'error') return <LoadError message="Could not load orders." onRetry={() => loadList(state.filters)} />;
  if (!page) return <OrdersListSkeleton view={state.view} />;

  if (page.items.length === 0) {
    return (
      <EmptyState icon="🔎" title="No orders match these filters">
        Try another tab, period or search query.
      </EmptyState>
    );
  }

  return (
    <>
      {state.view === 'table' ? (
        <OrdersTable orders={page.items} />
      ) : (
        <div className={styles.cards}>
          {page.items.map((order) => (
            <OrderCard key={order.id} order={order} variant="compact" />
          ))}
        </div>
      )}
      <Pagination state={state} total={page.total} shown={page.items.length} />
    </>
  );
}

const SKELETON_TABLE_ROWS = 8;

function OrdersListSkeleton({ view }: { view: OrderListView }) {
  if (view === 'table') return <OrdersTableSkeleton rows={SKELETON_TABLE_ROWS} />;

  return (
    <div className={styles.cards} aria-busy="true">
      {Array.from({ length: PAGE_SIZE.cards }, (_, index) => (
        <OrderCardSkeleton key={index} variant="compact" />
      ))}
    </div>
  );
}
