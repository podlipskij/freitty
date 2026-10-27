import { ConfigType, registerAs } from '@nestjs/config';
import { Environment, resolveEnvironment } from './environment';

const MIN_SECRET_LENGTH = 32;
const DEFAULT_TOKEN_TTL_SECONDS = 12 * 60 * 60;

export const authConfig = registerAs('auth', () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < MIN_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must be set and at least ${MIN_SECRET_LENGTH} characters long`);
  }

  return {
    jwtSecret,
    tokenTtlSeconds: Number(process.env.ACCESS_TOKEN_TTL_SECONDS) || DEFAULT_TOKEN_TTL_SECONDS,
    cookieName: 'access_token',
    cookieSecure: process.env.COOKIE_SECURE
      ? process.env.COOKIE_SECURE === 'true'
      : resolveEnvironment() === Environment.Production,
  };
});

export type AuthConfig = ConfigType<typeof authConfig>;
