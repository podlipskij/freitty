import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { authConfig } from './config/auth.config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { HubsModule } from './modules/hubs/hubs.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, authConfig] }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    HubsModule,
    OrdersModule,
    DashboardModule,
  ],
})
export class AppModule {}
