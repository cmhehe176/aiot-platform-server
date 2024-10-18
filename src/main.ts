import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = await app.get(ConfigService);

  await app.listen(config.get<string>('PORT'));
}

bootstrap();
