import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { ORDER_STATUSES, OrderStatus, STATUS_LABELS } from '@/modules/order';
import { PERIODS } from '@/modules/order-list/constant';
import { orderListHref } from '@/modules/order-list/search-params';
import { useOrderListStore } from '@/modules/order-list/store';
import { OrderFilters, OrderListSearchState, OrderPeriod } from '@/modules/order-list/types';
import styles from './index.module.css';

interface FiltersProps {
  state: OrderListSearchState;
}

export function Filters({ state }: FiltersProps) {
  const navigate = useNavigate();
  const { data: hubs, status: hubsStatus } = useOrderListStore((store) => store.hubs);
  const loadHubs = useOrderListStore((store) => store.loadHubs);
  const { filters } = state;

  useEffect(() => loadHubs(), [loadHubs]);

  const apply = (changes: Partial<OrderFilters>) => navigate(orderListHref(state, changes));
  const hubsLoading = !hubs && hubsStatus !== 'error';

  return (
    <div className={styles.filters}>
      <select
        className={styles.select}
        value={filters.hubId ?? ''}
        onChange={(e) => apply({ hubId: e.target.value || undefined })}
        disabled={hubsLoading}
        aria-label="Hub"
      >
        <option value="">{hubsLoading ? 'Hub: loading…' : 'Hub: All'}</option>
        {(hubs ?? []).map((hub) => (
          <option key={hub.id} value={hub.id}>
            {hub.name}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={filters.period}
        onChange={(e) => apply({ period: e.target.value as OrderPeriod })}
        aria-label="Date"
      >
        {PERIODS.map((period) => (
          <option key={period.value} value={period.value}>
            Date: {period.label}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={filters.status ?? ''}
        onChange={(e) => apply({ status: (e.target.value || undefined) as OrderStatus | undefined })}
        aria-label="Status"
      >
        <option value="">Status: Any</option>
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>

      {filters.search && (
        <span className={styles.searchChip}>
          🔍 “{filters.search}”
          <Link to={orderListHref(state, { search: undefined })} aria-label="Clear search">
            ×
          </Link>
        </span>
      )}
    </div>
  );
}
