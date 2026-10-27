import { orderListHref } from '@/modules/order-list/search-params';
import { OrderListSearchState } from '@/modules/order-list/types';
import { Button } from '@/ui/components/button';
import styles from './index.module.css';

interface PaginationProps {
  state: OrderListSearchState;
  total: number;
  shown: number;
}

export function Pagination({ state, total, shown }: PaginationProps) {
  const { page, limit = shown } = state.filters;
  const from = shown === 0 ? 0 : (page - 1) * limit + 1;
  const to = shown === 0 ? 0 : from + shown - 1;
  const hasPrev = page > 1;
  const hasNext = page * limit < total;

  return (
    <div className={styles.root}>
      <div>
        Showing {from}–{to} of {total}
      </div>
      <div className={styles.buttons}>
        {hasPrev ? (
          <Button size="sm" href={orderListHref(state, { page: page - 1 })}>
            ← Prev
          </Button>
        ) : (
          <Button size="sm" disabled>
            ← Prev
          </Button>
        )}
        {hasNext ? (
          <Button size="sm" href={orderListHref(state, { page: page + 1 })}>
            Next →
          </Button>
        ) : (
          <Button size="sm" disabled>
            Next →
          </Button>
        )}
      </div>
    </div>
  );
}
