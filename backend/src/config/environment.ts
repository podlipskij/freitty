export enum Environment {
  Development = 'development',
  Production = 'production',
}

export function resolveEnvironment(value = process.env.NODE_ENV): Environment {
  if (!value) return Environment.Development;
  if (!Object.values<string>(Environment).includes(value)) {
    throw new Error(`Invalid NODE_ENV: ${value} (expected ${Object.values(Environment).join(' | ')})`);
  }
  return value as Environment;
}
