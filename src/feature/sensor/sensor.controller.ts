import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
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
    console.log(payload)
    return this.sensorService.getDetailSensor(payload.message_id)
  }

  @Put('reply/:id')
  reply(@Param('id') id: number, @Body() payload: { replied: number }) {
    return this.sensorService.replySensor(id, payload.replied)
  }
}
