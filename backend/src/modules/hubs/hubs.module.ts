import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from './hub.entity';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hub])],
  controllers: [HubsController],
  providers: [HubsService],
})
export class HubsModule {}
