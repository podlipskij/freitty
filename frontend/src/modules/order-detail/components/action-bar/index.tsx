import { OrderDetail } from '@/modules/order-detail/types';
import { Button } from '@/ui/components/button';
import styles from './index.module.css';

interface ActionBarProps {
  order: OrderDetail;
}

const NOT_IN_SCOPE = 'Not available in this demo';

export function ActionBar({ order }: ActionBarProps) {
  return (
    <div className={styles.bar}>
      <Button size="sm" title="Chat messages">
        💬 <span className={styles.counter}>{order.messagesCount}</span>
      </Button>
      <Button size="sm" title="Photos uploaded / required">
        📷{' '}
        <span className={styles.counter}>
          {order.photosCount}/{order.photosRequired}
        </span>
      </Button>
      <Button size="sm" title="Billing">
        $
      </Button>
      <Button size="sm" title="Print">
        🖨
      </Button>
      <Button size="sm" title="History">
        🕘
      </Button>

      <div className={styles.right}>
        <Button size="sm" disabled title={NOT_IN_SCOPE}>
          📷 Share QR
        </Button>
        <Button size="sm" variant="primary" disabled title={NOT_IN_SCOPE}>
          📥 BOL PDF
        </Button>
        <Button size="sm" variant="primary" disabled title={NOT_IN_SCOPE}>
          ✏️ Edit
        </Button>
      </div>
    </div>
  );
}
