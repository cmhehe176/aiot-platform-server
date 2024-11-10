import { Body, Controller, Get, Query } from '@nestjs/common'
import { ObjectService } from './object.service'
import { getObjectDto } from './object.dto'

@Controller('object')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Get()
  getObject(@Query() query: getObjectDto) {
    return this.objectService.getObject(query)
  }

  @Get('detail')
  getDetailObject(@Body() payload: { message_id: string }) {
    return this.objectService.getDetailObject(payload.message_id)
  }
}
