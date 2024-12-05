import { Body, Controller, Get, Query } from '@nestjs/common'
import { ObjectService } from './object.service'
import { getObjectDto } from './object.dto'
import { Public } from 'src/common/decorators/public.decorator'

@Controller('object')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Public()
  @Get()
  getObject(@Query() query: getObjectDto) {
    return this.objectService.getObject(query)
  }

  @Public()
  @Get('detail')
  getDetailObject(@Body() payload: { message_id: string }) {
    return this.objectService.getDetailObject(payload.message_id)
  }
}
