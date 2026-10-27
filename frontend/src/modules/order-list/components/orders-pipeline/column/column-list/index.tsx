import { Virtuoso } from 'react-virtuoso';
import { OrderCard, OrderCardSkeleton, OrderStatus } from '@/modules/order';
import { useOrderListStore } from '@/modules/order-list/store';
import { INITIAL_ITEMS, LIST_HEIGHT } from './constant';
import styles from './index.module.css';
import { ListContext } from './types';

interface ColumnListProps {
  status: OrderStatus;
}

function Footer({ context }: { context?: ListContext }) {
  if (context?.loading) {
    return (
      <div className={styles.footer}>
        <OrderCardSkeleton variant="compact" />
      </div>
    );
  }
  if (context?.failed) {
    return (
      <div className={styles.failed}>
        Couldn&apos;t load more
        <button type="button" className={styles.retry} onClick={context.retry}>
          Retry
        </button>
      </div>
    );
  }
  return null;
}

export function ColumnList({ status }: ColumnListProps) {
  const { items, loadingMore, failed } = useOrderListStore((store) => store.columns[status]);
  const loadMore = useOrderListStore((store) => store.loadMore);

  return (
    <Virtuoso
      style={{ height: LIST_HEIGHT }}
      data={items}
      initialItemCount={Math.min(items.length, INITIAL_ITEMS)}
      computeItemKey={(_, order) => order.id}
      endReached={() => !failed && loadMore(status)}
      context={{ loading: loadingMore, failed, retry: () => loadMore(status) }}
      components={{ Footer }}
      itemContent={(_, order) => (
        <div className={styles.item}>
          <OrderCard order={order} variant="compact" />
        </div>
      )}
    />
  );
}
