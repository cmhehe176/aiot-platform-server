import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { RabbitMqController } from './rabbit-mq.controller';
import { ClientsModule } from '@nestjs/microservices';
import { createRabbitMqConfig } from 'src/common/util';

@Module({
  imports: [
    ClientsModule.registerAsync([createRabbitMqConfig('RABBITMQ_SERVICE')]),
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
