import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity, SubDevice } from 'src/database/entities'
import { ProjectModule } from '../project/project.module'
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceEntity, SubDevice]),
    ProjectModule,
    RabbitMqModule,
  ],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
