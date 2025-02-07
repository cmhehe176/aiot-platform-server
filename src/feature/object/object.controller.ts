import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { ObjectService } from './object.service'
import { getObjectDto } from './object.dto'
import { IUser, User } from 'src/common/decorators/user.decorator'

@Controller('object')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Get()
  getObject(@Query() query: getObjectDto, @User() user: IUser) {
    return this.objectService.getObject(query, user)
  }

  @Get('detail')
  getDetailObject(@Query() payload: { message_id: string }) {
    return this.objectService.getDetailObject(payload.message_id)
  }

  @Put('reply/:id')
  reply(@Param('id') id: number, @Body() payload: { replied: number }) {
    return this.objectService.replyObject(id, payload.replied)
  }

  // @Delete(':id')
  // delete(@Param('id') id: number) {
  //   return this.objectService.deleteObject(id)
  // }
}
