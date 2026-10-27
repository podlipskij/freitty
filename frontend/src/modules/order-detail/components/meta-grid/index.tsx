import { Fragment, ReactNode } from 'react';
import { STATUS_LABELS } from '@/modules/order';
import { OrderDetail } from '@/modules/order-detail/types';
import format from '@/services/format';
import { Badge } from '@/ui/components/badge';
import { cx } from '@/ui/utils';
import { STATUS_FLOW } from '../../constant';
import styles from './index.module.css';
import { declaredLabel } from './utils';

interface MetaGridProps {
  order: OrderDetail;
}

type Row = [label: string, value: ReactNode];

export function MetaGrid({ order }: MetaGridProps) {
  const delta = order.deltas.find((d) => d.field === 'quantity');
  const today = format.isToday(order.scheduledAt);

  const left: Row[] = [
    ['Customer', <strong key="c">{order.customer}</strong>],
    ['Hub', `${order.hub.name} (${order.hub.province})`],
    [
      'Services',
      order.services.length ? (
        <span className={styles.badges}>
          {order.services.map((service, index) => (
            <Badge key={service} tone={index % 2 ? 'violet' : 'blue'}>
              {service}
            </Badge>
          ))}
        </span>
      ) : (
        '—'
      ),
    ],
    [
      'Date',
      <span key="d" className={cx(today && styles.today)}>
        {today ? `${format.longDate(order.scheduledAt)} · today` : format.dateTime(order.scheduledAt)}
      </span>,
    ],
    ['Declared q-ty', <strong key="q">{order.quantity.total ? declaredLabel(order) : '—'}</strong>],
    [
      'Actual q-ty',
      order.quantity.actual === null ? (
        <span className={styles.muted}>not counted yet</span>
      ) : (
        <strong key="a" className={cx(delta && styles.delta)}>
          {order.quantity.actual}{' '}
          {delta && (
            <Badge tone="orange" variant="pill">
              Δ {delta.diff > 0 ? '+' : ''}
              {delta.diff}
            </Badge>
          )}
        </strong>
      ),
    ],
    [
      'Trailer type',
      order.trailerType ? (
        <Badge tone="gray" variant="pill">
          {order.trailerType}
        </Badge>
      ) : (
        '—'
      ),
    ],
    ['Destination', [order.destination, order.destinationNote].filter(Boolean).join(' · ') || '—'],
  ];

  const right: Row[] = [
    ['Carrier', <strong key="c">{order.carrier ?? '—'}</strong>],
    ['Phone', order.carrierPhone ?? '—'],
    [
      'Truck / trailer',
      order.truckNumber || order.trailerNumber ? `${order.truckNumber ?? '—'} / ${order.trailerNumber ?? '—'}` : '—',
    ],
    [
      'Dock',
      order.dock ? (
        <strong key="d" className={styles.accent}>
          {order.dock}
        </strong>
      ) : (
        '—'
      ),
    ],
    ['Assigned to', order.assignedTo ? <span className={styles.accent}>{order.assignedTo}</span> : '—'],
    [
      'Status flow',
      <span key="s" className={styles.flow}>
        {STATUS_FLOW.map((status, index) => (
          <Fragment key={status}>
            {index > 0 && ' → '}
            <span className={cx(status === order.status && styles.current)}>{STATUS_LABELS[status]}</span>
          </Fragment>
        ))}
      </span>,
    ],
    [
      'Deltas detected',
      order.deltas.length ? (
        <Badge tone="amber">{order.deltas.length} (q-ty)</Badge>
      ) : (
        <span className={styles.muted}>none</span>
      ),
    ],
  ];

  if (order.type === 'consolidation') {
    right.push(['Trailers', `${order.trailersCount ?? 0} consolidated`]);
  }

  return (
    <div className={styles.grid}>
      {[left, right].map((rows, column) => (
        <dl key={column} className={styles.column}>
          {rows.map(([label, value]) => (
            <Fragment key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
      ))}
    </div>
  );
}
