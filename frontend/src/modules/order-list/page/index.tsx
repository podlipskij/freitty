import { Button } from '@/ui/components/button';
import { PageHeader } from '@/ui/components/page-header';
import { Filters } from '../components/filters';
import { OrdersList } from '../components/orders-list';
import { OrdersPipeline } from '../components/orders-pipeline';
import { Tabs } from '../components/tabs';
import { ViewSwitch } from '../components/view-switch';
import { useOrderListState } from '../search-params';
import styles from './index.module.css';

export function OrderListPage() {
  const state = useOrderListState();

  return (
    <>
      <title>Orders · Freitty</title>
      <PageHeader
        crumbs={['Home', 'Orders']}
        title="All Orders"
        actions={
          <Button variant="primary" disabled title="Order creation is out of scope">
            + New Order
          </Button>
        }
      />
      <Tabs state={state} />

      <div className={styles.toolbar}>
        <Filters state={state} />
        <ViewSwitch state={state} />
      </div>

      {state.view === 'pipeline' ? <OrdersPipeline filters={state.filters} /> : <OrdersList state={state} />}
    </>
  );
}
