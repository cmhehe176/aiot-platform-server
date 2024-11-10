import { Controller, Get, Query } from '@nestjs/common'
import { SensorService } from './sensor.service'
import { getSensorDto } from './sensor.dto'

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  getSensor(@Query() query: getSensorDto) {
    return this.sensorService.getSensor(query)
  }

  @Get('detail')
  getDetailSensor(@Query() payload: { message_id: string }) {
    return this.sensorService.getDetailSensor(payload.message_id)
  }
}
