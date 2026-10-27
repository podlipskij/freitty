import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOperation } from './order-operation.entity';
import { OrderSupply } from './order-supply.entity';
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SubOrder } from './sub-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, SubOrder, OrderOperation, OrderSupply])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
