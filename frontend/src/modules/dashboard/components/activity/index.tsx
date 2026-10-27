import { useEffect } from 'react';
import { useDashboardStore } from '@/modules/dashboard/store';
import { Activity as ActivityData, ActivityPeriod } from '@/modules/dashboard/types';
import format from '@/services/format';
import { Skeleton } from '@/ui/components/skeleton';
import { cx } from '@/ui/utils';
import { CompletedChart } from './completed-chart';
import { CHART_HEIGHT, PERIODS } from './constant';
import styles from './index.module.css';
import { SpendChart } from './spend-chart';
import { ChartPoint } from './types';
import { bucketLabel } from './utils';

interface ActivityProps {
  period: ActivityPeriod;
  onPeriodChange: (period: ActivityPeriod) => void;
}

export function Activity({ period, onPeriodChange }: ActivityProps) {
  const { data: activity, status } = useDashboardStore((state) => state.activity);
  const loadActivity = useDashboardStore((state) => state.loadActivity);
  const failed = status === 'error';

  useEffect(() => loadActivity(period), [loadActivity, period]);

  return (
    <section className={styles.root} aria-busy={!activity && !failed}>
      <header className={styles.header}>
        <h2>📊 Your activity</h2>
        <nav className={styles.periods}>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onPeriodChange(p.value)}
              className={cx(styles.period, p.value === period && styles.periodActive)}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </header>

      {failed ? (
        <div className={styles.insights}>Could not load activity, try another period or reload the page.</div>
      ) : activity ? (
        <ActivityCharts activity={activity} />
      ) : (
        <ActivityChartsSkeleton />
      )}
    </section>
  );
}

function ActivityCharts({ activity }: { activity: ActivityData }) {
  const { buckets, period } = activity;
  const data: ChartPoint[] = buckets.map((bucket) => ({
    label: bucketLabel(bucket.start, period),
    completed: bucket.completed,
    spend: bucket.spend,
  }));
  const best = activity.best ? (data[buckets.findIndex((b) => b.start === activity.best?.start)] ?? null) : null;
  const bucketName = PERIODS.find((p) => p.value === period)?.bucket ?? 'period';

  return (
    <>
      <div className={styles.charts}>
        <div>
          <div className={styles.chartHead}>
            <span className={styles.chartTitle}>Completed orders</span>
            <span className={cx(styles.total, styles.green)}>
              {activity.completedTotal} <small>{activity.window}</small>
            </span>
          </div>
          <CompletedChart data={data} />
        </div>

        <div>
          <div className={styles.chartHead}>
            <span className={styles.chartTitle}>Spend</span>
            <span className={cx(styles.total, styles.red)}>
              {format.money(activity.spendTotal)} <small>{activity.window}</small>
            </span>
          </div>
          <SpendChart data={data} best={best} />
        </div>
      </div>

      <footer className={styles.insights}>
        {activity.completedChangePct !== null && (
          <span>
            📈{' '}
            <strong className={activity.completedChangePct >= 0 ? styles.green : styles.red}>
              {activity.completedChangePct >= 0 ? '+' : ''}
              {activity.completedChangePct}%
            </strong>{' '}
            completed orders vs previous {data.length} {bucketName}s
          </span>
        )}
        <span>
          💰 <strong className={styles.red}>{format.money(activity.spendTotal)}</strong> spent · avg{' '}
          {format.money(activity.avgSpendPerOrder)}/order
        </span>
        {best && (
          <span>
            ⭐ Best {bucketName}: {best.label} (peak spend {format.money(best.spend)})
          </span>
        )}
      </footer>
    </>
  );
}

function ActivityChartsSkeleton() {
  return (
    <>
      <div className={styles.charts}>
        {['completed', 'spend'].map((chart) => (
          <div key={chart}>
            <div className={styles.chartHead}>
              <Skeleton width={130} height={12} />
              <Skeleton width={160} height={20} />
            </div>
            <Skeleton height={CHART_HEIGHT} radius={8} />
          </div>
        ))}
      </div>
      <div className={styles.insights}>
        <Skeleton width="70%" height={14} />
      </div>
    </>
  );
}
