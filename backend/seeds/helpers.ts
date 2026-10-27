import { DeepPartial } from 'typeorm';
import { appConfig } from '../src/config/app.config';
import { OperationKind } from '../src/modules/orders/order.enums';
import { Order } from '../src/modules/orders/order.entity';
import { OrderOperation } from '../src/modules/orders/order-operation.entity';
import type { HubName } from './hubs';
import type { UserKey } from './users';

export const HOUR = 60 * 60 * 1000;
export const DAY = 24 * HOUR;
export const CUSTOMER = 'R-way Transport';
export const STANDARD_UNIT = 'Standard (48×40)';

const { timeZone: TIME_ZONE } = appConfig();

export type OrderSeed = DeepPartial<Order> & { hubName: HubName; author: UserKey };

function zoneOffset(date: Date): number {
  const inZone = new Date(date.toLocaleString('en-US', { timeZone: TIME_ZONE }));
  const inUtc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  return inZone.getTime() - inUtc.getTime();
}

export function at(days: number, hours: number, minutes = 0): Date {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE })
    .format(new Date())
    .split('-')
    .map(Number);
  const wallClock = new Date(Date.UTC(year, month - 1, day + days, hours, minutes));
  return new Date(wallClock.getTime() - zoneOffset(wallClock));
}

export function operation(
  kind: OperationKind,
  quantity: number,
  appliedAt: Date,
  trailer: string | null,
  billable: boolean,
  unit = STANDARD_UNIT,
  messagesCount = 0,
  photosCount = 0,
): DeepPartial<OrderOperation> {
  return { kind, quantity, appliedAt, trailer, billable, unit, messagesCount, photosCount };
}
