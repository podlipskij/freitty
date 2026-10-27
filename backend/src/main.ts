import 'dotenv/config';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { Environment, resolveEnvironment } from './config/environment';

const LOG_LEVELS: Record<Environment, LogLevel[]> = {
  [Environment.Development]: ['error', 'warn', 'log', 'debug', 'verbose'],
  [Environment.Production]: ['error', 'warn', 'log'],
};

async function bootstrap() {
  const env = resolveEnvironment();
  const app = await NestFactory.create(AppModule, { logger: LOG_LEVELS[env] });

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  new Logger('Bootstrap').log(`API listening on :${port} (${env})`);
}

void bootstrap();
