import { Controller, Get, Query } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { getDashboardDto } from './dashboard.dto'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Query() query: getDashboardDto) {
    return this.dashboardService.getDashboard(query.device_id)
  }
}
