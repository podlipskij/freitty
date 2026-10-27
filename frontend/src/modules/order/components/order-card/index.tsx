import { Link } from 'react-router';
import { ReactNode } from 'react';
import { UserChip } from '@/modules/user';
import format from '@/services/format';
import { Skeleton } from '@/ui/components/skeleton';
import { cx } from '@/ui/utils';
import { OrderSummary } from '../../types';
import { orderHref } from '../../utils';
import { OrderBadges } from '../order-badges';
import { RefNumbers } from '../ref-numbers';
import { FOOTER_ICONS } from './constant';
import styles from './index.module.css';
import { nextStep, orderSubtitle } from './utils';

interface OrderCardProps {
  order: OrderSummary;
  variant?: 'full' | 'compact';
}

export function OrderCard({ order, variant = 'full' }: OrderCardProps) {
  const compact = variant === 'compact';
  const isDraft = order.status === 'draft';
  const { quantity } = order;
  const next = nextStep(order);

  const fields: { label: string; value: ReactNode; wide?: boolean }[] = [
    { label: 'Hub', value: order.hub.name },
    { label: 'Date', value: compact ? format.date(order.scheduledAt) : format.dateTime(order.scheduledAt) },
    {
      label: 'Q-ty',
      value:
        quantity.total === 0 ? (
          '—'
        ) : quantity.actual !== null && quantity.actual !== quantity.total ? (
          <>
            {quantity.total} decl ·{' '}
            <span className={styles.actual}>
              {quantity.actual} {compact ? 'act' : 'actual'}
            </span>
          </>
        ) : (
          quantity.label
        ),
    },
    { label: 'Carrier', value: order.carrier ?? '—' },
  ];

  if (!compact) {
    const destination = [order.destination, order.destinationNote].filter(Boolean).join(' · ') || '—';
    const isConsolidation = order.type === 'consolidation';
    fields.push({ label: 'Destination', value: destination, wide: !isConsolidation });
    if (isConsolidation) {
      fields.push({
        label: 'Trailers',
        value: <span className={styles.trailers}>{order.trailersCount ?? 0} consolidated</span>,
      });
    }
  }

  return (
    <article className={cx(styles.card, order.alertMessage && styles.alert, isDraft && styles.draft)}>
      <Link to={orderHref(order.number)} className={styles.link} aria-label={`Open order ${order.number}`} />

      <div className={styles.head}>
        <div>
          <div className={styles.idRow}>
            <span className={styles.number}>{order.number}</span>
            <RefNumbers
              refNumber={order.refNumber}
              subOrders={order.subOrders}
              compact={compact}
              defaultOpen={!compact && Boolean(order.alertMessage)}
            />
          </div>
          <div className={styles.subtitle}>{orderSubtitle(order, compact)}</div>
          {!isDraft && (
            <div className={styles.author}>
              <UserChip user={order.createdBy} />
            </div>
          )}
        </div>
        <OrderBadges order={order} />
      </div>

      <dl className={styles.body}>
        {fields.map((field) => (
          <div key={field.label} className={cx(field.wide && styles.wide)}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>

      <footer className={styles.footer}>
        {isDraft ? (
          <span className={styles.continue}>Continue editing →</span>
        ) : (
          <span className={cx(order.alertMessage && styles.alertText)}>
            {order.alertMessage && '⚠ '}
            {compact ? next.text : `Next: ${next.text}`}
            {next.timeLeft && !compact && (
              <>
                {' · '}
                <strong className={styles.timeLeft}>{next.timeLeft}</strong>
              </>
            )}
          </span>
        )}
        <span className={styles.icons}>
          {(isDraft ? [{ icon: '🗑', title: 'Delete draft' }] : FOOTER_ICONS).map(({ icon, title }) => (
            <span key={title} title={title}>
              {icon}
            </span>
          ))}
        </span>
      </footer>
    </article>
  );
}

export function OrderCardSkeleton({ variant = 'full' }: Pick<OrderCardProps, 'variant'>) {
  const fields = variant === 'compact' ? 4 : 6;

  return (
    <article className={styles.card} aria-busy="true">
      <div className={styles.head}>
        <div>
          <Skeleton width={150} height={16} />
          <Skeleton width={120} height={10} className={styles.skeletonLine} />
          <Skeleton width={140} height={14} radius={10} className={styles.skeletonLine} />
        </div>
        <Skeleton width={120} height={18} radius={10} />
      </div>
      <div className={styles.body}>
        {Array.from({ length: fields }, (_, index) => (
          <div key={index}>
            <Skeleton width={50} height={10} />
            <Skeleton width="70%" height={12} className={styles.skeletonLine} />
          </div>
        ))}
      </div>
      <footer className={styles.footer}>
        <Skeleton width={140} height={12} />
        <Skeleton width={110} height={22} />
      </footer>
    </article>
  );
}
