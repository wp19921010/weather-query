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

    // Get the Express instance
    const instance = app.getHttpAdapter().getInstance();
    console.log('NestJS app initialized for Vercel');
    return instance;
  }
  return app.getHttpAdapter().getInstance();
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const handler = await getApp();
  return handler(req, res);
};

