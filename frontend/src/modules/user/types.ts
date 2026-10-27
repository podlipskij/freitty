export type UserRole = 'admin' | 'dispatcher';

export interface UserShort {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  avatarColor: string;
}

export interface SessionUser extends UserShort {
  email: string;
  balance: number;
}
