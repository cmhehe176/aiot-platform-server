import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMqService } from './rabbit-mq.service'
import { RabbitMqController } from './rabbit-mq.controller'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  DeviceEntity,
  NotificationEntity,
  ObjectEntity,
  SensorEntity,
  UserEntity,
} from 'src/database/entities'
import { MessageService } from '../message/message.service'
import { MessageModule } from '../message/message.module'
import { EmailService } from '../email/email.service'
import { SocketModule } from '../socket/socket.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeviceEntity,
      UserEntity,
      NotificationEntity,
      SensorEntity,
      ObjectEntity,
    ]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_URI'),
        enableControllerDiscovery: true,
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 30,
          reconnectTimeInSeconds: 10,
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    MessageModule,
    SocketModule,
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService, MessageService, EmailService],
})
export class RabbitMqModule {}
