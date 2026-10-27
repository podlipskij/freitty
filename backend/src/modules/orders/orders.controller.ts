import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListOrdersQuery, OrderFiltersQuery } from './dto/list-orders.query';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(@Query() query: ListOrdersQuery) {
    return this.ordersService.list(query);
  }

  @Get('counts')
  counts(@Query() query: OrderFiltersQuery) {
    return this.ordersService.countByTab(query);
  }

  @Get(':number')
  findOne(@Param('number') number: string) {
    return this.ordersService.findByNumber(number);
  }

  @Get(':number/operations')
  operations(@Param('number') number: string) {
    return this.ordersService.findOperations(number);
  }

  @Get(':number/supplies')
  supplies(@Param('number') number: string) {
    return this.ordersService.findSupplies(number);
  }
}
