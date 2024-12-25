import { Controller, Get, Query } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { IUser, User } from 'src/common/decorators/user.decorator'

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(
    @Query() query: { projectId?: number; startDate?: any; endDate?: any },
  ) {
    return this.dashboardService.getDashboard(
      query.projectId,
      query.startDate,
      query.endDate,
    )
  }

  @Get('detail')
  get(
    @Query() query: { deviceId: number; startDate?: any; endDate?: any },
    @User() user: IUser,
  ) {
    return this.dashboardService.getDetailSensor(
      +query.deviceId,
      query.startDate,
      query.endDate,
      user,
    )
  }
}
