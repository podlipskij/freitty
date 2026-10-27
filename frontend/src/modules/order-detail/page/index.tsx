import { useParams } from 'react-router';
import { OperationsTable } from '../components/operations-table';
import { OrderDetails } from '../components/order-details';
import { SuppliesTable } from '../components/supplies-table';
import styles from './index.module.css';

export function OrderDetailPage() {
  const { number = '' } = useParams();

  return (
    <div className={styles.page}>
      <title>{`${number} · Freitty`}</title>
      <OrderDetails number={number} />
      <OperationsTable number={number} />
      <SuppliesTable number={number} />
    </div>
  );
}
