import { Link } from 'react-router';
import { VIEWS } from '@/modules/order-list/constant';
import { orderListHref } from '@/modules/order-list/search-params';
import { OrderListSearchState } from '@/modules/order-list/types';
import { cx } from '@/ui/utils';
import styles from './index.module.css';

interface ViewSwitchProps {
  state: OrderListSearchState;
}

export function ViewSwitch({ state }: ViewSwitchProps) {
  return (
    <div className={styles.switch}>
      {VIEWS.map((view) => (
        <Link
          key={view.value}
          to={orderListHref(state, { view: view.value })}
          className={cx(styles.option, state.view === view.value && styles.active)}
        >
          {view.label}
        </Link>
      ))}
    </div>
  );
}
