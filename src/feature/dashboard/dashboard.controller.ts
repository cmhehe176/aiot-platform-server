import { Controller, Get, Query } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { getDashboardDto } from './dashboard.dto'
import { IUser, User } from 'src/common/decorators/user.decorator'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Query() query: getDashboardDto) {
    return this.dashboardService.getTotalByDevice(query.device_id)
  }
}
