/**
 * Vercel Serverless Function Handler
 * This file is used when deploying to Vercel
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import type { IncomingMessage, ServerResponse } from 'http';

let app;

async function getApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
  }
  return app;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const app = await getApp();
  app.getHttpAdapter().getInstance()(req, res);
};

