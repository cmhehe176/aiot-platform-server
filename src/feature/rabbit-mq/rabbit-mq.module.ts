import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMqService } from './rabbit-mq.service'
import { RabbitMqController } from './rabbit-mq.controller'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity } from 'src/database/entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('RABBITMQ_PUBLIC'),
        enableControllerDiscovery: true,
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
