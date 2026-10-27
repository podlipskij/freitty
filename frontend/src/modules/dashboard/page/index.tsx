import { Link, useSearchParams } from 'react-router';
import { PageHeader } from '@/ui/components/page-header';
import { Activity } from '../components/activity';
import { PERIODS } from '../components/activity/constant';
import { KpiGrid } from '../components/kpi-grid';
import { RecentOrders } from '../components/recent-orders';
import { Welcome } from '../components/welcome';
import { ActivityPeriod } from '../types';
import styles from './index.module.css';

const DEFAULT_PERIOD: ActivityPeriod = 'cw';

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawPeriod = searchParams.get('period');
  const period = PERIODS.find((p) => p.value === rawPeriod)?.value ?? DEFAULT_PERIOD;

  const selectPeriod = (next: ActivityPeriod) => setSearchParams({ period: next }, { replace: true });

  return (
    <>
      <title>Dashboard · Freitty</title>
      <PageHeader crumbs={['Home', 'Dashboard']} title={<Welcome />} />

      <KpiGrid />

      <div className={styles.sectionHead}>
        <h2>Active Orders</h2>
        <Link to="/orders">View all →</Link>
      </div>
      <RecentOrders />

      <Activity period={period} onPeriodChange={selectPeriod} />
    </>
  );
}
