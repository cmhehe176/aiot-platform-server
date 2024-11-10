import { Controller, Get, Query } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { getNotificationDto } from './notification.dtio'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotification(@Query() query: getNotificationDto) {
    return this.notificationService.getNotifitacion(query)
  }
}
