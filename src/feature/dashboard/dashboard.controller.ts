import { Controller, Get, Query } from '@nestjs/common'
import { DashboardService } from './dashboard.service'
import { Public } from 'src/common/decorators/public.decorator'

@Controller('product')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Public()
  @Get('list')
  list(@Query() query: { page?: number; limit?: number }) {
    return this.dashboardService.list(query)
  }

  @Public()
  @Get()
  listAll() {
    return this.dashboardService.listAll()
  }
}
