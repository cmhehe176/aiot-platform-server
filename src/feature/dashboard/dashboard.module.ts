import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardController } from './dashboard.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SensorEntity } from 'src/database/entities'

@Module({
  imports: [TypeOrmModule.forFeature([SensorEntity])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
