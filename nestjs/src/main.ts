// Created by AI Agent
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false
    })
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
}

if (process.env.NODE_ENV !== 'test') {
  void bootstrap();
}

export { bootstrap };
