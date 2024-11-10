import { Module } from '@nestjs/common'
import { ObjectService } from './object.service'
import { ObjectController } from './object.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ObjectEntity } from 'src/database/entities'
import { DeviceModule } from '../device/device.module'

@Module({
  imports: [TypeOrmModule.forFeature([ObjectEntity]), DeviceModule],
  controllers: [ObjectController],
  providers: [ObjectService],
})
export class ObjectModule {}
