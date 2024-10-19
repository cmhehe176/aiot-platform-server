import { Module } from '@nestjs/common'
import { RabbitMqService } from './rabbit-mq.service'
import { RabbitMqController } from './rabbit-mq.controller'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity } from 'src/database/entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity]),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqps://xiwrmyor:62e2HWf8MasbujyKE4gLeNE1bK6Yhk9O@armadillo.rmq.cloudamqp.com/xiwrmyor',
      // enableControllerDiscovery: true,
    }),
    HttpModule,
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
