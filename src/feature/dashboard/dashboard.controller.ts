import { Controller, Get, Query } from '@nestjs/common'
import { DashboardService } from './dashboard.service'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(
    @Query() query: { projectId?: string; startDate: any; endDate: any },
  ) {
    return this.dashboardService.getDashboard(
      query.projectId,
      query.startDate,
      query.endDate,
    )
  }
}
