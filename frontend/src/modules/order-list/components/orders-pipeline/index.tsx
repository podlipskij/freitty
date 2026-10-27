import { ORDER_STATUSES } from '@/modules/order';
import { OrderListSearchState } from '@/modules/order-list/types';
import { Column } from './column';
import styles from './index.module.css';

interface OrdersPipelineProps {
  filters: OrderListSearchState['filters'];
}

export function OrdersPipeline({ filters }: OrdersPipelineProps) {
  return (
    <div className={styles.board}>
      {ORDER_STATUSES.map((status) => (
        <Column key={status} status={status} filters={filters} />
      ))}
    </div>
  );
}
