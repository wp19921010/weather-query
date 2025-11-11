/**
 * Vercel Serverless Function Handler
 * This file is used when deploying to Vercel
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import type { IncomingMessage, ServerResponse } from 'http';

let app: any;

async function getApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      exposedHeaders: ['Content-Type'],
    });
    await app.init();
  }
  return app;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const app = await getApp();
  app.getHttpAdapter().getInstance()(req, res);
};

