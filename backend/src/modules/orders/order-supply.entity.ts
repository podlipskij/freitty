import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../../common/numeric.transformer';
import { Order } from './order.entity';

@Entity('order_supplies')
export class OrderSupply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.supplies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  sku: string;

  @Column()
  category: string;

  @Column()
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2, transformer: numericTransformer })
  unitPrice: number;
}
