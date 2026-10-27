import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from '../../modules/users/user.entity';

export interface AuthUser {
  id: string;
  role: UserRole;
}

export type AuthenticatedRequest = Request & { user?: AuthUser };

export const SessionUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AuthUser => {
  const { user } = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
  return user!;
});
