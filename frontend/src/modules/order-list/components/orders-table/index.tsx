import { Link } from 'react-router';
import { OrderBadges, orderHref, OrderSummary, RefNumbers } from '@/modules/order';
import { UserChip } from '@/modules/user';
import format from '@/services/format';
import { Skeleton } from '@/ui/components/skeleton';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface OrdersTableProps {
  orders: OrderSummary[];
}

function TableHead() {
  return (
    <thead>
      <tr>
        <th>Order</th>
        <th>Ref N</th>
        <th>Status</th>
        <th>Hub</th>
        <th>Date</th>
        <th>Q-ty</th>
        <th>Carrier</th>
        <th>Destination</th>
        <th>Created by</th>
      </tr>
    </thead>
  );
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <TableHead />
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className={cx(order.alertMessage && styles.alert)}>
              <td>
                <Link to={orderHref(order.number)} className={styles.number}>
                  {order.number}
                </Link>
              </td>
              <td>
                <RefNumbers refNumber={order.refNumber} subOrders={order.subOrders} compact />
              </td>
              <td>
                <OrderBadges order={order} />
              </td>
              <td>{order.hub.name}</td>
              <td className={styles.nowrap}>{format.dateTime(order.scheduledAt)}</td>
              <td className={styles.nowrap}>
                {order.quantity.label}
                {order.quantity.actual !== null && order.quantity.actual !== order.quantity.total && (
                  <span className={styles.actual}> · {order.quantity.actual} act</span>
                )}
              </td>
              <td>{order.carrier ?? '—'}</td>
              <td>{order.destination ?? '—'}</td>
              <td>
                <UserChip user={order.createdBy} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SKELETON_COLUMNS = 9;

export function OrdersTableSkeleton({ rows }: { rows: number }) {
  return (
    <div className={styles.wrap} aria-busy="true">
      <table className={styles.table}>
        <TableHead />
        <tbody>
          {Array.from({ length: rows }, (_, row) => (
            <tr key={row}>
              {Array.from({ length: SKELETON_COLUMNS }, (_, cell) => (
                <td key={cell}>
                  <Skeleton height={12} width={cell === 0 ? 70 : '80%'} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
