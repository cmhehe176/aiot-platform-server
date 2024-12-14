import { Controller, Get, Query } from '@nestjs/common'
import { SensorService } from './sensor.service'
import { getSensorDto } from './sensor.dto'
import { IUser, User } from 'src/common/decorators/user.decorator'

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  getSensor(@Query() query: getSensorDto, @User() user: IUser) {
    return this.sensorService.getSensor(query, user)
  }

  @Get('detail')
  getDetailSensor(@Query() payload: { message_id: string }) {
    return this.sensorService.getDetailSensor(payload.message_id)
  }
}
