import { hash } from 'bcryptjs';
import { EntityManager } from 'typeorm';
import { User, UserRole } from '../src/modules/users/user.entity';

const DEMO_PASSWORD = process.env.SEED_USER_PASSWORD || 'freitty-demo';
const USER_BALANCE = 1;

const USERS = [
  { key: 'u1', name: 'User 1', email: 'user1@rway.test', initials: 'U1', role: UserRole.Admin, avatarColor: '#5B21B6' },
  {
    key: 'u2',
    name: 'User 2',
    email: 'user2@rway.test',
    initials: 'U2',
    role: UserRole.Dispatcher,
    avatarColor: '#0EA5E9',
  },
  {
    key: 'u3',
    name: 'User 3',
    email: 'user3@rway.test',
    initials: 'U3',
    role: UserRole.Dispatcher,
    avatarColor: '#16A34A',
  },
  {
    key: 'u4',
    name: 'User 4',
    email: 'user4@rway.test',
    initials: 'U4',
    role: UserRole.Dispatcher,
    avatarColor: '#D97706',
  },
] as const;

export type UserKey = (typeof USERS)[number]['key'];

export async function seedUsers(manager: EntityManager): Promise<Map<UserKey, User>> {
  const passwordHash = await hash(DEMO_PASSWORD, 10);
  const users = new Map<UserKey, User>();
  for (const { key, ...user } of USERS) {
    users.set(key, await manager.save(User, { ...user, passwordHash, balance: USER_BALANCE }));
  }
  return users;
}
