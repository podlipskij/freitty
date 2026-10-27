import { EntityManager } from 'typeorm';
import { Hub } from '../src/modules/hubs/hub.entity';

const HUBS = [
  { name: 'Markham', province: 'ON' },
  { name: 'Toronto', province: 'ON' },
  { name: 'Mississauga', province: 'ON' },
] as const;

export type HubName = (typeof HUBS)[number]['name'];

export async function seedHubs(manager: EntityManager): Promise<Map<HubName, Hub>> {
  const hubs = new Map<HubName, Hub>();
  for (const hub of HUBS) hubs.set(hub.name, await manager.save(Hub, { ...hub }));
  return hubs;
}
