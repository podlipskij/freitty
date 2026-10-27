import { DEFAULT_REDIRECT } from './constant';

export function safeRedirect(next: string | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return DEFAULT_REDIRECT;
  return next;
}
