import { Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { NotificationEntity } from 'src/database/entities'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceModule } from '../device/device.module'

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), DeviceModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
