import { Module } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { DashboardController } from './dashboard.controller'
import { DeviceModule } from '../device/device.module'

@Module({
  imports: [DeviceModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
