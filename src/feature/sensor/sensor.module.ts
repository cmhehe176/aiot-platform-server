import { Module } from '@nestjs/common'
import { SensorService } from './sensor.service'
import { SensorController } from './sensor.controller'
import { SensorEntity } from 'src/database/entities'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceModule } from '../device/device.module'

@Module({
  imports: [TypeOrmModule.forFeature([SensorEntity]), DeviceModule],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {}
