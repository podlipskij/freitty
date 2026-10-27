import { ConfigType, registerAs } from '@nestjs/config';
import { Environment, resolveEnvironment } from './environment';

const DEFAULT_TIME_ZONE = 'America/Toronto';

function timeZone(value = DEFAULT_TIME_ZONE): string {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value });
  } catch {
    throw new Error(`Invalid TIME_ZONE: ${value}`);
  }
  return value;
}

export const appConfig = registerAs('app', () => {
  const env = resolveEnvironment();
  return {
    env,
    isProduction: env === Environment.Production,
    timeZone: timeZone(process.env.TIME_ZONE || undefined),
  };
});

export type AppConfig = ConfigType<typeof appConfig>;
