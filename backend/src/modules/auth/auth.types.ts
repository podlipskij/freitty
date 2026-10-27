import { UserRole } from '../users/user.entity';

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}
