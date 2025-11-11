import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with comprehensive settings
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type'],
    maxAge: 86400,
  });

  const port = process.env.PORT ?? 3000;
  const environment = process.env.NODE_ENV ?? 'development';

  // For Vercel, we need to handle the case where the app might be running as serverless functions
  if (environment !== 'production' || process.env.VERCEL_ENV !== 'production') {
    // Local development or preview environment
    await app.listen(port);
    console.log(`Weather API server running on http://0.0.0.0:${port}`);
  }

  // For production on Vercel, the app should be exported as a module
  return app;
}

// Create app instance for Vercel
let appInstance: any;

export async function getApp() {
  if (!appInstance) {
    appInstance = await bootstrap();
  }
  return appInstance;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().catch((err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
  });
}

