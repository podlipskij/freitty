import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardQuery } from './dto/dashboard.query';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  kpis() {
    return this.dashboardService.kpis();
  }

  @Get('recent-orders')
  recentOrders() {
    return this.dashboardService.recentOrders();
  }

  @Get('activity')
  activity(@Query() query: DashboardQuery) {
    return this.dashboardService.activity(query.period);
  }

  @Get('attention')
  attention() {
    return this.dashboardService.attention();
  }
}
