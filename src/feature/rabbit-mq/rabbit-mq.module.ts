import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { RabbitMqController } from './rabbit-mq.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
