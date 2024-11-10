import { Module } from '@nestjs/common'
import { SensorService } from './sensor.service'
import { SensorController } from './sensor.controller'
import { SensorEntity } from 'src/database/entities'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([SensorEntity])],
  controllers: [SensorController],
  providers: [SensorService],
})
export class SensorModule {}
