import type { LoginPayload } from '@/modules/auth';
import type { SessionUser } from '@/modules/user';
import { makeRequest } from './client';

const auth = {
  login: (payload: LoginPayload) =>
    makeRequest<SessionUser>('/auth/login', { method: 'POST', body: payload, authRedirect: false }),
  logout: () => makeRequest<void>('/auth/logout', { method: 'POST', authRedirect: false }),
};

export default auth;
