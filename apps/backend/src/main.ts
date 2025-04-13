import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type',
    exposedHeaders: 'Content-Range',
    maxAge: 86400,
  });
  await app.listen(process.env.PORT ?? 3002);
}
void bootstrap();
