import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity } from 'src/database/entities'
import { ProjectModule } from '../project/project.module'

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]), ProjectModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DeviceModule {}
