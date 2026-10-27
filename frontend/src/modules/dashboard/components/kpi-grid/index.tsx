import { useEffect } from 'react';
import { Link } from 'react-router';
import { useDashboardStore } from '@/modules/dashboard/store';
import { LoadError } from '@/ui/components/load-error';
import { Skeleton } from '@/ui/components/skeleton';
import { cx } from '@/ui/utils';
import styles from './index.module.css';
import { completedTrend } from './utils';

export function KpiGrid() {
  const kpis = useDashboardStore((state) => state.kpis);
  const loadKpis = useDashboardStore((state) => state.loadKpis);

  useEffect(() => loadKpis(), [loadKpis]);

  if (kpis.status === 'error') return <LoadError message="Could not load KPIs." onRetry={loadKpis} />;
  if (!kpis.data) return <KpiGridSkeleton />;

  const { activeOrders, completed30d, needAttention } = kpis.data;
  const trend = completedTrend(completed30d.value, completed30d.previous);

  return (
    <div className={styles.grid}>
      <div className={cx(styles.kpi, styles.blue)}>
        <div className={styles.label}>Active Orders</div>
        <div className={styles.value}>{activeOrders.value}</div>
        <div className={cx(styles.trend, activeOrders.createdThisWeek > 0 && styles.up)}>
          {activeOrders.createdThisWeek > 0 ? `▲ ${activeOrders.createdThisWeek} this week` : 'no new this week'}
        </div>
      </div>

      <div className={cx(styles.kpi, styles.green)}>
        <div className={styles.label}>Completed (30 d)</div>
        <div className={styles.value}>{completed30d.value}</div>
        <div className={cx(styles.trend, styles[trend.direction])}>{trend.text}</div>
      </div>

      <Link to="/orders?tab=alerts" className={cx(styles.kpi, styles.attention)}>
        <div className={styles.label}>⚠ Need Attention</div>
        <div className={styles.attentionBody}>
          <div>
            <div className={styles.value}>{needAttention.total}</div>
            <div className={styles.caption}>Total</div>
          </div>
          <div className={styles.chips}>
            <span className={styles.awaiting}>{needAttention.awaitingAction} · awaiting your action</span>
            {needAttention.alertOrders.map((alert) => (
              <span key={alert.number} className={styles.alertChip}>
                alert ({alert.message.toLowerCase()} · {alert.number})
              </span>
            ))}
            {needAttention.alerts === 0 && <span className={styles.awaiting}>no alerts</span>}
          </div>
        </div>
        <div className={styles.open}>Open list →</div>
      </Link>
    </div>
  );
}

function KpiGridSkeleton() {
  return (
    <div className={styles.grid} aria-busy="true">
      {[styles.blue, styles.green].map((accent) => (
        <div key={accent} className={cx(styles.kpi, accent)}>
          <Skeleton width={110} height={10} />
          <Skeleton width={48} height={26} className={styles.skeletonValue} />
          <Skeleton width={90} height={10} />
        </div>
      ))}
      <div className={cx(styles.kpi, styles.attention)}>
        <Skeleton width={120} height={10} />
        <Skeleton width="60%" height={26} className={styles.skeletonValue} />
        <Skeleton width={80} height={10} />
      </div>
    </div>
  );
}
