import { DataSourceOptions, LoggerOptions } from 'typeorm';
import { join } from 'path';
import { Environment, resolveEnvironment } from './environment';

type Env = Record<string, string | undefined>;

const DEV_LOGGING: LoggerOptions = ['query', 'error', 'warn'];
const PROD_LOGGING: LoggerOptions = ['error', 'warn'];

export function buildDataSourceOptions(env: Env): DataSourceOptions {
  const ssl = env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false;
  const common = {
    type: 'postgres' as const,
    entities: [join(__dirname, '../modules/**/*.entity.{ts,js}')],
    migrations: [join(__dirname, '../infrastructure/database/migrations/*.{ts,js}')],
    synchronize: false,
    logging: resolveEnvironment(env.NODE_ENV) === Environment.Development ? DEV_LOGGING : PROD_LOGGING,
    ssl,
  };

  if (env.DATABASE_URL) {
    return { ...common, url: env.DATABASE_URL };
  }

  return {
    ...common,
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? 5432),
    username: env.DB_USER,
    password: env.DB_PASSWORD || undefined,
    database: env.DB_NAME,
  };
}
