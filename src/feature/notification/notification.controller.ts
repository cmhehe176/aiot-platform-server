import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { getNotificationDto } from './notification.dtio'
import { IUser, User } from 'src/common/decorators/user.decorator'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotification(@Query() query: getNotificationDto, @User() user: IUser) {
    return this.notificationService.getNotifitacion(query, user)
  }

  @Put('reply/:id')
  reply(@Param('id') id: number, @Body() payload: { replied: number }) {
    return this.notificationService.replyNotification(id, payload.replied)
  }

  // @Delete(':id')
  // delete(@Param('id') id: number) {
  //   return this.notificationService.deleteNotification(id)
  // }
}
