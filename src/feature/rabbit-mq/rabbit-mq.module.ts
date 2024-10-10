import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { RabbitMqController } from './rabbit-mq.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASS')}@${configService.get('RABBITMQ_HOST')}:${configService.get<number>('RABBITMQ_PORT')}`,
            ],
            queue: 'main_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
