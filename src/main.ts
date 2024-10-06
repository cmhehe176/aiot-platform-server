import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = await app.get(ConfigService);
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  app.startAllMicroservices();
  await app.listen(config.get<string>('PORT'));
}

bootstrap();
