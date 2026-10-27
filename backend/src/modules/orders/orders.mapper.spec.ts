import { Hub } from '../hubs/hub.entity';
import { User, UserRole } from '../users/user.entity';
import { OrderStatus, OrderType } from './order.enums';
import { Order } from './order.entity';
import { toOrderSummary } from './orders.mapper';
import { SubOrder } from './sub-order.entity';

const subOrder = (position: number, refNumber: string) =>
  Object.assign(new SubOrder(), { position, refNumber, pallets: 4, alertMessage: null });

describe('toOrderSummary', () => {
  it('maps value objects and sorts sub-orders by position', () => {
    const order = Object.assign(new Order(), {
      id: 'order-id',
      number: 1676,
      type: OrderType.Consolidation,
      status: OrderStatus.New,
      declaredStandardQty: 11,
      declaredXlQty: 1,
      actualQty: null,
      scheduledAt: new Date('2026-10-26T14:00:00Z'),
      hub: Object.assign(new Hub(), { id: 'hub-id', name: 'Toronto', province: 'ON' }),
      createdBy: Object.assign(new User(), {
        id: 'user-id',
        name: 'User 3',
        initials: 'U3',
        role: UserRole.Dispatcher,
        avatarColor: '#16A34A',
      }),
      subOrders: [subOrder(2, 'REF-B'), subOrder(1, 'REF-A')],
    });

    const summary = toOrderSummary(order);

    expect(summary.number).toBe('FR001676');
    expect(summary.quantity).toEqual({ standard: 11, xl: 1, total: 12, label: '11 × Std + 1 × XL', actual: null });
    expect(summary.subOrders.map((sub) => [sub.id, sub.refNumber])).toEqual([
      ['FR001676-1', 'REF-A'],
      ['FR001676-2', 'REF-B'],
    ]);
    expect(summary.createdBy).not.toHaveProperty('email');
  });
});
