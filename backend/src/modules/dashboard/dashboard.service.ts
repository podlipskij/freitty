import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppConfig, appConfig } from '../../config/app.config';
import { ACTIVE_STATUSES, OrderStatus } from '../orders/order.enums';
import { Order } from '../orders/order.entity';
import { OrdersService } from '../orders/orders.service';
import { ATTENTION_PREVIEW_LIMIT, BUCKETS, RECENT_ORDERS_LIMIT } from './dashboard.constants';
import { ActivityPeriod } from './dto/dashboard.query';

interface BucketRow {
  bucket: Date;
  completed: string;
  spend: string;
}

const round = (value: number) => Math.round(value * 100) / 100;

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    private readonly ordersService: OrdersService,
    @Inject(appConfig.KEY) private readonly config: AppConfig,
  ) {}

  recentOrders() {
    return this.ordersService.findRecent(RECENT_ORDERS_LIMIT);
  }

  async attention() {
    const base = this.orders
      .createQueryBuilder('o')
      .where('o.status IN (:...statuses)', { statuses: ACTIVE_STATUSES })
      .andWhere('(o.requiresClientAction = true OR o.alertMessage IS NOT NULL)');

    const [counts, alerts] = await Promise.all([
      base
        .clone()
        .select('COUNT(*)', 'total')
        .addSelect('COUNT(*) FILTER (WHERE o.requiresClientAction = true)', 'awaiting')
        .addSelect('COUNT(*) FILTER (WHERE o.alertMessage IS NOT NULL)', 'alerts')
        .getRawOne<{ total: string; awaiting: string; alerts: string }>(),
      base
        .clone()
        .andWhere('o.alertMessage IS NOT NULL')
        .orderBy('o.scheduledAt', 'ASC')
        .take(ATTENTION_PREVIEW_LIMIT)
        .getMany(),
    ]);

    return {
      total: Number(counts?.total ?? 0),
      awaitingAction: Number(counts?.awaiting ?? 0),
      alerts: Number(counts?.alerts ?? 0),
      alertOrders: alerts.map((order) => ({ number: order.orderNumber.toString(), message: order.alertMessage })),
    };
  }

  async kpis() {
    const [row, needAttention] = await Promise.all([this.kpiCounts(), this.attention()]);

    return {
      activeOrders: { value: Number(row?.active ?? 0), createdThisWeek: Number(row?.activeNew ?? 0) },
      completed30d: { value: Number(row?.completed ?? 0), previous: Number(row?.completedPrev ?? 0) },
      needAttention,
    };
  }

  private kpiCounts() {
    return this.orders
      .createQueryBuilder('o')
      .select('COUNT(*) FILTER (WHERE o.status IN (:...active))', 'active')
      .addSelect(
        `COUNT(*) FILTER (WHERE o.status IN (:...active) AND o.createdAt >= now() - interval '7 days')`,
        'activeNew',
      )
      .addSelect(`COUNT(*) FILTER (WHERE o.completedAt >= now() - interval '30 days')`, 'completed')
      .addSelect(
        `COUNT(*) FILTER (WHERE o.completedAt >= now() - interval '60 days' AND o.completedAt < now() - interval '30 days')`,
        'completedPrev',
      )
      .setParameter('active', ACTIVE_STATUSES)
      .getRawOne<Record<'active' | 'activeNew' | 'completed' | 'completedPrev', string>>();
  }

  async activity(period: ActivityPeriod) {
    const { unit, step, count, window } = BUCKETS[period];
    const rows: BucketRow[] = await this.orders.query(
      `SELECT gs AT TIME ZONE $2 AS bucket,
              COUNT(o.id) AS completed,
              COALESCE(SUM(o.total_amount), 0) AS spend
         FROM generate_series(
                date_trunc('${unit}', now() AT TIME ZONE $2) - ($1::int - 1) * interval '${step}',
                date_trunc('${unit}', now() AT TIME ZONE $2),
                interval '${step}'
              ) AS gs
         LEFT JOIN orders o
           ON o.status = '${OrderStatus.Completed}'
          AND date_trunc('${unit}', o.completed_at AT TIME ZONE $2) = gs
        GROUP BY gs
        ORDER BY gs`,
      [count * 2, this.config.timeZone],
    );

    const all = rows.map((row) => ({
      start: row.bucket,
      completed: Number(row.completed),
      spend: round(Number(row.spend)),
    }));
    const previous = all.slice(0, count);
    const buckets = all.slice(count);

    const sum = (items: typeof all, key: 'completed' | 'spend') => items.reduce((acc, item) => acc + item[key], 0);
    const completedTotal = sum(buckets, 'completed');
    const completedPrevious = sum(previous, 'completed');
    const spendTotal = round(sum(buckets, 'spend'));
    const best = buckets.reduce((top, item) => (item.spend > top.spend ? item : top), buckets[0]);

    return {
      period,
      window,
      buckets,
      completedTotal,
      spendTotal,
      completedChangePct: completedPrevious
        ? Math.round(((completedTotal - completedPrevious) / completedPrevious) * 100)
        : null,
      avgSpendPerOrder: completedTotal ? round(spendTotal / completedTotal) : 0,
      best: best && best.spend > 0 ? { start: best.start, spend: best.spend } : null,
    };
  }
}
