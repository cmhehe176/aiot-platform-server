import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMqService } from './rabbit-mq.service'
import { RabbitMqController } from './rabbit-mq.controller'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity, UserEntity } from 'src/database/entities'
import { MessageService } from '../message/message.service'
import { MessageModule } from '../message/message.module'
import { EmailService } from '../email/email.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity, UserEntity]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_PUBLIC'),
        enableControllerDiscovery: true,
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    MessageModule,
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService, MessageService, EmailService],
})
export class RabbitMqModule {}
