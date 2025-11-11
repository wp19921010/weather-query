import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Vercel
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  const environment = process.env.NODE_ENV ?? 'development';

  // For Vercel, we need to handle the case where the app might be running as serverless functions
  if (environment !== 'production' || process.env.VERCEL_ENV !== 'production') {
    // Local development or preview environment
    await app.listen(port);
    console.log(`Weather API server running on http://localhost:${port}`);
  }

  // For production on Vercel, the app should be exported as a module
  return app;
}

// Create app instance for Vercel
let appInstance;

export async function getApp() {
  if (!appInstance) {
    appInstance = await bootstrap();
  }
  return appInstance;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

