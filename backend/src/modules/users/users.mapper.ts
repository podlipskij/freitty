import { User } from './user.entity';

export const toUserProfile = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  initials: user.initials,
  role: user.role,
  avatarColor: user.avatarColor,
  balance: user.balance,
});
