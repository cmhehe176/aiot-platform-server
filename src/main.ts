import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions } from '@nestjs/microservices';
import { configureQueue } from './common/util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = await app.get(ConfigService);
  app.enableCors();

  // app.connectMicroservice<MicroserviceOptions>(
  //   await configureQueue(app, 'main_queue'),
  // );

  // app.startAllMicroservices();

  await app.listen(config.get<string>('PORT'));
}

bootstrap();
