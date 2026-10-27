import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { AppConfig, appConfig } from '../../config/app.config';
import { ListOrdersQuery, OrderFiltersQuery, OrderPeriod, OrderTab } from './dto/list-orders.query';
import { ACTIVE_STATUSES, OrderStatus, OrderType } from './order.enums';
import { Order } from './order.entity';
import { OrderOperation } from './order-operation.entity';
import { OrderSupply } from './order-supply.entity';
import { toOperation, toOrderDetail, toOrderSupplies, toOrderSummary } from './orders.mapper';
import { OrderNumber } from './value-objects/order-number';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(OrderOperation) private readonly operations: Repository<OrderOperation>,
    @InjectRepository(OrderSupply) private readonly supplies: Repository<OrderSupply>,
    @Inject(appConfig.KEY) private readonly config: AppConfig,
  ) {}

  async list(query: ListOrdersQuery) {
    const qb = this.filtered(query)
      .leftJoinAndSelect('o.subOrders', 'subOrder')
      .orderBy('o.scheduledAt', 'DESC')
      .addOrderBy('o.number', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    this.applyTab(qb, query.tab);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map(toOrderSummary),
      total,
      page: query.page,
      limit: query.limit,
    };
  }

  async findByNumber(rawNumber: string) {
    const number = OrderNumber.tryFromString(rawNumber);
    const order =
      number &&
      (await this.orders.findOne({
        where: { number: number.value },
        relations: { hub: true, createdBy: true, subOrders: true },
      }));

    if (!order) throw new NotFoundException(`Order ${rawNumber} not found`);
    return toOrderDetail(order);
  }

  async findOperations(rawNumber: string) {
    const orderId = await this.findIdByNumber(rawNumber);
    const operations = await this.operations.find({ where: { orderId }, order: { appliedAt: 'ASC' } });
    return operations.map(toOperation);
  }

  async findSupplies(rawNumber: string) {
    const orderId = await this.findIdByNumber(rawNumber);
    const supplies = await this.supplies.find({ where: { orderId }, order: { sku: 'ASC' } });
    return toOrderSupplies(supplies);
  }

  private async findIdByNumber(rawNumber: string): Promise<string> {
    const number = OrderNumber.tryFromString(rawNumber);
    const order = number && (await this.orders.findOne({ where: { number: number.value }, select: { id: true } }));

    if (!order) throw new NotFoundException(`Order ${rawNumber} not found`);
    return order.id;
  }

  async findRecent(limit: number) {
    const recent = (statuses: OrderStatus[], direction: 'ASC' | 'DESC', take: number) =>
      this.orders.find({
        where: { status: In(statuses) },
        relations: { hub: true, createdBy: true, subOrders: true },
        order: { scheduledAt: direction },
        take,
      });

    const active = await recent(ACTIVE_STATUSES, 'ASC', limit);
    const completed = active.length < limit ? await recent([OrderStatus.Completed], 'DESC', limit - active.length) : [];

    return [...active, ...completed].map(toOrderSummary);
  }

  private filtered(filters: OrderFiltersQuery): SelectQueryBuilder<Order> {
    const qb = this.orders
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.hub', 'hub')
      .leftJoinAndSelect('o.createdBy', 'createdBy');

    if (filters.hubId) qb.andWhere('o.hubId = :hubId', { hubId: filters.hubId });
    if (filters.status) qb.andWhere('o.status = :status', { status: filters.status });
    this.applyPeriod(qb, filters.period);

    const search = filters.search?.trim();
    if (search) {
      const number = OrderNumber.tryFromString(search) ?? (/^\d+$/.test(search) ? Number(search) : null);
      qb.andWhere(
        new Brackets((w) => {
          w.where('o.destination ILIKE :like')
            .orWhere('o.carrierName ILIKE :like')
            .orWhere('o.refNumber ILIKE :like')
            .orWhere('EXISTS (SELECT 1 FROM sub_orders s WHERE s.order_id = o.id AND s.ref_number ILIKE :like)');
          if (number !== null) {
            w.orWhere('o.number = :number', { number: typeof number === 'number' ? number : number.value });
          }
        }),
        { like: `%${search.replace(/[%_\\]/g, '\\$&')}%` },
      );
    }

    return qb;
  }

  private applyPeriod(qb: SelectQueryBuilder<Order>, period: OrderPeriod) {
    switch (period) {
      case 'today':
        qb.andWhere(
          `o.scheduledAt AT TIME ZONE :tz >= date_trunc('day', now() AT TIME ZONE :tz) AND o.scheduledAt AT TIME ZONE :tz < date_trunc('day', now() AT TIME ZONE :tz) + interval '1 day'`,
          {
            tz: this.config.timeZone,
          },
        );
        break;
      case 'week':
        qb.andWhere(
          `o.scheduledAt AT TIME ZONE :tz >= date_trunc('week', now() AT TIME ZONE :tz) AND o.scheduledAt AT TIME ZONE :tz < date_trunc('week', now() AT TIME ZONE :tz) + interval '1 week'`,
          {
            tz: this.config.timeZone,
          },
        );
        break;
      case '30d':
        qb.andWhere(`o.scheduledAt >= now() - interval '30 days'`);
        break;
    }
  }

  private applyTab(qb: SelectQueryBuilder<Order>, tab: OrderTab) {
    switch (tab) {
      case 'cross_dock':
        qb.andWhere('o.type = :type', { type: OrderType.CrossDock });
        break;
      case 'consolidation':
        qb.andWhere('o.type = :type', { type: OrderType.Consolidation });
        break;
      case 'alerts':
        qb.andWhere('o.alertMessage IS NOT NULL');
        break;
      case 'drafts':
        qb.andWhere('o.status = :draft', { draft: OrderStatus.Draft });
        break;
    }
  }

  async countByTab(filters: OrderFiltersQuery): Promise<Record<OrderTab, number>> {
    const row = await this.filtered(filters)
      .select('COUNT(*)', 'all')
      .addSelect('COUNT(*) FILTER (WHERE o.type = :crossDockType)', 'cross_dock')
      .addSelect('COUNT(*) FILTER (WHERE o.type = :consolidationType)', 'consolidation')
      .addSelect('COUNT(*) FILTER (WHERE o.alertMessage IS NOT NULL)', 'alerts')
      .addSelect('COUNT(*) FILTER (WHERE o.status = :draftStatus)', 'drafts')
      .setParameters({
        crossDockType: OrderType.CrossDock,
        consolidationType: OrderType.Consolidation,
        draftStatus: OrderStatus.Draft,
      })
      .getRawOne<Record<OrderTab, string>>();

    return {
      all: Number(row?.all ?? 0),
      cross_dock: Number(row?.cross_dock ?? 0),
      consolidation: Number(row?.consolidation ?? 0),
      alerts: Number(row?.alerts ?? 0),
      drafts: Number(row?.drafts ?? 0),
    };
  }
}
