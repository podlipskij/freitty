import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Order } from './order.entity';

@Entity('sub_orders')
@Unique(['orderId', 'position'])
export class SubOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.subOrders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  position: number;

  @Column({ name: 'ref_number' })
  refNumber: string;

  @Column()
  pallets: number;

  @Column({ name: 'alert_message', type: 'varchar', nullable: true })
  alertMessage: string | null;
}
