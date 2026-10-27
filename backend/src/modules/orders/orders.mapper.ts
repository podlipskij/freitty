import { User } from '../users/user.entity';
import { Order } from './order.entity';
import { OrderOperation } from './order-operation.entity';
import { OrderSupply } from './order-supply.entity';

const toUser = (user: User) => ({
  id: user.id,
  name: user.name,
  initials: user.initials,
  role: user.role,
  avatarColor: user.avatarColor,
});

export const toOperation = (operation: OrderOperation) => ({
  id: operation.id,
  kind: operation.kind,
  billable: operation.billable,
  trailer: operation.trailer,
  quantity: operation.quantity,
  unit: operation.unit,
  appliedAt: operation.appliedAt,
  messagesCount: operation.messagesCount,
  photosCount: operation.photosCount,
});

export const toSupply = (supply: OrderSupply) => ({
  id: supply.id,
  sku: supply.sku,
  category: supply.category,
  quantity: supply.quantity,
  unitPrice: supply.unitPrice,
  lineTotal: round(supply.quantity * supply.unitPrice),
});

const round = (value: number) => Math.round(value * 100) / 100;

export function toOrderSummary(order: Order) {
  const orderNumber = order.orderNumber;
  const declared = order.declared;

  return {
    id: order.id,
    number: orderNumber.toString(),
    type: order.type,
    status: order.status,
    serviceType: order.serviceType,
    refNumber: order.refNumber,
    subOrders: [...(order.subOrders ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((sub) => ({
        id: orderNumber.subOrderId(sub.position),
        refNumber: sub.refNumber,
        pallets: sub.pallets,
        alertMessage: sub.alertMessage,
      })),
    alertMessage: order.alertMessage,
    requiresClientAction: order.requiresClientAction,
    hub: { id: order.hub.id, name: order.hub.name, province: order.hub.province },
    scheduledAt: order.scheduledAt,
    quantity: {
      standard: declared.standard,
      xl: declared.xl,
      total: declared.total,
      label: declared.toString(),
      actual: order.actualQty,
    },
    carrier: order.carrierName,
    destination: order.destination,
    destinationNote: order.destinationNote,
    trailersCount: order.trailersCount,
    createdBy: toUser(order.createdBy),
    nextAction: order.nextAction,
    nextActionAt: order.nextActionAt,
    totalAmount: order.totalAmount,
    invoiceNumber: order.invoiceNumber,
  };
}

export function toOrderDetail(order: Order) {
  const declared = order.declared;
  const deltas =
    order.actualQty !== null && order.actualQty !== declared.total
      ? [
          {
            field: 'quantity',
            expected: declared.total,
            actual: order.actualQty,
            diff: order.actualQty - declared.total,
          },
        ]
      : [];

  return {
    ...toOrderSummary(order),
    customer: order.customer,
    services: order.services,
    carrierPhone: order.carrierPhone,
    truckNumber: order.truckNumber,
    trailerNumber: order.trailerNumber,
    trailerType: order.trailerType,
    dock: order.dock,
    dockAssignedAt: order.dockAssignedAt,
    assignedTo: order.assignedTo,
    warehouseNote: order.warehouseNote,
    photosCount: order.photosCount,
    photosRequired: order.photosRequired,
    messagesCount: order.messagesCount,
    completedAt: order.completedAt,
    deltas,
  };
}

export function toOrderSupplies(supplies: OrderSupply[]) {
  const items = supplies.map(toSupply);
  return { items, subtotal: round(items.reduce((sum, supply) => sum + supply.lineTotal, 0)) };
}

export type OrderSummaryResponse = ReturnType<typeof toOrderSummary>;
