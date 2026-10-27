export type AppEnv = 'development' | 'production';

const APP_ENVS: AppEnv[] = ['development', 'production'];

function resolveEnv(): AppEnv {
  const value = import.meta.env.VITE_APP_ENV || import.meta.env.MODE;
  if (APP_ENVS.includes(value as AppEnv)) return value as AppEnv;
  if (import.meta.env.VITE_APP_ENV) {
    throw new Error(`Invalid VITE_APP_ENV: ${value} (expected ${APP_ENVS.join(' | ')})`);
  }
  return 'development';
}

const env = resolveEnv();

export const config = {
  env,
  isDevelopment: env === 'development',
  isProduction: env === 'production',
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  timeZone: 'America/Toronto',
  locale: 'en-GB',
  moneyLocale: 'en-CA',
  currency: 'CAD',
};
