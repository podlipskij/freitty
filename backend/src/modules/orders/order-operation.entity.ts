import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OperationKind } from './order.enums';
import { Order } from './order.entity';

@Entity('order_operations')
export class OrderOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.operations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'enum', enum: OperationKind })
  kind: OperationKind;

  @Column({ default: false })
  billable: boolean;

  @Column({ type: 'varchar', nullable: true })
  trailer: string | null;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column({ name: 'applied_at', type: 'timestamptz' })
  appliedAt: Date;

  @Column({ name: 'messages_count', default: 0 })
  messagesCount: number;

  @Column({ name: 'photos_count', default: 0 })
  photosCount: number;
}
