import type { SessionUser } from '@/modules/user';
import { makeRequest } from './client';

const users = {
  getMe: (abortSignal?: AbortSignal) => makeRequest<SessionUser>('/users/me', { abortSignal }),
};

export default users;
