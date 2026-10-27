import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hub } from './hub.entity';

@Injectable()
export class HubsService {
  constructor(@InjectRepository(Hub) private readonly hubs: Repository<Hub>) {}

  findAll(): Promise<Hub[]> {
    return this.hubs.find({ order: { name: 'ASC' } });
  }
}
