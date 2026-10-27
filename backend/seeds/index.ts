import dataSource from '../src/infrastructure/database/data-source';
import { Order } from '../src/modules/orders/order.entity';
import { CUSTOMER, DAY } from './helpers';
import { seedHubs } from './hubs';
import { activeOrders } from './orders.active';
import { historyOrders } from './orders.history';
import { seedUsers } from './users';

async function main() {
  const fresh = process.argv.includes('--fresh');
  await dataSource.initialize();
  await dataSource.runMigrations();

  if (fresh) {
    await dataSource.query('TRUNCATE users, hubs RESTART IDENTITY CASCADE');
  }

  const [{ count }] = await dataSource.query('SELECT COUNT(*)::int AS count FROM users');
  if (count > 0) {
    console.log('Database already seeded, skipping (use --fresh to reseed).');
  } else {
    await dataSource.transaction(async (manager) => {
      const users = await seedUsers(manager);
      const hubs = await seedHubs(manager);

      for (const { hubName, author, ...order } of [...activeOrders(), ...historyOrders()]) {
        const scheduledAt = (order.scheduledAt as Date).getTime();
        await manager.save(Order, {
          customer: CUSTOMER,
          hubId: hubs.get(hubName)!.id,
          createdById: users.get(author)!.id,
          createdAt: new Date(Math.min(Date.now(), scheduledAt) - 2 * DAY),
          ...order,
        });
      }
    });
    console.log('Database seeded.');
  }

  await dataSource.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
