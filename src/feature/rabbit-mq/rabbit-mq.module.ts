import { Module } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { RabbitMqController } from './rabbit-mq.controller';
import { ClientsModule } from '@nestjs/microservices';
import { createRabbitMqConfig } from 'src/common/util';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ClientsModule.registerAsync([createRabbitMqConfig('RABBITMQ_SERVICE')]),
    HttpModule,
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
