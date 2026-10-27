import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { numericTransformer } from '../../common/numeric.transformer';
import { Hub } from '../hubs/hub.entity';
import { User } from '../users/user.entity';
import { OrderOperation } from './order-operation.entity';
import { OrderSupply } from './order-supply.entity';
import { OrderStatus, OrderType } from './order.enums';
import { SubOrder } from './sub-order.entity';
import { OrderNumber } from './value-objects/order-number';
import { PalletQuantity } from './value-objects/pallet-quantity';

@Entity('orders')
@Index(['scheduledAt'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  number: number;

  @Column({ type: 'enum', enum: OrderType })
  type: OrderType;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Draft })
  status: OrderStatus;

  @Column({ name: 'service_type', type: 'varchar', nullable: true })
  serviceType: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  services: string[];

  @Column({ name: 'ref_number', type: 'varchar', nullable: true })
  refNumber: string | null;

  @Column({ name: 'alert_message', type: 'varchar', nullable: true })
  alertMessage: string | null;

  @Column({ name: 'requires_client_action', default: false })
  requiresClientAction: boolean;

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ name: 'declared_standard_qty', default: 0 })
  declaredStandardQty: number;

  @Column({ name: 'declared_xl_qty', default: 0 })
  declaredXlQty: number;

  @Column({ name: 'actual_qty', type: 'int', nullable: true })
  actualQty: number | null;

  @Column({ type: 'varchar', nullable: true })
  destination: string | null;

  @Column({ name: 'destination_note', type: 'varchar', nullable: true })
  destinationNote: string | null;

  @Column({ name: 'carrier_name', type: 'varchar', nullable: true })
  carrierName: string | null;

  @Column({ name: 'carrier_phone', type: 'varchar', nullable: true })
  carrierPhone: string | null;

  @Column({ name: 'truck_number', type: 'varchar', nullable: true })
  truckNumber: string | null;

  @Column({ name: 'trailer_number', type: 'varchar', nullable: true })
  trailerNumber: string | null;

  @Column({ name: 'trailer_type', type: 'varchar', nullable: true })
  trailerType: string | null;

  @Column({ name: 'trailers_count', type: 'int', nullable: true })
  trailersCount: number | null;

  @Column({ type: 'varchar', nullable: true })
  dock: string | null;

  @Column({ name: 'dock_assigned_at', type: 'timestamptz', nullable: true })
  dockAssignedAt: Date | null;

  @Column({ name: 'assigned_to', type: 'varchar', nullable: true })
  assignedTo: string | null;

  @Column({ name: 'warehouse_note', type: 'text', nullable: true })
  warehouseNote: string | null;

  @Column({ name: 'photos_count', default: 0 })
  photosCount: number;

  @Column({ name: 'photos_required', default: 5 })
  photosRequired: number;

  @Column({ name: 'messages_count', default: 0 })
  messagesCount: number;

  @Column({ name: 'next_action', type: 'varchar', nullable: true })
  nextAction: string | null;

  @Column({ name: 'next_action_at', type: 'timestamptz', nullable: true })
  nextActionAt: Date | null;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericTransformer,
  })
  totalAmount: number | null;

  @Column({ name: 'invoice_number', type: 'varchar', nullable: true })
  invoiceNumber: string | null;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @Column()
  customer: string;

  @Column({ name: 'hub_id' })
  hubId: string;

  @ManyToOne(() => Hub)
  @JoinColumn({ name: 'hub_id' })
  hub: Hub;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @OneToMany(() => SubOrder, (sub) => sub.order, { cascade: true })
  subOrders: SubOrder[];

  @OneToMany(() => OrderOperation, (operation) => operation.order, { cascade: true })
  operations: OrderOperation[];

  @OneToMany(() => OrderSupply, (supply) => supply.order, { cascade: true })
  supplies: OrderSupply[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  get orderNumber(): OrderNumber {
    return OrderNumber.fromNumber(this.number);
  }

  get declared(): PalletQuantity {
    return new PalletQuantity(this.declaredStandardQty, this.declaredXlQty);
  }

  get hasAlert(): boolean {
    return this.alertMessage !== null;
  }
}
