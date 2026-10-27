import { Controller, Get } from '@nestjs/common';
import { HubsService } from './hubs.service';

@Controller('hubs')
export class HubsController {
  constructor(private readonly hubsService: HubsService) {}

  @Get()
  findAll() {
    return this.hubsService.findAll();
  }
}
